// ============================================================
//  Emily Etea — portfolio v3
//  Interactions: typewriter · scroll reveal · ripple ·
//  glitch hero · nav toggle · chip hover · dot blink
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. Scroll reveal ────────────────────────────────────
  var reveals = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -32px 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i * 60) + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ── 2. Typewriter on hero name ──────────────────────────
  var el = document.querySelector('[data-typewriter]');
  if (el && !reduceMotion) {
    try {
      var cursor = el.querySelector('.cursor');
      if (cursor) el.removeChild(cursor);
      var fullText = el.textContent;
      el.textContent = '';
      if (cursor) el.appendChild(cursor);
      var i = 0;
      function tick() {
        if (cursor) cursor.insertAdjacentText('beforebegin', fullText.slice(i - 1, i));
        else el.textContent = fullText.slice(0, i);
        i++;
        if (i <= fullText.length) setTimeout(tick, 30);
      }
      setTimeout(tick, 600);
    } catch (e) { /* static fallback */ }
  }

  // ── 3. Glitch on hero name hover ───────────────────────
  var heroName = document.querySelector('.hero-name');
  if (heroName && !reduceMotion) {
    heroName.addEventListener('mouseenter', function () {
      heroName.classList.add('glitching');
      setTimeout(function () { heroName.classList.remove('glitching'); }, 340);
    });
  }

  // ── 4. Ripple effect on all .btn clicks ─────────────────
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 1.5;
      var x = e.clientX - rect.left - size / 2;
      var y = e.clientY - rect.top  - size / 2;
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + x + 'px;top:' + y + 'px;';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });
  });

  // ── 5. Terminal red dot blink ───────────────────────────
  document.querySelectorAll('.term-dots .a').forEach(function (dot) {
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-label', 'blink');
    dot.addEventListener('click', function () {
      dot.classList.add('blink');
      setTimeout(function () { dot.classList.remove('blink'); }, 400);
    });
  });

  // ── 6. Mobile nav toggle ────────────────────────────────
  var toggle = document.querySelector('.nav-toggle');
  var nav    = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '✕ close' : '☰ menu';
    });
    // close nav when a link is clicked
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰ menu';
      });
    });
  }

  // ── 7. Contact form — mailto fallback ───────────────────
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name    = form.querySelector('[name="name"]').value.trim();
      var subject = form.querySelector('[name="subject"]').value.trim();
      var message = form.querySelector('[name="message"]').value.trim();
      var body = 'Hi Emily,\n\nMy name is ' + name + '.\n\n' + message;
      var mailto = 'mailto:emilyetea@hotmail.com'
        + '?subject=' + encodeURIComponent(subject || 'Portfolio Inquiry')
        + '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
    });
  }

  // ── 8. Chip hover micro-lift (covered by CSS, JS safety) ─
  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('mouseenter', function () {
      chip.style.transform = 'translateY(-2px)';
    });
    chip.addEventListener('mouseleave', function () {
      chip.style.transform = '';
    });
  });

  // ── 9. Parallax glow on hero section ───────────────────
  if (!reduceMotion) {
    var heroSection = document.querySelector('.hero');
    if (heroSection) {
      window.addEventListener('scroll', function () {
        var scrollY = window.scrollY;
        heroSection.style.backgroundPositionY = (scrollY * 0.3) + 'px';
      }, { passive: true });
    }
  }
});
