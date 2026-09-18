// ============================================================
//  Emily Etea — portfolio scripts
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----------------------------------------------------------
  // 1. Typewriter effect on the homepage hero line
  // ----------------------------------------------------------
  var el = document.querySelector('[data-typewriter]');
  if (el) {
    if (reduceMotion) {
      // leave static text; just ensure cursor sibling is preserved
    } else {
      try {
        // The hero h1 contains a .cursor span — preserve it
        var cursor = el.querySelector('.cursor');
        var fullText = el.textContent; // includes cursor char, strip it
        if (cursor) el.removeChild(cursor);
        fullText = el.textContent;
        el.textContent = '';
        if (cursor) el.appendChild(cursor);

        var i = 0;
        var speed = 28;
        function tick() {
          // insert text before the cursor span
          if (cursor) {
            cursor.insertAdjacentText('beforebegin', fullText.slice(i - 1, i));
          } else {
            el.textContent = fullText.slice(0, i);
          }
          i++;
          if (i <= fullText.length) setTimeout(tick, speed);
        }
        tick();
      } catch (e) {
        el.textContent = fullText;
      }
    }
  }

  // ----------------------------------------------------------
  // 2. Fade-in cmd-block sections on scroll
  // ----------------------------------------------------------
  var blocks = document.querySelectorAll('.cmd-block');

  if (reduceMotion) {
    // Skip animation — make everything visible immediately
    blocks.forEach(function (b) { b.classList.add('is-visible'); });
  } else if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    blocks.forEach(function (b, i) {
      // Stagger the transition-delay so sections cascade in
      b.style.transitionDelay = (i * 60) + 'ms';
      observer.observe(b);
    });
  } else {
    // Fallback for old browsers
    blocks.forEach(function (b) { b.classList.add('is-visible'); });
  }

  // ----------------------------------------------------------
  // 3. Terminal dot easter egg — clicking the red dot "closes"
  //    and re-opens the window with a short blink
  // ----------------------------------------------------------
  var dotA = document.querySelector('.term-dots .a');
  var termWindow = document.querySelector('.term-window');
  if (dotA && termWindow) {
    dotA.style.cursor = 'pointer';
    dotA.setAttribute('role', 'button');
    dotA.setAttribute('aria-label', 'Toggle terminal');
    dotA.addEventListener('click', function () {
      termWindow.style.transition = 'opacity 120ms ease';
      termWindow.style.opacity   = '0';
      setTimeout(function () {
        termWindow.style.opacity = '1';
      }, 220);
    });
  }
});
