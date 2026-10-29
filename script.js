// Keep each image paired with the photo selected in the HTML, even when
// deployment integrations wrap its URL through Cloudinary.
document.querySelectorAll('.hero-image, .gallery-grid img').forEach(img => {
  const source = img.getAttribute('src') || '';
  const asset = source.match(/(?:^|\/)assets\/([^/?#]+)(?:[?#]|$)/);
  if (asset) img.src = '/assets/' + asset[1];
  if (img.classList.contains('hero-image')) img.loading = 'eager';
});

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.primary-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}
const dialog = document.querySelector('#lightbox');
const dialogImage = document.querySelector('#lightbox-image');
const dialogCaption = document.querySelector('#lightbox-caption');
const closeButton = document.querySelector('.lightbox-close');
document.querySelectorAll('.image-button').forEach(button => {
  button.addEventListener('click', () => {
    dialogImage.src = button.querySelector('img').src;
    dialogImage.alt = button.querySelector('img').alt;
    dialogCaption.textContent = button.dataset.caption || '';
    dialog.showModal();
  });
});
closeButton?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && dialog?.open) dialog.close();
});