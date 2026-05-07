/* ═══════════════════════════════════════════════
   main.js — Amir Mahdian Portfolio
═══════════════════════════════════════════════ */


/* ─────────────────────────────────────────────
   PAGE LOADER
───────────────────────────────────────────── */
const loader = document.getElementById("loader");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("is-hidden");
  }, 900);
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

function animateOutline() {
  outlineX += (dotX - outlineX) * 0.14;
  outlineY += (dotY - outlineY) * 0.14;
  cursorOutline.style.left = outlineX + "px";
  cursorOutline.style.top  = outlineY + "px";
  requestAnimationFrame(animateOutline);
}
animateOutline();

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
   MAGNETIC BUTTONS
   Buttons attract toward cursor when nearby
───────────────────────────────────────────── */
function initMagneticButtons() {
  const buttons = document.querySelectorAll(".btn");

  buttons.forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect     = btn.getBoundingClientRect();
      const btnCX    = rect.left + rect.width  / 2;
      const btnCY    = rect.top  + rect.height / 2;
      const dx       = e.clientX - btnCX;
      const dy       = e.clientY - btnCY;

      // Strength — how far the button pulls (px)
      const strength = 0.38;

      btn.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      // Spring back smoothly
      btn.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
      btn.style.transform  = "translate(0px, 0px)";

      // Remove inline transition after spring completes
      setTimeout(() => { btn.style.transition = ""; }, 500);
    });

    btn.addEventListener("mouseenter", () => {
      // Fast response on entry
      btn.style.transition = "transform 0.15s ease";
    });
  });
}

// Call it
initMagneticButtons();

/* ─────────────────────────────────────────────
   NAV — frosted glass on scroll
───────────────────────────────────────────── */
const nav             = document.getElementById("nav");
const scrollContainer = document.getElementById("scrollContainer");
const scrollProgress  = document.getElementById("scrollProgress");

scrollContainer.addEventListener("scroll", () => {
  // Nav frosted glass
  nav.classList.toggle("nav--scrolled", scrollContainer.scrollTop > 50);
  updateActiveNav();

  // Scroll progress bar
  const scrolled = scrollContainer.scrollTop;
  const total    = scrollContainer.scrollHeight - scrollContainer.clientHeight;
  const pct      = total > 0 ? (scrolled / total) * 100 : 0;
  scrollProgress.style.width = pct + "%";
});


/* ─────────────────────────────────────────────
   ACTIVE NAV LINK
───────────────────────────────────────────── */
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav__link");

function updateActiveNav() {
  let currentId = "";
  const containerMid = scrollContainer.scrollTop + window.innerHeight / 2;

  sections.forEach(section => {
    if (containerMid >= section.offsetTop) {
      currentId = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("is-active");
    if (link.getAttribute("href") === `#${currentId}`) {
      link.classList.add("is-active");
    }
  });
}

updateActiveNav();


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

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

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
        submitBtn.textContent = "Try again";
        submitBtn.disabled    = false;
      }
    } catch {
      submitBtn.textContent = "Try again";
      submitBtn.disabled    = false;
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

  function scrambleWord(newWord) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01"; 
    let iterations = 0;
    
    // Array.from() prevents emojis from being sliced in half and breaking
    const wordArray = Array.from(newWord); 
    
    const interval = setInterval(() => {
      scrambleElement.innerText = wordArray
        .map((letter, index) => {
          if (index < iterations) return wordArray[index]; 
          
          // Only scramble standard letters and numbers. Leave spaces, emojis, and punctuation alone!
          if (!/[a-zA-Z0-9]/.test(wordArray[index])) return wordArray[index];
          
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      
      if (iterations >= wordArray.length) {
        clearInterval(interval);
      }
      
      iterations += 1; // Speed of the reveal
    }, 30); 
  }

  // Waits 8 FULL SECONDS before scrambling to the next fact
  setInterval(() => {
    wordIndex = (wordIndex + 1) % words.length;
    scrambleWord(words[wordIndex]);
  }, 5000); 
}

/* ─────────────────────────────────────────────
   ABOUT ME BANNER / SLIDESHOW AUTOMATION
───────────────────────────────────────────── */
const slides = document.querySelectorAll('.about__slide');

if (slides.length > 1) {
  let currentSlide = 0;

  setInterval(() => {
    // Remove active class from current image
    slides[currentSlide].classList.remove('is-active');
    
    // Move to the next image (loop back to start if at the end)
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Add active class to new image to trigger the fade and zoom
    slides[currentSlide].classList.add('is-active');
  }, 6000); // Changes the banner image every 6 seconds
}

/* ─────────────────────────────────────────────
   CARD CURSOR SPOTLIGHT
   A glow follows your cursor inside project cards
───────────────────────────────────────────── */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--spotlight-x', `${x}px`);
      card.style.setProperty('--spotlight-y', `${y}px`);
      card.style.setProperty('--spotlight-opacity', '1');
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--spotlight-opacity', '0');
    });
  });
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

  // Wrap the name in a preserve-3d container
  const wrap = document.createElement('div');
  wrap.classList.add('hero__name-wrap');
  heroName.parentNode.insertBefore(wrap, heroName);
  wrap.appendChild(heroName);

  heroSection.addEventListener('mousemove', (e) => {
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
  });

  heroSection.addEventListener('mouseleave', () => {
    // Spring back to flat
    wrap.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    wrap.style.transform  = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
    setTimeout(() => { wrap.style.transition = ''; }, 800);
  });

  // Don't run on touch devices — performance
  if (window.matchMedia('(hover: none)').matches) return;
}

