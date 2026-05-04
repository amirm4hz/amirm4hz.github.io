/* ═══════════════════════════════════════════════
   animations.js
   GSAP animations for Amir Mahdian's portfolio
   Stage 2: Hero entrance + typewriter
═══════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

// Tell ScrollTrigger to watch our custom scroll container
ScrollTrigger.defaults({
  scroller: "#scrollContainer"
});


/* ─────────────────────────────────────────────
   HERO ENTRANCE ANIMATION
   Plays once on page load — staggered reveal
───────────────────────────────────────────── */
function initHeroAnimation() {

  // We use a timeline so each element animates in sequence
  // Each .from() describes where the element STARTS (GSAP moves it to its CSS position)
  const tl = gsap.timeline({
    defaults: {
      ease: "power4.out",
      duration: 1
    }
  });

  tl
    // 1. Orb blooms in behind everything first
    .from(".hero__orb", {
      scale: 0.4,
      opacity: 0,
      duration: 1.8,
      ease: "power2.out"
    })

    // 2. "Hey, I'm" greeting slides up
    .to(".hero__greeting", {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out"
    }, "-=1.4")   // starts 1.4s before the previous animation ends (overlap)

    // 3. "Amir Mahdian" — the big name — sweeps up dramatically
    .to(".hero__name", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power4.out"
    }, "-=0.4")

    // 4. "I build ___" title line
    .to(".hero__title-wrap", {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out"
    }, "-=0.5")

    // 5. Bio paragraph
    .to(".hero__bio", {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out"
    }, "-=0.4")

    // 6. CTA buttons
    .to(".hero__cta", {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out"
    }, "-=0.4")

    // 7. Scroll hint fades in last
    .from(".scroll-hint", {
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.2")

    // 8. Start typewriter after the title line appears
    .add(() => initTypewriter(), "-=1.5");

  return tl;
}


/* ─────────────────────────────────────────────
   TYPEWRITER EFFECT
   Cycles through Amir's domains
   Types forward → pauses → deletes → next word
───────────────────────────────────────────── */
function initTypewriter() {

  const el = document.getElementById("typewriter");

  // These are the strings that cycle in the hero
  const phrases = [
    "intelligent systems",
    "secure software",
    "web experiences",
    "ML pipelines",
    "robotics"
  ];

  let phraseIndex = 0;   // which phrase we're on
  let charIndex   = 0;   // how far into the phrase we've typed
  let isDeleting  = false;

  // Speeds (in milliseconds)
  const TYPE_SPEED   = 80;   // ms per character while typing
  const DELETE_SPEED = 40;   // ms per character while deleting (faster = snappier)
  const PAUSE_END    = 1800; // ms to pause at the end of a fully typed word
  const PAUSE_START  = 300;  // ms to pause before typing the next word

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      // Remove one character
      charIndex--;
      el.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === 0) {
        // Finished deleting — move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, DELETE_SPEED);

    } else {
      // Add one character
      charIndex++;
      el.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === currentPhrase.length) {
        // Finished typing — pause then start deleting
        isDeleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    }
  }

  // Kick it off
  tick();
}


/* ─────────────────────────────────────────────
   SCROLL ANIMATIONS
   (These will be expanded in Stage 3 —
   scaffolding is here so nothing breaks)
───────────────────────────────────────────── */
function initScrollAnimations() {
  // Stage 3 content goes here
  console.log("✅ Scroll animations ready for Stage 3");
}


/* ─────────────────────────────────────────────
   INIT — run everything
───────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initHeroAnimation();
  initScrollAnimations();
});