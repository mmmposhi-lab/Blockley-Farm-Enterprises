import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://blockleyfarmenterprises.netlify.app/';
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)].map(m => [m[1], decode(m[2])]));
const requireThat = (condition, message) => { if (!condition) throw new Error(message); };

export async function checkSite(base = root) {
  const html = await readFile(path.join(base, 'index.html'), 'utf8');
  const manifest = JSON.parse(await readFile(path.join(root, 'photo-manifest.json'), 'utf8'));
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  requireThat(new Set(ids).size === ids.length, 'Duplicate HTML IDs');
  requireThat((html.match(/<h1\b/g) || []).length === 1, 'Home page must have one H1');
  requireThat(!html.includes('res.cloudinary.com'), 'Unexpected Cloudinary rewrite in HTML');
  requireThat(/<html\b[^>]*lang="en"/.test(html), 'Missing page language');
  requireThat(/<meta name="viewport"/.test(html), 'Missing mobile viewport');
  requireThat(/<meta name="description" content="[^"]+"/.test(html), 'Missing search description');
  requireThat(html.includes(`<link rel="canonical" href="${origin}">`), 'Canonical URL mismatch');
  const references = new Set();
  for (const match of html.matchAll(/<(?:a|img|link|script|iframe)\b[^>]*>/g)) {
    const tag = match[0], a = attrs(tag), value = a.src || a.href;
    if (!value) continue;
    if (value.startsWith('#')) {
      requireThat(ids.includes(value.slice(1)), `Broken section link: ${value}`);
    } else if (!/^[a-z][a-z\d+.-]*:/i.test(value)) {
      const local = value.split(/[?#]/)[0].replace(/^\//, '');
      requireThat(!local.split('/').includes('..'), `Unsafe local path: ${value}`);
      await access(path.join(base, local));
      references.add(local);
    } else {
      requireThat(/^(https:|mailto:|tel:)/.test(value), `Unsupported link scheme: ${value}`);
    }
    if (tag.startsWith('<img')) {
      requireThat(a.alt?.trim(), `Image needs a description: ${value}`);
      const photo = manifest.find(item => item.file === value);
      requireThat(photo, `Photo has no reviewed provenance: ${value}`);
      requireThat(+a.width === photo.width && +a.height === photo.height, `Wrong photo dimensions: ${value}`);
    }
    if (tag.startsWith('<iframe')) requireThat(a.title, 'Map iframe needs a title');
    if (a.target === '_blank') requireThat(a.rel?.includes('noopener'), 'New-window link needs noopener');
  }
  for (const match of html.matchAll(/<a\b([^>]*class="image-button"[^>]*)>\s*(<img[^>]*>)/g)) {
    const link = attrs(match[1]), image = attrs(match[2]);
    requireThat(link.href === image.src, 'Gallery link and thumbnail disagree');
    requireThat(link['aria-label'] && link['data-caption'], 'Gallery link needs a name and caption');
  }
  for (const match of html.matchAll(/<div class="contact-row">([\s\S]*?)<\/div>/g)) {
    const row = match[1];
    const phones = [...row.matchAll(/href="tel:(\+263\d{9})"/g)].map(m => m[1].slice(1));
    const whatsapp = row.match(/https:\/\/wa\.me\/(\d+)\?text=/)?.[1];
    requireThat(phones.includes(whatsapp), 'WhatsApp number must match a telephone contact');
    requireThat(/mailto:[^\s"@]+@[^\s"@]+\.[^\s"@]+/.test(row), 'Contact needs a valid email link');
  }
  for (const match of html.matchAll(/<a href="tel:([^"]+)"[^>]*>([^<]+)<\/a>/g)) {
    requireThat(match[1] === match[2].replace(/[^+\d]/g, ''), 'Displayed phone number differs from link');
  }
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || 'null');
  requireThat(schema?.name === 'Blockley Farm Enterprises' && schema.url === origin, 'Invalid business schema');
  for (const photo of manifest) {
    const bytes = await readFile(path.join(base, photo.file));
    requireThat(createHash('sha256').update(bytes).digest('hex') === photo.sha256, `Photo changed without review: ${photo.file}`);
  }
  const robots = await readFile(path.join(base, 'robots.txt'), 'utf8');
  requireThat(robots.includes(`Sitemap: ${origin}sitemap.xml`), 'Robots sitemap mismatch');
  const sitemap = await readFile(path.join(base, 'sitemap.xml'), 'utf8');
  requireThat(sitemap.includes(`<loc>${origin}</loc>`), 'Sitemap canonical mismatch');
  return { references:[...references], photos:manifest.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await checkSite();
  console.log(`Site checks passed: ${result.photos} reviewed photos; local assets, anchors, contact URLs and SEO metadata valid.`);
}
