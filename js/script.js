// One deliberate motion moment: type out the hero line on the homepage.
// Respects prefers-reduced-motion, and fails safely (shows full text) if anything goes wrong.
document.addEventListener('DOMContentLoaded', function () {
  var el = document.querySelector('[data-typewriter]');
  if (!el) return;

  var fullText = el.textContent;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) return; // leave the static text as-is

  try {
    el.textContent = '';
    var i = 0;
    var speed = 28;
    function tick() {
      el.textContent = fullText.slice(0, i);
      i++;
      if (i <= fullText.length) {
        setTimeout(tick, speed);
      }
    }
    tick();
  } catch (e) {
    el.textContent = fullText;
  }
});
