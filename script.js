// Image paths and descriptions belong to index.html. Never replace them by index.
document.documentElement.classList.add('js');

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.primary-nav');
if (toggle && nav) {
  const closeMenu = (returnFocus = false) => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width: 861px)').addEventListener('change', () => closeMenu());
}
const dialog = document.querySelector('#lightbox');
const dialogImage = document.querySelector('#lightbox-image');
const dialogCaption = document.querySelector('#lightbox-caption');
const closeButton = document.querySelector('.lightbox-close');
if (dialog && dialogImage && dialogCaption && typeof dialog.showModal === 'function') {
  let opener;
  document.querySelectorAll('.image-button').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const img = link.querySelector('img');
      if (!img) return;
      event.preventDefault();
      opener = link;
      dialogImage.src = img.currentSrc || img.src;
      dialogImage.alt = img.alt;
      dialogCaption.textContent = link.dataset.caption || img.alt;
      dialog.showModal();
    });
  });
  closeButton?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  // Native dialog handles Escape and focus containment.
  dialog.addEventListener('close', () => opener?.focus());
}
