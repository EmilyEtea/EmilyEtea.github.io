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
      if (!name || !message) {
        // basic client-side guard — browser will show native validation
        form.reportValidity();
        return;
      }
      var body = 'Hi Emily,\n\nMy name is ' + name + '.\n\n' + message;
      var mailto = 'mailto:emilyetea@hotmail.com'
        + '?subject=' + encodeURIComponent(subject || 'Portfolio Inquiry')
        + '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
    });
  }

  // ── 7b. Copy email button ────────────────────────────────
  var copyBtn = document.querySelector('#copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email') || 'emilyetea@hotmail.com';
      var label   = copyBtn.querySelector('.copy-label');
      var feedback = document.querySelector('#copy-feedback');

      function showSuccess() {
        copyBtn.classList.add('is-copied');
        if (label) label.textContent = 'Copied!';
        if (feedback) {
          feedback.textContent = 'Email address copied to clipboard.';
          feedback.hidden = false;
        }
        setTimeout(function () {
          copyBtn.classList.remove('is-copied');
          if (label) label.textContent = 'Copy email';
          if (feedback) {
            feedback.textContent = '';
            feedback.hidden = true;
          }
        }, 2500);
      }

      function showError() {
        if (label) label.textContent = 'Copy failed';
        if (feedback) {
          feedback.textContent = 'Could not copy automatically. The address is: ' + email;
          feedback.hidden = false;
          feedback.style.color = 'var(--cp-yellow)';
        }
        setTimeout(function () {
          if (label) label.textContent = 'Copy email';
          if (feedback) {
            feedback.textContent = '';
            feedback.hidden = true;
            feedback.style.color = '';
          }
        }, 4000);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showSuccess, showError);
      } else {
        // Fallback: execCommand
        try {
          var ta = document.createElement('textarea');
          ta.value = email;
          ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
          document.body.appendChild(ta);
          ta.select();
          var ok = document.execCommand('copy');
          document.body.removeChild(ta);
          if (ok) { showSuccess(); } else { showError(); }
        } catch (err) {
          showError();
        }
      }
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

  // ── 10. Flip card — hover / double-click / auto-unflip ──────────────
  var flipCard = document.getElementById('profileFlipCard');
  if (flipCard) {
    var flipInner  = flipCard.querySelector('.flip-card-inner');
    var flipGlitch = flipCard.querySelector('.flip-glitch');
    var lockTimer  = null;

    function triggerGlitch() {
      if (!flipGlitch) return;
      flipGlitch.classList.remove('glitch-fire');
      // force reflow so animation re-triggers
      void flipGlitch.offsetWidth;
      flipGlitch.classList.add('glitch-fire');
      flipGlitch.addEventListener('animationend', function () {
        flipGlitch.classList.remove('glitch-fire');
      }, { once: true });
    }

    function triggerScanline() {
      if (!flipInner) return;
      flipInner.classList.add('is-flipping');
      flipInner.addEventListener('animationend', function () {
        flipInner.classList.remove('is-flipping');
      }, { once: true });
    }

    // hover: flip + effects
    flipCard.addEventListener('mouseenter', function () {
      if (flipCard.classList.contains('is-locked')) return;
      triggerGlitch();
      triggerScanline();
    });

    // double-click: lock flipped for 10 s
    flipCard.addEventListener('dblclick', function () {
      clearTimeout(lockTimer);
      flipCard.classList.add('is-locked');
      triggerGlitch();
      triggerScanline();
      lockTimer = setTimeout(function () {
        triggerGlitch();
        triggerScanline();
        flipCard.classList.remove('is-locked');
      }, 10000);
    });
  }
  if (!reduceMotion) {
    var heroSection = document.querySelector('.hero');
    if (heroSection) {
      window.addEventListener('scroll', function () {
        var scrollY = window.scrollY;
        heroSection.style.backgroundPositionY = (scrollY * 0.3) + 'px';
      }, { passive: true });
    }
  }

  // ── 11. Matrix rain canvas ───────────────────────────────
  var canvas = document.getElementById('matrix-canvas');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var hero = canvas.parentElement;

    // characters: katakana block + digits + common code symbols
    var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
                '0123456789ABCDEFabcdef{}[]();<>=!?#@$%^&*_+-/\\|~`';
    var charArr = chars.split('');

    var fontSize  = 13;
    var cols, drops;

    var BLEED = 80; // matches the CSS top:-80px
    function resize() {
      // Use clientWidth on documentElement as fallback — avoids the
      // half-width bug that happens when offsetWidth is read before
      // the browser has finished its first layout pass.
      var w = hero.getBoundingClientRect().width || document.documentElement.clientWidth;
      var h = hero.getBoundingClientRect().height || window.innerHeight;
      canvas.width  = Math.ceil(w);
      canvas.height = Math.ceil(h) + BLEED * 2;
      cols  = Math.floor(canvas.width / fontSize);
      drops = [];
      for (var c = 0; c < cols; c++) {
        drops[c] = Math.floor(Math.random() * -(canvas.height / fontSize));
      }
    }
    // Defer first resize to after layout + fonts settle
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        resize();
      });
    });
    window.addEventListener('resize', resize, { passive: true });

    function draw() {
      // translucent fill = trail fade
      ctx.fillStyle = 'rgba(6, 8, 15, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + 'px "JetBrains Mono", monospace';

      for (var i = 0; i < drops.length; i++) {
        var ch = charArr[Math.floor(Math.random() * charArr.length)];
        var y  = drops[i] * fontSize;

        // head character: bright cyan-white
        ctx.fillStyle = drops[i] > 0 ? '#b0fff8' : 'rgba(0,229,255,0)';
        ctx.fillText(ch, i * fontSize, y);

        // body: vary between pink glow heads and green/cyan trail
        var trailColor;
        var r = Math.random();
        if (r < 0.04) {
          trailColor = '#ff2d78'; // rare pink accent
        } else if (r < 0.15) {
          trailColor = '#00e5ff'; // cyan
        } else {
          trailColor = '#1aff8c'; // classic matrix green
        }
        ctx.fillStyle = trailColor;
        var bodyChar = charArr[Math.floor(Math.random() * charArr.length)];
        ctx.fillText(bodyChar, i * fontSize, y - fontSize);

        // reset column when it goes off-screen (random threshold for natural stagger)
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    var matrixRaf;
    var lastTime = 0;
    var fps = 20; // slower = more readable + less CPU
    var interval = 1000 / fps;

    function loop(ts) {
      matrixRaf = requestAnimationFrame(loop);
      if (ts - lastTime < interval) return;
      lastTime = ts;
      draw();
    }
    matrixRaf = requestAnimationFrame(loop);

    // pause when tab is hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(matrixRaf);
      } else {
        lastTime = 0;
        matrixRaf = requestAnimationFrame(loop);
      }
    });
  }

  // ── 12. Ticker — measure track width for seamless loop ───
  var track = document.querySelector('.ticker-track');
  if (track && !reduceMotion) {
    // The track contains two identical sets; we want to translate by exactly half
    // so the loop is invisible. CSS var --ticker-w drives the animation.
    function setTickerWidth() {
      var fullW = track.scrollWidth;
      var half  = -(fullW / 2);
      track.style.setProperty('--ticker-w', half + 'px');
      // also set on the wrap so the keyframe can read it
      track.style.animationDuration = Math.max(18, fullW / 60) + 's';
    }
    setTickerWidth();
    window.addEventListener('resize', setTickerWidth, { passive: true });
  }

  // ── 13. Light / dark mode toggle ────────────────────────
  (function () {
    var html   = document.documentElement;
    var btn    = document.getElementById('theme-toggle');
    var saved  = localStorage.getItem('theme');
    var theme  = saved ? saved : 'dark';

    function apply(t) {
      html.setAttribute('data-theme', t);
      localStorage.setItem('theme', t);
      if (btn) btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    apply(theme);

    if (btn) {
      btn.addEventListener('click', function () {
        apply(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      });
    }

    // Also listen for OS-level changes if user hasn't manually set a preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem('theme')) apply(e.matches ? 'dark' : 'light');
    });
  }());

});
