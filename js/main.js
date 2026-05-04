/* ═══════════════════════════════════════════════
   main.js
   Handles: custom cursor, nav scroll state,
            hamburger menu, mobile nav
═══════════════════════════════════════════════ */

// ─── Custom Cursor ───────────────────────────
const cursorDot     = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');

// We track the outline with a slight lag for a "trailing" feel
let outlineX = 0, outlineY = 0;
let dotX = 0, dotY = 0;
let rafId;

document.addEventListener('mousemove', (e) => {
  dotX = e.clientX;
  dotY = e.clientY;

  // Dot follows instantly
  cursorDot.style.left = dotX + 'px';
  cursorDot.style.top  = dotY + 'px';
});

// Outline trails behind using requestAnimationFrame
function animateOutline() {
  // Lerp (linear interpolation): smoothly move toward target
  // Think of it as: move 14% of the remaining distance each frame
  outlineX += (dotX - outlineX) * 0.14;
  outlineY += (dotY - outlineY) * 0.14;

  cursorOutline.style.left = outlineX + 'px';
  cursorOutline.style.top  = outlineY + 'px';

  rafId = requestAnimationFrame(animateOutline);
}
animateOutline();

// Expand cursor on interactive elements
const interactives = document.querySelectorAll('a, button, .project-card, .badge, input, textarea');

interactives.forEach(el => {
  el.addEventListener('mouseenter', () => cursorOutline.classList.add('is-hovering'));
  el.addEventListener('mouseleave', () => cursorOutline.classList.remove('is-hovering'));
});

// Hide cursor when it leaves the window
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity     = '0';
  cursorOutline.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity     = '1';
  cursorOutline.style.opacity = '1';
});


// ─── Nav: add background on scroll ──────────
const nav             = document.getElementById('nav');
const scrollContainer = document.getElementById('scrollContainer');

scrollContainer.addEventListener('scroll', () => {
  if (scrollContainer.scrollTop > 50) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }
});


// ─── Hamburger menu (mobile) ─────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav__links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('nav__links--open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Mobile nav: close when a link is clicked
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('nav__links--open');
    hamburger.setAttribute('aria-expanded', false);
  });
});