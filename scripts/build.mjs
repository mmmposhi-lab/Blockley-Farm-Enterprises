import { mkdir, rm, readdir, copyFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { root, checkSite } from './check-site.mjs';

const checked = await checkSite();
const output = path.join(root, 'dist');
await mkdir(output, { recursive:true });
for (const item of await readdir(output)) {
  await rm(path.join(output, item), { recursive:true, force:true });
}
// Publish only page assets; exclude source history, docs, tests and unused/corrupt photos.
const files = new Set(['index.html', 'styles.css', 'script.js', 'robots.txt', 'sitemap.xml', '404.html', ...checked.references]);
for (const file of files) {
  await mkdir(path.dirname(path.join(output, file)), { recursive:true });
  await copyFile(path.join(root, file), path.join(output, file));
}
let commit = process.env.COMMIT_REF || 'working-copy';
if (!process.env.COMMIT_REF) {
  try {
    commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd:root, encoding:'utf8' }).trim();
    if (execFileSync('git', ['status', '--porcelain'], { cwd:root, encoding:'utf8' }).trim()) commit += '-working-copy';
  } catch { /* A source archive does not need Git installed. */ }
}
await writeFile(path.join(output, 'build-info.json'), JSON.stringify({ source:'mmmposhi-lab/Blockley-Farm-Enterprises', commit }, null, 2) + '\n');
if (['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT)) {
  await writeFile(path.join(output, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n');
}
await checkSite(output);
console.log(`Build passed: ${files.size} public files and build-info.json in dist/.`);
