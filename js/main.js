/* ═══════════════════════════════════════════════
   main.js — Amir Mahdian Portfolio
═══════════════════════════════════════════════ */


/* ─────────────────────────────────────────────
   PAGE LOADER
───────────────────────────────────────────── */
const loader = document.getElementById("loader");

const cleanupTasks = [];
function cleanupAll() {
  cleanupTasks.forEach(fn => fn());
  cleanupTasks.length = 0;
}

window.addEventListener("beforeunload", cleanupAll);
window.addEventListener("pagehide", cleanupAll);

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    loader.classList.add("is-hidden");
  }, 200);
});


/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
const cursorDot     = document.getElementById("cursorDot");
const cursorOutline = document.getElementById("cursorOutline");

let dotX = 0, dotY = 0;
let outlineX = 0, outlineY = 0;

document.addEventListener("mousemove", (e) => {
  dotX = e.clientX;
  dotY = e.clientY;
  cursorDot.style.left = dotX + "px";
  cursorDot.style.top  = dotY + "px";
});

let outlineRafId = null;
function animateOutline() {
  outlineX += (dotX - outlineX) * 0.14;
  outlineY += (dotY - outlineY) * 0.14;
  cursorOutline.style.left = outlineX + "px";
  cursorOutline.style.top  = outlineY + "px";
  outlineRafId = requestAnimationFrame(animateOutline);
}
animateOutline();
cleanupTasks.push(() => {
  if (outlineRafId !== null) cancelAnimationFrame(outlineRafId);
});

const interactives = document.querySelectorAll(
  "a, button, .project-card, .badge, input, textarea"
);
interactives.forEach(el => {
  el.addEventListener("mouseenter", () => cursorOutline.classList.add("is-hovering"));
  el.addEventListener("mouseleave", () => cursorOutline.classList.remove("is-hovering"));
});

document.addEventListener("mouseleave", () => {
  cursorDot.style.opacity     = "0";
  cursorOutline.style.opacity = "0";
});
document.addEventListener("mouseenter", () => {
  cursorDot.style.opacity     = "1";
  cursorOutline.style.opacity = "1";
});

/* ─────────────────────────────────────────────
   NAV — frosted glass on scroll + Intersection Observer
───────────────────────────────────────────── */
const nav             = document.getElementById("nav");
const scrollContainer = document.getElementById("scrollContainer");
const scrollProgress  = document.getElementById("scrollProgress");
const sections        = document.querySelectorAll(".section");
const navLinks        = document.querySelectorAll(".nav__link");

// Scroll progress bar + nav background
scrollContainer.addEventListener("scroll", () => {
  // Nav frosted glass
  nav.classList.toggle("nav--scrolled", scrollContainer.scrollTop > 50);

  // Scroll progress bar
  const scrolled = scrollContainer.scrollTop;
  const total    = scrollContainer.scrollHeight - scrollContainer.clientHeight;
  const pct      = total > 0 ? (scrolled / total) * 100 : 0;
  scrollProgress.style.width = pct + "%";
});

/* ─────────────────────────────────────────────
   ACTIVE NAV LINK — Intersection Observer
   Efficiently detects which section is in view
───────────────────────────────────────────── */
const observerOptions = {
  root: scrollContainer,
  threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove("is-active"));
      const activeLink = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add("is-active");
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));


/* ─────────────────────────────────────────────
   HAMBURGER MENU
───────────────────────────────────────────── */
const hamburger = document.getElementById("hamburger");
const mobileNav = document.querySelector(".nav__links");

hamburger.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("nav__links--open");
  hamburger.classList.toggle("is-open", isOpen);
  hamburger.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll(".nav__link").forEach(link => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("nav__links--open");
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});


/* ─────────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────────── */
const contactForm = document.getElementById("contactForm");
const submitBtn   = document.getElementById("submitBtn");
const formSuccess = document.getElementById("formSuccess");
const formError   = document.getElementById("formError");

