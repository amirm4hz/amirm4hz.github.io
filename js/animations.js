/* ═══════════════════════════════════════════════
   animations.js
   All GSAP animations live here.
   Stage 1: file created and wired up.
   Animations will be added in Stage 2+.
═══════════════════════════════════════════════ */

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// Tell ScrollTrigger to use our custom scroll container
// instead of the default window scroll
ScrollTrigger.defaults({
  scroller: "#scrollContainer"
});

console.log("✅ GSAP + ScrollTrigger ready");