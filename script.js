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

  function setExpanded(row, open) {
    row.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  accs.forEach(function (acc) {
    var row = acc.querySelector('[data-row]');
    if (!row) return;
    if (acc.hasAttribute('data-disabled')) {
      row.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); });
      return;
    }

    row.setAttribute('role', 'button');
    row.setAttribute('tabindex', '0');
    row.setAttribute('aria-expanded', 'false');

    function toggle() {
      var wasOpen = acc.hasAttribute('data-open');
      accs.forEach(function (other) {
        other.removeAttribute('data-open');
        var r = other.querySelector('[data-row]');
        if (r && !other.hasAttribute('data-disabled')) setExpanded(r, false);
      });
      if (!wasOpen) {
        acc.setAttribute('data-open', '');
        setExpanded(row, true);
      }
    }

    row.addEventListener('click', toggle);
    row.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
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
