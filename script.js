// Use the images hosted with this site. Some deployment integrations rewrite
// image tags through an unconfigured Cloudinary account.
const siteImages = [
  'hero-farm.jpg', 'broiler-chicks.jpg', 'adult-broilers.jpg',
  'layer-hens.jpg', 'egg-handling.jpg', 'egg-supply.jpg',
  'fresh-vegetables.jpg', 'cattle.jpg', 'livestock-management.jpg',
  'cattle-orders.jpg', 'goats.jpg', 'goat-orders.jpg', 'meat-orders.jpg'
];
document.querySelectorAll('.hero-image, .gallery-grid img').forEach((img, index) => {
  if (siteImages[index]) img.src = '/assets/' + siteImages[index];
  if (index === 0) img.loading = 'eager';
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