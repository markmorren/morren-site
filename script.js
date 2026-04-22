/* ==========================================================================
   Morren — script.js
   - Accordion (single-open), disabled rows blocked
   - Active nav link on scroll
   CSP-safe: no eval, no inline handlers.
   ========================================================================== */

(function () {
  'use strict';

  // ---- Accordion ----
  var accs = document.querySelectorAll('[data-acc]');
  accs.forEach(function (acc) {
    var row = acc.querySelector('[data-row]');
    if (!row) return;
    if (acc.hasAttribute('data-disabled')) {
      row.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); });
      return;
    }
    row.addEventListener('click', function () {
      var wasOpen = acc.hasAttribute('data-open');
      // close all
      accs.forEach(function (other) { other.removeAttribute('data-open'); });
      if (!wasOpen) acc.setAttribute('data-open', '');
    });
  });

  // ---- Active nav link on scroll ----
  var sections = [
    { id: 'top',     link: document.querySelector('.nav-r a[href="#top"]') },
    { id: 'work',    link: document.querySelector('.nav-r a[href="#work"]') },
    { id: 'about',   link: document.querySelector('.nav-r a[href="#about"]') },
    { id: 'cv',      link: document.querySelector('.nav-r a[href="#cv"]') },
    { id: 'contact', link: document.querySelector('.nav-r a[href="#contact"]') }
  ].filter(function (s) { return s.link; });

  function setActive() {
    var y = window.scrollY + 120;
    var active = sections[0];
    sections.forEach(function (s) {
      var el = document.getElementById(s.id);
      if (el && el.offsetTop <= y) active = s;
    });
    sections.forEach(function (s) { s.link.classList.toggle('on', s === active); });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

})();
