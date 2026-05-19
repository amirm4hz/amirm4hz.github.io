/* ═══════════════════════════════════════════════
   animations.js — Amir Mahdian Portfolio
═══════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

const animationCleanupTasks = [];
function cleanupAnimations() {
  animationCleanupTasks.forEach(fn => fn());
  animationCleanupTasks.length = 0;
}
window.addEventListener('beforeunload', cleanupAnimations);
window.addEventListener('pagehide', cleanupAnimations);

ScrollTrigger.defaults({ scroller: "#scrollContainer" });


/* ─────────────────────────────────────────────
   HERO ENTRANCE
───────────────────────────────────────────── */
function initHeroAnimation() {
  const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1 } });

  tl
    .from(".hero__orb", { scale: 0.4, opacity: 0, duration: 1.8, ease: "power2.out" })
    .to(".hero__greeting",   { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=1.4")
    .to(".hero__name",       { opacity: 1, y: 0, duration: 1,   ease: "power4.out" }, "-=0.4")
    .to(".hero__title-wrap", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
    .to(".hero__bio",        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.4")
    .to(".hero__cta",        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.4")
    .to(".hero__status",     { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.3")
    .from(".scroll-hint",    { opacity: 0, duration: 1, ease: "power2.out" }, "-=0.2")
    .add(() => initTypewriter(), "-=1.5");

  return tl;
}


/* ─────────────────────────────────────────────
   HERO TYPEWRITER
───────────────────────────────────────────── */
let typewriterTimer = null;
function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const phrases = [
    "intelligent systems",
    "secure software",
    "web experiences",
    "ML pipelines",
    "robotics"
  ];

  let phraseIndex = 0, charIndex = 0, isDeleting = false;

  function tick() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typewriterTimer = setTimeout(tick, 300);
        return;
      }
      typewriterTimer = setTimeout(tick, 40);
    } else {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        typewriterTimer = setTimeout(tick, 1800);
        return;
      }
      typewriterTimer = setTimeout(tick, 80);
    }
  }
  tick();

  animationCleanupTasks.push(() => {
    if (typewriterTimer) clearTimeout(typewriterTimer);
  });
}

/* ─────────────────────────────────────────────
   STARFIELD
   Generates stars for hero, projects, skills, contact
───────────────────────────────────────────── */
function initStarfield() {
  const targets = ['#hero', '#projects', '#skills', '#contact'];

  targets.forEach(selector => {
    const section  = document.querySelector(selector);
    if (!section) return;
    const starfield = section.querySelector('.starfield');
    if (!starfield) return;

    const count = window.innerWidth < 600 ? 90 : 180;

    for (let i = 0; i < count; i++) {
      const star   = document.createElement('div');
      star.classList.add('star');

      const size    = Math.random() * 2.2 + 0.5;
      const x       = Math.random() * 100;
      const y       = Math.random() * 100;
      const opacity = Math.random() * 0.65 + 0.1;
      const dur     = Math.random() * 3 + 2;
      const delay   = Math.random() * 5;

      star.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        --star-opacity: ${opacity};
        animation: star-twinkle ${dur}s ${delay}s ease-in-out infinite alternate;
      `;

      starfield.appendChild(star);
    }
  });

  // Start shooting stars after a short delay
  const startTimeout = setTimeout(spawnShootingStar, 2500);
  animationCleanupTasks.push(() => {
    clearTimeout(startTimeout);
    shootingStarTimers.forEach(clearTimeout);
    shootingStarTimers.length = 0;
    shootingStarCount = 0;
    document.querySelectorAll('.shooting-star').forEach(star => star.remove());
  });
}

/* ─────────────────────────────────────────────
   MOUSE PARALLAX ON HERO STARS
   Stars shift slightly as the cursor moves —
   gives the hero a real 3D depth illusion
───────────────────────────────────────────── */
function initStarParallax() {
  const heroStarfield = document.querySelector('#hero .starfield');
  if (!heroStarfield) return;

  // Grab all stars and assign each a random depth layer (0.1 – 0.5)
  // Deeper layers move less, front layers move more — creates parallax
  const stars = heroStarfield.querySelectorAll('.star');
  stars.forEach(star => {
    star.dataset.depth = (Math.random() * 0.4 + 0.1).toFixed(2);
  });

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  const handleMouseMove = (e) => {
    // Convert mouse position to -1 → +1 range centred on the screen
    targetX = (e.clientX / window.innerWidth  - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  document.addEventListener('mousemove', handleMouseMove);

  let parallaxRafId = null;
  // Smooth lerp loop — runs every frame
  function parallaxLoop() {
    // Lerp toward target — 0.06 = smooth lag
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;

    const strength = 28; // max pixel shift at full mouse deflection

    stars.forEach(star => {
      const depth = parseFloat(star.dataset.depth);
      const moveX = currentX * strength * depth;
      const moveY = currentY * strength * depth;
      star.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    parallaxRafId = requestAnimationFrame(parallaxLoop);
  }

  animationCleanupTasks.push(() => {
    if (parallaxRafId !== null) cancelAnimationFrame(parallaxRafId);
    document.removeEventListener('mousemove', handleMouseMove);
  });

  parallaxLoop();
}


/* ─────────────────────────────────────────────
   SHOOTING STARS
   Capped at 30 active stars to prevent memory leaks
───────────────────────────────────────────── */
let shootingStarCount = 0;
const MAX_SHOOTING_STARS = 30;

const shootingStarTimers = [];

function spawnShootingStar() {
  // Stop spawning if we hit the cap
  if (shootingStarCount >= MAX_SHOOTING_STARS) {
    return;
  }

  const starfields = document.querySelectorAll('#hero .starfield, #projects .starfield, #skills .starfield, #contact .starfield');
  if (!starfields.length) return;

  const starfield = starfields[Math.floor(Math.random() * starfields.length)];

  const star = document.createElement('div');
  star.classList.add('shooting-star');

  // Start the stars higher up and further left so they have room to travel diagonally
  star.style.left = (Math.random() * 100 - 20) + '%';
  star.style.top  = (Math.random() * 50 - 20) + '%';

  starfield.appendChild(star);
  shootingStarCount++;

  // Remove after animation completes and decrement counter
  const removalTimeout = setTimeout(() => {
    star.remove();
    shootingStarCount--;
    // Spawn a new one after removal to maintain count
    if (shootingStarCount < MAX_SHOOTING_STARS) {
      const nextIn = Math.random() * 600 + 200;
      const scheduleTimeout = setTimeout(spawnShootingStar, nextIn);
      shootingStarTimers.push(scheduleTimeout);
    }
  }, 6000);
  shootingStarTimers.push(removalTimeout);
}

animationCleanupTasks.push(() => {
  shootingStarTimers.forEach(clearTimeout);
  shootingStarTimers.length = 0;
});


/* ─────────────────────────────────────────────
   SCROLL ANIMATIONS
───────────────────────────────────────────── */
function initAboutAnimation() {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: "#about", start: "top 70%", once: true }
  });
  tl
    .from("#about .section__title",  { opacity: 0, y: 40, duration: 0.8, ease: "power3.out" })
    .from(".about__avatar-wrap",     { opacity: 0, x: -60, duration: 0.9, ease: "power3.out" }, "-=0.4")
    .from(".about__text",            { opacity: 0, x: 60,  duration: 0.9, ease: "power3.out" }, "<");
}

function initProjectsAnimation() {
  gsap.from("#projects .section__title", {
    scrollTrigger: { trigger: "#projects", start: "top 70%", once: true },
    opacity: 0, y: 40, duration: 0.8, ease: "power3.out"
  });

  document.querySelectorAll(".project-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 90%", once: true },
      opacity: 0, y: 60, duration: 0.8, delay: i * 0.15, ease: "power3.out"
    });
  });
}

function initSkillsAnimation() {
  gsap.from(".skills__header", {
    scrollTrigger: { trigger: "#skills", start: "top 70%", once: true },
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: "power3.out"
  });
}

function initContactAnimation() {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: "#contact", start: "top 70%", once: true }
  });
  tl
    .from("#contact .section__title", { opacity: 0, y: 40, duration: 0.8, ease: "power3.out" })
    .from(".contact__sub",            { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, "-=0.4")
    .from(".contact__form",           { opacity: 0, y: 50, duration: 0.8, ease: "power3.out" }, "-=0.3")
    .from(".social-link",             { opacity: 0, x: 40, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.6")
    .from(".form-group",              { opacity: 0, y: 15, duration: 0.4, stagger: 0.08, ease: "power2.out" }, "-=0.8")
    .add(() => initParticles(), "-=0.5");
}


/* ─────────────────────────────────────────────
   CONTACT PARTICLES
───────────────────────────────────────────── */
function initParticles() {
  const container = document.getElementById("particles");
  if (!container) return;

  for (let i = 0; i < 28; i++) {
    const dot  = document.createElement("div");
    dot.classList.add("particle");
    const size  = Math.random() * 4 + 1.5;
    const x     = Math.random() * 100;
    const y     = Math.random() * 100;
    const delay = Math.random() * 6;
    const dur   = Math.random() * 8 + 6;

    dot.style.cssText = `
      position: absolute;
      left: ${x}%; top: ${y}%;
      width: ${size}px; height: ${size}px;
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
───────────────────────────────────────────── */
window.addEventListener("load", () => {
  // Hero fires after loader fades (900ms)
  setTimeout(() => {
    initHeroAnimation();
  }, 950);

  // Everything else
  initStarfield();
  initStarParallax();
  initAboutAnimation();
  initProjectsAnimation();
  initSkillsAnimation();
  initContactAnimation();
});