initHeroNameTilt();

/* ─────────────────────────────────────────────
   4. AMBIENT CLICK RIPPLE
   Violet ring expands from cursor on click
───────────────────────────────────────────── */
function initClickRipple() {
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.classList.add('click-ripple');
    ripple.style.left = e.clientX + 'px';
    ripple.style.top  = e.clientY + 'px';
    document.body.appendChild(ripple);

    // Remove after animation completes
    setTimeout(() => ripple.remove(), 700);
  });
}

initClickRipple();


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

    section.addEventListener('mousedown', e => {
      const p = pos(e);
      for (const b of bubbles) {
        const d = Math.hypot(p.x - b.x, p.y - b.y);
        if (d < b.radius) { dragging = b; b.vx = 0; b.vy = 0; break; }
      }
    });

    section.addEventListener('mousemove', e => {
      prevMouse = { ...mouse };
      mouse     = pos(e);
      mouseVel  = { x: mouse.x - prevMouse.x, y: mouse.y - prevMouse.y };
      if (dragging) { dragging.x = mouse.x; dragging.y = mouse.y; }
    });

    const release = () => {
      if (dragging) {
        // Throw with mouse velocity — clamped so it doesn't go insane
        dragging.vx = Math.max(-12, Math.min(12, mouseVel.x * 1.1));
        dragging.vy = Math.max(-12, Math.min(12, mouseVel.y * 1.1));
        dragging = null;
      }
      mouse = { x: -9999, y: -9999 };
    };

    section.addEventListener('mouseup',    release);
    section.addEventListener('mouseleave', release);

    // Touch support
    section.addEventListener('touchstart', e => {
      e.preventDefault();
      const p = pos(e);
      for (const b of bubbles) {
        if (Math.hypot(p.x - b.x, p.y - b.y) < b.radius) {
          dragging = b; b.vx = 0; b.vy = 0; break;
        }
      }
    }, { passive: false });

    section.addEventListener('touchmove', e => {
      e.preventDefault();
      prevMouse = { ...mouse };
      mouse     = pos(e);
      mouseVel  = { x: mouse.x - prevMouse.x, y: mouse.y - prevMouse.y };
      if (dragging) { dragging.x = mouse.x; dragging.y = mouse.y; }
    }, { passive: false });

    section.addEventListener('touchend', release);

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

      // Bubble–bubble separation — only every 2nd frame for perf
      if (frameCount % 2 === 0) {
        for (let i = 0; i < bubbles.length; i++) {
          for (let j = i + 1; j < bubbles.length; j++) {
            const a = bubbles[i], bb = bubbles[j];
            const dx   = a.x - bb.x;
            const dy   = a.y - bb.y;
            const dist = Math.hypot(dx, dy);
            const minD = a.radius + bb.radius + 5;
            if (dist < minD && dist > 0) {
              const push = ((minD - dist) / minD) * 0.35;
              const nx = dx / dist, ny = dy / dist;
              if (a  !== dragging) { a.vx  += nx * push; a.vy  += ny * push; }
              if (bb !== dragging) { bb.vx -= nx * push; bb.vy -= ny * push; }
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

      requestAnimationFrame(draw);
    }

    draw();
  });
}

window.addEventListener('load', () => {
  setTimeout(initSkillBubbles, 500);
});