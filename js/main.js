/* ═══════════════════════════════════════════════
   main.js
   Handles: custom cursor, nav scroll state,
            hamburger menu
═══════════════════════════════════════════════ */


/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
const cursorDot     = document.getElementById("cursorDot");
const cursorOutline = document.getElementById("cursorOutline");

let dotX = 0, dotY = 0;
let outlineX = 0, outlineY = 0;

// Dot snaps to mouse instantly
document.addEventListener("mousemove", (e) => {
  dotX = e.clientX;
  dotY = e.clientY;
  cursorDot.style.left = dotX + "px";
  cursorDot.style.top  = dotY + "px";
});

// Outline trails with lerp (smooth lag effect)
// Lerp = linear interpolation: moves a % of the remaining distance each frame
// 0.14 = 14% — lower = more lag, higher = snappier
function animateOutline() {
  outlineX += (dotX - outlineX) * 0.14;
  outlineY += (dotY - outlineY) * 0.14;
  cursorOutline.style.left = outlineX + "px";
  cursorOutline.style.top  = outlineY + "px";
  requestAnimationFrame(animateOutline);
}
animateOutline();

// Expand cursor ring when hovering interactive elements
const interactives = document.querySelectorAll(
  "a, button, .project-card, .badge, input, textarea"
);
interactives.forEach(el => {
  el.addEventListener("mouseenter", () => cursorOutline.classList.add("is-hovering"));
  el.addEventListener("mouseleave", () => cursorOutline.classList.remove("is-hovering"));
});

// Hide cursor when mouse leaves browser window
document.addEventListener("mouseleave", () => {
  cursorDot.style.opacity     = "0";
  cursorOutline.style.opacity = "0";
});
document.addEventListener("mouseenter", () => {
  cursorDot.style.opacity     = "1";
  cursorOutline.style.opacity = "1";
});


/* ─────────────────────────────────────────────
   NAV — frosted glass on scroll
───────────────────────────────────────────── */
const nav             = document.getElementById("nav");
const scrollContainer = document.getElementById("scrollContainer");

scrollContainer.addEventListener("scroll", () => {
  nav.classList.toggle("nav--scrolled", scrollContainer.scrollTop > 50);
});


/* ─────────────────────────────────────────────
   HAMBURGER MENU (mobile)
───────────────────────────────────────────── */
const hamburger = document.getElementById("hamburger");
const navLinks  = document.querySelector(".nav__links");

hamburger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("nav__links--open");
  hamburger.setAttribute("aria-expanded", isOpen);
});

// Close mobile nav when any link is clicked
document.querySelectorAll(".nav__link").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("nav__links--open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});