function setFormMessage(message, isError = false) {
  if (formError) {
    formError.textContent = message;
    formError.style.display = message ? "block" : "none";
    formError.classList.toggle("form__error--visible", Boolean(message));
  }
}

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name) {
      setFormMessage("Please enter your name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormMessage("Please enter a valid email address.");
      return;
    }

    if (message.length < 10) {
      setFormMessage("Please write a longer message (at least 10 characters).");
      return;
    }

    setFormMessage("");
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method:  "POST",
        body:    formData,
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        contactForm.reset();
        submitBtn.textContent = "Send Message";
        submitBtn.disabled    = false;
        formSuccess.classList.add("is-visible");
        setTimeout(() => {
          formSuccess.classList.remove("is-visible");
        }, 6000);
      } else {
        setFormMessage("Something went wrong. Please try again.");
        submitBtn.textContent = "Try again";
        submitBtn.disabled    = false;
      }
    } catch (error) {
      setFormMessage("Network error. Please check your connection and try again.");
      submitBtn.textContent = "Try again";
      submitBtn.disabled    = false;
      console.error(error);
    }
  });
}


/* ─────────────────────────────────────────────
   CLEAN TEXT SCRAMBLER (ABOUT ME) - EMOJI SAFE
───────────────────────────────────────────── */
const scrambleElement = document.getElementById('aboutFactText');

if (scrambleElement) {
  const words = [
    "[SYS.EDU] B.E. (Hons) Computer Engineering @ UoA",
    "[SYS.ACT] Executing: striker.exe // Albany United FC",
    "[SYS.JOB] Mathematics Tutor // NumberWorks'nWords",
    "[SYS.LOC] Origin: Auckland, New Zealand [::1]",
    "[SYS.PWR] Primary Fuel: Celsius & Coffee"
  ];
  
  let wordIndex = 0;
  let scrambleTicker = null;
  let scrambleCycle = null;

  function scrambleWord(newWord) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01"; 
    let iterations = 0;
    
    // Array.from() prevents emojis from being sliced in half and breaking
    const wordArray = Array.from(newWord); 
    
    if (scrambleTicker) {
      clearInterval(scrambleTicker);
    }

    scrambleTicker = setInterval(() => {
      scrambleElement.innerText = wordArray
        .map((letter, index) => {
          if (index < iterations) return wordArray[index]; 
          
          // Only scramble standard letters and numbers. Leave spaces, emojis, and punctuation alone!
          if (!/[a-zA-Z0-9]/.test(wordArray[index])) return wordArray[index];
          
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      
      if (iterations >= wordArray.length) {
        clearInterval(scrambleTicker);
        scrambleTicker = null;
      }
      
      iterations += 1; // Speed of the reveal
    }, 30); 
  }

  // Show first word immediately on load
  scrambleWord(words[0]);

  // Waits 8 FULL SECONDS before scrambling to the next fact
  scrambleCycle = setInterval(() => {
    wordIndex = (wordIndex + 1) % words.length;
    scrambleWord(words[wordIndex]);
  }, 5000);
  cleanupTasks.push(() => {
    if (scrambleCycle) clearInterval(scrambleCycle);
    if (scrambleTicker) clearInterval(scrambleTicker);
  });
}

/* ─────────────────────────────────────────────
   ABOUT ME BANNER / SLIDESHOW AUTOMATION
───────────────────────────────────────────── */
const slides = document.querySelectorAll('.about__slide');

if (slides.length > 1) {
  let currentSlide = 0;

  const slideshowInterval = setInterval(() => {
    // Remove active class from current image
    slides[currentSlide].classList.remove('is-active');
    
    // Move to the next image (loop back to start if at the end)
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Add active class to new image to trigger the fade and zoom
    slides[currentSlide].classList.add('is-active');
  }, 6000); // Changes the banner image every 6 seconds

  cleanupTasks.push(() => clearInterval(slideshowInterval));
}

/* ─────────────────────────────────────────────
   CARD CURSOR SPOTLIGHT
   A glow follows your cursor inside project cards
───────────────────────────────────────────── */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.project-card');
  const spotlightListeners = [];

  cards.forEach(card => {
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--spotlight-x', `${x}px`);
      card.style.setProperty('--spotlight-y', `${y}px`);
      card.style.setProperty('--spotlight-opacity', '1');
    };

    const handleMouseLeave = () => {
      card.style.setProperty('--spotlight-opacity', '0');
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    spotlightListeners.push(() => card.removeEventListener('mousemove', handleMouseMove));
    spotlightListeners.push(() => card.removeEventListener('mouseleave', handleMouseLeave));
  });

  cleanupTasks.push(() => spotlightListeners.forEach(fn => fn()));
}

