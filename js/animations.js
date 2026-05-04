/* ═══════════════════════════════════════════════
   animations.js
   GSAP animations for Amir Mahdian's portfolio
   Stage 3: Hero entrance + typewriter +
            scroll-triggered section animations
═══════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.defaults({
  scroller: "#scrollContainer"
});


/* ─────────────────────────────────────────────
   HERO ENTRANCE ANIMATION
───────────────────────────────────────────── */
function initHeroAnimation() {

  const tl = gsap.timeline({
    defaults: { ease: "power4.out", duration: 1 }
  });

  tl
    .from(".hero__orb", {
      scale: 0.4,
      opacity: 0,
      duration: 1.8,
      ease: "power2.out"
    })
    .to(".hero__greeting", {
      opacity: 1, y: 0, duration: 0.7, ease: "power3.out"
    }, "-=1.4")
    .to(".hero__name", {
      opacity: 1, y: 0, duration: 1, ease: "power4.out"
    }, "-=0.4")
    .to(".hero__title-wrap", {
      opacity: 1, y: 0, duration: 0.7, ease: "power3.out"
    }, "-=0.5")
    .to(".hero__bio", {
      opacity: 1, y: 0, duration: 0.7, ease: "power3.out"
    }, "-=0.4")
    .to(".hero__cta", {
      opacity: 1, y: 0, duration: 0.7, ease: "power3.out"
    }, "-=0.4")
    .from(".scroll-hint", {
      opacity: 0, duration: 1, ease: "power2.out"
    }, "-=0.2")
    .add(() => initTypewriter(), "-=1.5");

  return tl;
}


/* ─────────────────────────────────────────────
   TYPEWRITER
───────────────────────────────────────────── */
function initTypewriter() {

  const el = document.getElementById("typewriter");

  const phrases = [
    "intelligent systems",
    "secure software",
    "web experiences",
    "ML pipelines",
    "robotics"
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  const TYPE_SPEED   = 80;
  const DELETE_SPEED = 40;
  const PAUSE_END    = 1800;
  const PAUSE_START  = 300;

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      el.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, DELETE_SPEED);

    } else {
      charIndex++;
      el.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    }
  }

  tick();
}


/* ─────────────────────────────────────────────
   ABOUT SECTION
   Avatar slides in from left, text from right
───────────────────────────────────────────── */
function initAboutAnimation() {

  // Only runs when #about enters the viewport
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#about",
      start: "top 70%",
      once: true           // fires once — doesn't reverse on scroll back up
    }
  });

  tl
    // Section title drops in first
    .from("#about .section__title", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out"
    })
    // Avatar slides in from the left
    .from(".about__avatar-wrap", {
      opacity: 0,
      x: -60,
      duration: 0.9,
      ease: "power3.out"
    }, "-=0.4")
    // Text block slides in from the right simultaneously
    .from(".about__text", {
      opacity: 0,
      x: 60,
      duration: 0.9,
      ease: "power3.out"
    }, "<")   // "<" means "start at the same time as the previous animation"

    // Fun facts stagger in one by one
    .from(".about__facts li", {
      opacity: 0,
      x: 30,
      duration: 0.5,
      stagger: 0.12,      // 0.12s delay between each item
      ease: "power2.out"
    }, "-=0.4");
}


/* ─────────────────────────────────────────────
   PROJECTS SECTION
   Cards stagger in with a lift effect
───────────────────────────────────────────── */
function initProjectsAnimation() {

  gsap.from("#projects .section__title", {
    scrollTrigger: {
      trigger: "#projects",
      start: "top 70%",
      once: true
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: "power3.out"
  });

  // Each card gets its own ScrollTrigger — immune to snap timing issues
  document.querySelectorAll(".project-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        once: true
      },
      opacity: 0,
      y: 60,
      duration: 0.8,
      delay: i * 0.15,   // manual stagger via index
      ease: "power3.out"
    });
  });
}


/* ─────────────────────────────────────────────
   SKILLS SECTION
   Skill groups reveal, then badges stagger in
───────────────────────────────────────────── */
function initSkillsAnimation() {

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#skills",
      start: "top 70%",
      once: true
    }
  });

  tl
    .from("#skills .section__title", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out"
    })
    // Group labels slide in
    .from(".skill-group__label", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.4")
    // All badges stagger in — creates a wave effect across the grid
    .from(".badge", {
      opacity: 0,
      y: 20,
      scale: 0.85,
      duration: 0.5,
      stagger: 0.05,       // tight stagger = rapid-fire wave
      ease: "back.out(1.4)" // "back" easing gives a subtle overshoot pop
    }, "-=0.3");
}


/* ─────────────────────────────────────────────
   CONTACT SECTION
   Form and socials rise up, particles spawn
───────────────────────────────────────────── */
function initContactAnimation() {

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#contact",
      start: "top 70%",
      once: true
    }
  });

  tl
    .from("#contact .section__title", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out"
    })
    .from(".contact__sub", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")
    // Form slides up from below
    .from(".contact__form", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.3")
    // Social links stagger in from the right
    .from(".social-link", {
      opacity: 0,
      x: 40,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.6")
    // Form fields highlight in one by one
    .from(".form-group", {
      opacity: 0,
      y: 15,
      duration: 0.4,
      stagger: 0.08,
      ease: "power2.out"
    }, "-=0.8")
    // Kick off particles after section is revealed
    .add(() => initParticles(), "-=0.5");
}


/* ─────────────────────────────────────────────
   CSS PARTICLES
   Pure JS — no library needed.
   Creates floating dots in the contact background.
───────────────────────────────────────────── */
function initParticles() {

  const container = document.getElementById("particles");
  if (!container) return;

  const COUNT = 28;  // number of particles

  for (let i = 0; i < COUNT; i++) {
    const dot = document.createElement("div");
    dot.classList.add("particle");

    // Random position, size, and opacity
    const size    = Math.random() * 4 + 1.5;    // 1.5px – 5.5px
    const x       = Math.random() * 100;         // % across container
    const y       = Math.random() * 100;         // % down container
    const delay   = Math.random() * 6;           // stagger start times
    const dur     = Math.random() * 8 + 6;       // 6s – 14s float cycle

    dot.style.cssText = `
      position: absolute;
      left: ${x}%;
      top:  ${y}%;
      width:  ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: var(--accent);
      opacity: ${Math.random() * 0.35 + 0.05};
      animation: particle-float ${dur}s ${delay}s ease-in-out infinite alternate;
      pointer-events: none;
    `;

    container.appendChild(dot);
  }
}


/* ─────────────────────────────────────────────
   INIT — wire everything up on DOM ready
───────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initHeroAnimation();
  initAboutAnimation();
  initProjectsAnimation();
  initSkillsAnimation();
  initContactAnimation();
});