// ============================================================
//  Emily Etea — portfolio scripts  v2
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----------------------------------------------------------
  // 1. Typewriter effect on the homepage hero name
  // ----------------------------------------------------------
  var el = document.querySelector('[data-typewriter]');
  if (el) {
    if (!reduceMotion) {
      try {
        var cursor = el.querySelector('.cursor');
        if (cursor) el.removeChild(cursor);
        var fullText = el.textContent;
        el.textContent = '';
        if (cursor) el.appendChild(cursor);

        var i = 0;
        var speed = 26;
        function tick() {
          if (cursor) {
            cursor.insertAdjacentText('beforebegin', fullText.slice(i - 1, i));
          } else {
            el.textContent = fullText.slice(0, i);
          }
          i++;
          if (i <= fullText.length) setTimeout(tick, speed);
        }
        // slight delay before starting
        setTimeout(tick, 400);
      } catch (e) {
        if (el) el.textContent = fullText || '';
      }
    }
  }

  // ----------------------------------------------------------
  // 2. Scroll-fade cmd-block sections (staggered)
  // ----------------------------------------------------------
  var blocks = document.querySelectorAll('.cmd-block');

  if (reduceMotion) {
    blocks.forEach(function (b) { b.classList.add('is-visible'); });
  } else if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -28px 0px' });

    blocks.forEach(function (b, i) {
      b.style.transitionDelay = (i * 55) + 'ms';
      observer.observe(b);
    });
  } else {
    blocks.forEach(function (b) { b.classList.add('is-visible'); });
  }

  // ----------------------------------------------------------
  // 3. Terminal dot easter egg — red dot blinks window
  // ----------------------------------------------------------
  var dotA = document.querySelector('.term-dots .a');
  var termWindow = document.querySelector('.term-window');
  if (dotA && termWindow) {
    dotA.setAttribute('role', 'button');
    dotA.setAttribute('aria-label', 'Toggle terminal');
    dotA.addEventListener('click', function () {
      termWindow.style.transition = 'opacity 100ms ease';
      termWindow.style.opacity = '0';
      setTimeout(function () {
        termWindow.style.opacity = '1';
      }, 200);
    });
  }

  // ----------------------------------------------------------
  // 4. Subtle parallax glow on the window on mousemove
  // ----------------------------------------------------------
  if (!reduceMotion) {
    var tw = document.querySelector('.term-window');
    if (tw) {
      document.addEventListener('mousemove', function (e) {
        var rect = tw.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top  + rect.height / 2;
        var dx = (e.clientX - cx) / rect.width;
        var dy = (e.clientY - cy) / rect.height;
        tw.style.boxShadow =
          '0 0 0 1px rgba(255,255,255,0.04) inset,' +
          '0 8px 64px rgba(0,0,0,0.6),' +
          '0 0 80px -20px rgba(232,180,200,' + (0.18 + Math.abs(dx) * 0.12) + '),' +
          (dx * 6) + 'px ' + (dy * 6) + 'px 40px -10px rgba(155,201,178,0.08)';
      });
    }
  }

  // ----------------------------------------------------------
  // 5. Chip hover ripple — tiny visual feedback
  // ----------------------------------------------------------
  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('mouseenter', function () {
      chip.style.transition = 'color 120ms ease, border-color 120ms ease, background 120ms ease, transform 120ms ease';
      chip.style.transform = 'translateY(-1px)';
    });
    chip.addEventListener('mouseleave', function () {
      chip.style.transform = '';
    });
  });
});