initCardSpotlight();

/* ─────────────────────────────────────────────
   1. HERO NAME 3D TILT
   Name physically tilts as cursor moves
───────────────────────────────────────────── */
function initHeroNameTilt() {
  const heroSection = document.getElementById('hero');
  const heroName    = document.querySelector('.hero__name');
  if (!heroSection || !heroName) return;
  if (window.matchMedia('(hover: none)').matches) return;

  // Wrap the name in a preserve-3d container
  const wrap = document.createElement('div');
  wrap.classList.add('hero__name-wrap');
  heroName.parentNode.insertBefore(wrap, heroName);
  wrap.appendChild(heroName);

  const handleMouseMove = (e) => {
    const rect    = heroSection.getBoundingClientRect();
    const centerX = rect.left + rect.width  / 2;
    const centerY = rect.top  + rect.height / 2;

    // Normalise to -1 → +1
    const dx = (e.clientX - centerX) / (rect.width  / 2);
    const dy = (e.clientY - centerY) / (rect.height / 2);

    // Max tilt in degrees
    const maxTilt = 12;
    const rotY =  dx * maxTilt;
    const rotX = -dy * maxTilt * 0.5; // subtler on Y axis

    wrap.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  };

  const handleMouseLeave = () => {
    wrap.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    wrap.style.transform  = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
    setTimeout(() => { wrap.style.transition = ''; }, 800);
  };

  heroSection.addEventListener('mousemove', handleMouseMove);
  heroSection.addEventListener('mouseleave', handleMouseLeave);

  cleanupTasks.push(() => {
    heroSection.removeEventListener('mousemove', handleMouseMove);
    heroSection.removeEventListener('mouseleave', handleMouseLeave);
  });
}

initHeroNameTilt();

