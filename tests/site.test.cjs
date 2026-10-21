const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

class Element {
  constructor() {
    this.attributes = {};
    this.handlers = {};
    this.classes = new Set();
    this.classList = {
      add: name => this.classes.add(name),
      remove: name => this.classes.delete(name),
      contains: name => this.classes.has(name),
      toggle: name => {
        if (this.classes.has(name)) { this.classes.delete(name); return false; }
        this.classes.add(name); return true;
      }
    };
  }
  setAttribute(name, value) { this.attributes[name] = value; }
  getAttribute(name) { return this.attributes[name] ?? null; }
  addEventListener(name, handler) { (this.handlers[name] ??= []).push(handler); }
  emit(name, event = {}) { for (const fn of this.handlers[name] ?? []) fn(event); }
  querySelectorAll() { return []; }
  contains(target) { return target === this; }
  focus() { this.focused = true; }
}

function load({ images = [], menu = false, gallery = [] } = {}) {
  const toggle = menu ? new Element() : null;
  const nav = menu ? new Element() : null;
  const document = new Element();
  document.documentElement = new Element();
  document.querySelector = selector => ({ '.nav-toggle':toggle, '.primary-nav':nav }[selector] ?? null);
  document.querySelectorAll = selector => selector === '.hero-image, .gallery-grid img' ? images : selector === '.image-button' ? gallery : [];
  vm.runInNewContext(source, { document, window:{ matchMedia:() => ({ addEventListener() {} }) } });
  return { document, toggle, nav };
}

test('initialization preserves the source of every image, even when gallery order changes', () => {
  const images = [
    { src:'assets/hero-farm.jpg' },
    { src:'assets/fish-ponds-blockley-oct-2026.jpg' },
    { src:'assets/broiler-chicks.jpg' }
  ];
  const before = images.map(image => image.src);
  load({ images });
  assert.deepEqual(images.map(image => image.src), before);
});

test('Escape closes an open navigation menu and returns focus to its toggle', () => {
  const { document, toggle, nav } = load({ menu:true });
  toggle.emit('click');
  assert.equal(toggle.attributes['aria-expanded'], 'true');
  document.emit('keydown', { key:'Escape' });
  assert.equal(nav.classList.contains('open'), false);
  assert.equal(toggle.attributes['aria-expanded'], 'false');
  assert.equal(toggle.focused, true);
});

test('gallery links still work when the optional dialog is absent', () => {
  const link = new Element();
  link.querySelector = () => ({ src:'assets/egg-supply.jpg', alt:'Egg trays' });
  assert.doesNotThrow(() => {
    load({ gallery:[link] });
    link.emit('click', { preventDefault() {} });
  });
});

test('the image dialog has an accessible name', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /<dialog\b[^>]*aria-labelledby="lightbox-caption"/);
});
