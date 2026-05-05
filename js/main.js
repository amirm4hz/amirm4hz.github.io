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
   SKILLS CONSTELLATION WEB
───────────────────────────────────────────── */
function initConstellation() {
  const canvas = document.getElementById("constellationCanvas");
  const skillsSection = document.getElementById("skills");
  if (!canvas || !skillsSection) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];
  
  // Track mouse coordinates relative to the skills section
  let mouse = { x: -1000, y: -1000 };

  // Adjust canvas size to match the section exactly
  function resize() {
    width = skillsSection.offsetWidth;
    height = skillsSection.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
  }

  // Create the background nodes (stars)
  function initParticles() {
    particles = [];
    // Adjust the number of nodes based on screen size so it isn't too cluttered on mobile
    const numParticles = Math.floor((width * height) / 15000); 
    
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5, // Slow drift speed
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.5
      });
    }
  }

  window.addEventListener("resize", resize);
  resize();

  // Track the mouse only when it's over the skills section
  skillsSection.addEventListener("mousemove", (e) => {
    const rect = skillsSection.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  skillsSection.addEventListener("mouseleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // The Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];

      // Move particles
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges smoothly
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Draw the node (star)
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(124, 58, 237, 0.5)"; // Deep purple
      ctx.fill();

      // Check distance to mouse
      let dxMouse = mouse.x - p.x;
      let dyMouse = mouse.y - p.y;
      let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

      // If mouse is near, draw a bright line connecting to it
      if (distMouse < 200) {
        ctx.beginPath();
        // The closer the mouse, the more opaque the line
        ctx.strokeStyle = `rgba(157, 95, 245, ${1 - distMouse / 200})`; 
        ctx.lineWidth = 1.5;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }

      // Check distance to other nodes to create the "web"
      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        // Connect nearby nodes with faint, subtle lines
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.2 - dist / 600})`; 
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  
  animate();
}

// Start the effect shortly after the page loads
window.addEventListener("load", () => {
  setTimeout(initConstellation, 300);
});

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