/* ─────────────────────────────────────────────
   CURSOR CLICK — SPARK BURST
   8 sparks shoot outward like an electrical discharge
───────────────────────────────────────────── */
function initClickSparks() {
  const sparkCanvas = document.createElement('canvas');
  sparkCanvas.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9996;
  `;
  document.body.appendChild(sparkCanvas);

  const ctx  = sparkCanvas.getContext('2d');
  let sparks = [];
  let sparkRafId = null;

  function resize() {
    sparkCanvas.width  = window.innerWidth;
    sparkCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const handleClick = (e) => {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle  = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const speed  = Math.random() * 5 + 3;
      const length = Math.random() * 14 + 8;
      sparks.push({
        x:     e.clientX,
        y:     e.clientY,
        vx:    Math.cos(angle) * speed,
        vy:    Math.sin(angle) * speed,
        life:  1,
        decay: Math.random() * 0.055 + 0.04,
        length,
        // Randomly violet or white
        color: Math.random() > 0.4 ? '#7C3AED' : '#ffffff',
      });
    }
  };
  document.addEventListener('click', handleClick);

  function drawSparks() {
    ctx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);

    sparks = sparks.filter(s => s.life > 0);

    sparks.forEach(s => {
      const tail = { x: s.x - s.vx * (s.length / 6), y: s.y - s.vy * (s.length / 6) };

      ctx.save();
      ctx.globalAlpha = s.life * s.life; // quadratic fade — sharp then soft
      ctx.strokeStyle = s.color;
      ctx.lineWidth   = s.life * 1.8;
      ctx.lineCap     = 'round';
      ctx.shadowBlur  = 6;
      ctx.shadowColor = s.color;

      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      ctx.restore();

      s.x    += s.vx;
      s.y    += s.vy;
      s.vx   *= 0.88; // decelerate
      s.vy   *= 0.88;
      s.life -= s.decay;
    });

    sparkRafId = requestAnimationFrame(drawSparks);
  }

  drawSparks();

  cleanupTasks.push(() => {
    if (sparkRafId !== null) cancelAnimationFrame(sparkRafId);
    window.removeEventListener('resize', resize);
    document.removeEventListener('click', handleClick);
    sparkCanvas.remove();
  });
}

initClickSparks();


/* ─────────────────────────────────────────────
   THROWABLE SKILL LOGO BUBBLES
   Logos load from Devicon CDN.
   Grab any bubble and throw it — physics handles the rest.
───────────────────────────────────────────── */
function initSkillBubbles() {
  const section = document.getElementById('skills');
  const canvas  = document.getElementById('skillBubbleCanvas');
  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d');

  const skillData = [
    // Languages
    { label: 'Python',      color: '#3572A5', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
    { label: 'JavaScript',  color: '#F7DF1E', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
    { label: 'Java',        color: '#E76F00', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
    { label: 'C',           color: '#A8B9CC', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg' },
    { label: 'HTML',        color: '#E34F26', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
    { label: 'CSS',         color: '#1572B6', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
    // Full-Stack
    { label: 'React',       color: '#61DAFB', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
    { label: 'Node.js',     color: '#68A063', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
    { label: 'PostgreSQL',  color: '#336791', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
    // AI / ML
    { label: 'PyTorch',     color: '#EE4C2C', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg' },
    { label: 'scikit',      color: '#F89939', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg' },
    // Tools
    { label: 'Git',         color: '#F05032', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
    { label: 'Docker',      color: '#2496ED', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
    // Embedded — no logo, styled text
    { label: 'VHDL',        color: '#7C3AED', url: null },
  ];

  const RADIUS = 44;

  // Load all logos in parallel
  const loadImg = (url) => new Promise(resolve => {
    if (!url) { resolve(null); return; }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });

  Promise.all(skillData.map(s => loadImg(s.url))).then(images => {

    let bubbles = [];
    let width, height;
    let dragging   = null;
    let mouse      = { x: -9999, y: -9999 };
    let prevMouse  = { x: -9999, y: -9999 };
    let mouseVel   = { x: 0, y: 0 };
    let frameCount = 0;
    let bubbleRafId = null;

    function resize() {
      width  = canvas.width  = section.offsetWidth;
      height = canvas.height = section.offsetHeight;
      place();
    }

    function place() {
      const cols  = Math.ceil(Math.sqrt(skillData.length));
      const cellW = width / cols;
      const cellH = (height - 150) / Math.ceil(skillData.length / cols);

      bubbles = skillData.map((s, i) => ({
        ...s,
        img:    images[i],
        radius: RADIUS,
        x:  cellW * (i % cols) + cellW / 2 + (Math.random() - 0.5) * 30,
        y:  160 + cellH * Math.floor(i / cols) + cellH / 2 + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
      }));
    }

    // ─── Input ───
    const pos = (e) => {
      const r = section.getBoundingClientRect();
      return e.touches
        ? { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top }
        : { x: e.clientX - r.left,             y: e.clientY - r.top };
    };

    const handleMouseDown = (e) => {
      const p = pos(e);
      for (const b of bubbles) {
        const d = Math.hypot(p.x - b.x, p.y - b.y);
        if (d < b.radius) { dragging = b; b.vx = 0; b.vy = 0; break; }
      }
    };

    const handleMouseMove = (e) => {
      prevMouse = { ...mouse };
      mouse     = pos(e);
      mouseVel  = { x: mouse.x - prevMouse.x, y: mouse.y - prevMouse.y };
      if (dragging) { dragging.x = mouse.x; dragging.y = mouse.y; }
    };

    const release = () => {
      if (dragging) {
        // Throw with mouse velocity — clamped so it doesn't go insane
        dragging.vx = Math.max(-12, Math.min(12, mouseVel.x * 1.1));
        dragging.vy = Math.max(-12, Math.min(12, mouseVel.y * 1.1));
        dragging = null;
      }
      mouse = { x: -9999, y: -9999 };
    };

    const handleTouchStart = (e) => {
      const p = pos(e);
      for (const b of bubbles) {
        if (Math.hypot(p.x - b.x, p.y - b.y) < b.radius) {
          e.preventDefault(); // only block scroll if grabbing a bubble
          dragging = b; b.vx = 0; b.vy = 0; break;
        }
      }
    };

    const handleTouchMove = (e) => {
      if (dragging) {
        e.preventDefault(); // only block scroll if actively dragging
        prevMouse = { ...mouse };
        mouse     = pos(e);
        mouseVel  = { x: mouse.x - prevMouse.x, y: mouse.y - prevMouse.y };
        dragging.x = mouse.x;
        dragging.y = mouse.y;
      }
      // if not dragging — do nothing, let browser scroll naturally
    };

    section.addEventListener('mousedown', handleMouseDown);
    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseup',    release);
    section.addEventListener('mouseleave', release);
    section.addEventListener('touchstart', handleTouchStart, { passive: false });
    section.addEventListener('touchmove',  handleTouchMove,  { passive: false });
    section.addEventListener('touchend',   release);

    window.addEventListener('resize', resize);
    resize();

    // ─── Draw loop ───
    function draw() {
      ctx.clearRect(0, 0, width, height);
      frameCount++;

      // Physics — skip dragged bubble
      bubbles.forEach(b => {
        if (b === dragging) return;

        b.x += b.vx;
        b.y += b.vy;

        // Wall bounce
        if (b.x - b.radius < 0)            { b.x = b.radius;               b.vx =  Math.abs(b.vx) * 0.75; }
        if (b.x + b.radius > width)         { b.x = width  - b.radius;      b.vx = -Math.abs(b.vx) * 0.75; }
        if (b.y - b.radius < 140)           { b.y = 140 + b.radius;         b.vy =  Math.abs(b.vy) * 0.75; }
        if (b.y + b.radius > height - 10)   { b.y = height - 10 - b.radius; b.vy = -Math.abs(b.vy) * 0.75; }

        // Speed cap + friction
        const spd = Math.hypot(b.vx, b.vy);
        if (spd > 10) { b.vx *= 10 / spd; b.vy *= 10 / spd; }
        b.vx *= 0.992;
        b.vy *= 0.992;
      });

      // Elastic collision — no overlap, proper billiard-ball bounce
      if (frameCount % 2 === 0) {
        for (let i = 0; i < bubbles.length; i++) {
          for (let j = i + 1; j < bubbles.length; j++) {
            const a  = bubbles[i];
            const bb = bubbles[j];
            const dx   = a.x - bb.x;
            const dy   = a.y - bb.y;
            const dist = Math.hypot(dx, dy);
            const minD = a.radius + bb.radius + 2;

            if (dist < minD && dist > 0) {
              // Push apart so they never overlap
              const overlap = (minD - dist) / 2;
              const nx = dx / dist;
              const ny = dy / dist;

              // If one is dragging, only push the non-dragged bubble
              if (a === dragging) {
                bb.x -= nx * overlap * 2; // Push other bubble away more
                bb.y -= ny * overlap * 2;
                // Give the hit bubble a kick so it glides away smoothly
                bb.vx -= nx * 8;
                bb.vy -= ny * 8;
              } else if (bb === dragging) {
                a.x += nx * overlap * 2;  // Push other bubble away more
                a.y += ny * overlap * 2;
                // Give the hit bubble a kick so it glides away smoothly
                a.vx += nx * 8;
                a.vy += ny * 8;
              } else {
                // Both free — normal billiard-style separation
                a.x  += nx * overlap;
                a.y  += ny * overlap;
                bb.x -= nx * overlap;
                bb.y -= ny * overlap;
              }

              // Elastic velocity exchange along collision normal (for free-flying bubbles)
              const dvx = a.vx - bb.vx;
              const dvy = a.vy - bb.vy;
              const dot = dvx * nx + dvy * ny;

              // Only resolve if moving toward each other
              if (dot < 0) {
                const impulse = dot * 0.85; // 0.85 = slight energy loss on impact
                if (a !== dragging) { a.vx  -= impulse * nx; a.vy  -= impulse * ny; }
                if (bb !== dragging) { bb.vx += impulse * nx; bb.vy += impulse * ny; }
              }
            }
          }
        }
      }

      // ─── Render each bubble ───
      bubbles.forEach(b => {
        const grabbed  = b === dragging;
        const hovering = !dragging && Math.hypot(mouse.x - b.x, mouse.y - b.y) < b.radius;

        ctx.save();
        ctx.shadowBlur  = grabbed ? 35 : hovering ? 22 : 10;
        ctx.shadowColor = b.color;

        // Circle fill
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = grabbed ? b.color + '55' : hovering ? b.color + '33' : b.color + '1A';
        ctx.fill();

        // Circle border
        ctx.strokeStyle = grabbed ? b.color : hovering ? b.color + 'DD' : b.color + '77';
        ctx.lineWidth   = grabbed ? 2.5 : hovering ? 2 : 1.2;
        ctx.stroke();
        ctx.restore();

        // Logo image (clipped to inner circle)
        const imgR = b.radius * 0.52;
        const imgY = b.y - b.radius * 0.18; // slightly above centre to leave room for label

        if (b.img) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(b.x, imgY, imgR, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(b.img, b.x - imgR, imgY - imgR, imgR * 2, imgR * 2);
          ctx.restore();
        } else {
          // VHDL — no logo, draw stylised text
          ctx.font         = '700 11px Inter, sans-serif';
          ctx.fillStyle    = b.color;
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.label, b.x, imgY);
        }

        // Label below logo
        ctx.font         = `${grabbed || hovering ? '700' : '500'} 9.5px Inter, sans-serif`;
        ctx.fillStyle    = grabbed || hovering ? '#FFFFFF' : '#B0A8CC';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.label, b.x, b.y + b.radius * 0.52);
      });

      // Cursor hint — show grab icon text when hoverable
      const nearAny = bubbles.some(b => Math.hypot(mouse.x - b.x, mouse.y - b.y) < b.radius);
      if (nearAny && !dragging && mouse.x > 0) {
        ctx.font      = '13px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.textAlign = 'center';
        ctx.fillText('✦ grab', mouse.x, mouse.y - 24);
      }

      bubbleRafId = requestAnimationFrame(draw);
    }

    draw();

    cleanupTasks.push(() => {
      if (bubbleRafId !== null) cancelAnimationFrame(bubbleRafId);
      window.removeEventListener('resize', resize);
      section.removeEventListener('mousedown', handleMouseDown);
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseup', release);
      section.removeEventListener('mouseleave', release);
      section.removeEventListener('touchstart', handleTouchStart, { passive: false });
      section.removeEventListener('touchmove', handleTouchMove, { passive: false });
      section.removeEventListener('touchend', release);
    });
  });
}

window.addEventListener('load', () => {
  setTimeout(initSkillBubbles, 500);
});