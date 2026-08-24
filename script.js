// ---- Loading screen ----
document.body.classList.add('loading');

const loader = document.getElementById('loader');
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const HOLD = REDUCED ? 400 : 3600;

function dismissLoader() {
  if (!loader || loader.classList.contains('done')) return;
  loader.classList.add('done');
  document.body.classList.remove('loading');
  setTimeout(() => loader.remove(), 700);
}

window.addEventListener('load', () => setTimeout(dismissLoader, HOLD));
// Safety net in case 'load' never fires (slow fonts, blocked assets)
setTimeout(dismissLoader, HOLD + 2500);
// Let impatient people skip it
loader && loader.addEventListener('click', dismissLoader);

// ---- Nav: subtle solidify on scroll ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (!nav) return;
  const scrolled = window.scrollY > 40;
  nav.style.background = scrolled ? 'rgba(6,21,48,.55)' : 'rgba(255,255,255,.07)';
}, { passive: true });

// ---- Reveal sections on scroll ----
// (.note is excluded — it carries its own rotation, which a transform reset would flatten)
const revealTargets = document.querySelectorAll('.box, .card, .exp, .stat, .contact-item, .skill-group');

revealTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity .55s ease, transform .55s ease';
});

if (REDUCED) {
  revealTargets.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
        }, i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => io.observe(el));
}
