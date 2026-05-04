/* ═══════════════════════════════════════════════
   animations.js — Amir Mahdian Portfolio
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
   ABOUT
───────────────────────────────────────────── */
function initAboutAnimation() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#about",
      start: "top 70%",
      once: true
    }
  });

  tl
    .from("#about .section__title", {
      opacity: 0, y: 40, duration: 0.8, ease: "power3.out"
    })
    .from(".about__avatar-wrap", {
      opacity: 0, x: -60, duration: 0.9, ease: "power3.out"
    }, "-=0.4")
    .from(".about__text", {
      opacity: 0, x: 60, duration: 0.9, ease: "power3.out"
    }, "<")
    .from(".about__facts li", {
      opacity: 0, x: 30, duration: 0.5, stagger: 0.12, ease: "power2.out"
    }, "-=0.4");
}


/* ─────────────────────────────────────────────
   PROJECTS
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
      delay: i * 0.15,
      ease: "power3.out"
    });
  });
}


/* ─────────────────────────────────────────────
   SKILLS
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
      opacity: 0, y: 40, duration: 0.8, ease: "power3.out"
    })
    .from(".skill-group__label", {
      opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: "power2.out"
    }, "-=0.4")
    .from(".badge", {
      opacity: 0, y: 20, scale: 0.85, duration: 0.5,
      stagger: 0.05, ease: "back.out(1.4)"
    }, "-=0.3");
}


/* ─────────────────────────────────────────────
   CONTACT
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
      opacity: 0, y: 40, duration: 0.8, ease: "power3.out"
    })
    .from(".contact__sub", {
      opacity: 0, y: 20, duration: 0.6, ease: "power2.out"
    }, "-=0.4")
    .from(".contact__form", {
      opacity: 0, y: 50, duration: 0.8, ease: "power3.out"
    }, "-=0.3")
    .from(".social-link", {
      opacity: 0, x: 40, duration: 0.6, stagger: 0.1, ease: "power2.out"
    }, "-=0.6")
    .from(".form-group", {
      opacity: 0, y: 15, duration: 0.4, stagger: 0.08, ease: "power2.out"
    }, "-=0.8")
    .add(() => initParticles(), "-=0.5");
}


/* ─────────────────────────────────────────────
   PARTICLES
───────────────────────────────────────────── */
function initParticles() {
  const container = document.getElementById("particles");
  if (!container) return;

  const COUNT = 28;

  for (let i = 0; i < COUNT; i++) {
    const dot = document.createElement("div");
    dot.classList.add("particle");

    const size  = Math.random() * 4 + 1.5;
    const x     = Math.random() * 100;
    const y     = Math.random() * 100;
    const delay = Math.random() * 6;
    const dur   = Math.random() * 8 + 6;

    dot.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
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
   INIT
   *** KEY FIX: wait for window.load + 950ms
   so hero fires AFTER the loader has hidden ***
───────────────────────────────────────────── */
window.addEventListener("load", () => {
  setTimeout(() => {
    initHeroAnimation();
  }, 950); // matches the 900ms loader delay + small buffer

  // Scroll animations don't need to wait — sections aren't visible yet anyway
  initAboutAnimation();
  initProjectsAnimation();
  initSkillsAnimation();
  initContactAnimation();
});