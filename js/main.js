/* ═══════════════════════════════════════════════
   main.js — Stage 4
   Custom cursor · Nav scroll state · Active nav
   Hamburger menu · Form feedback · Page loader
═══════════════════════════════════════════════ */


/* ─────────────────────────────────────────────
   PAGE LOADER
   Hides the loader once everything is ready,
   then lets animations.js fire the hero
───────────────────────────────────────────── */
const loader = document.getElementById("loader");

window.addEventListener("load", () => {
  // Small delay so the logo pulse is seen briefly
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
   NAV — frosted glass on scroll
───────────────────────────────────────────── */
const nav             = document.getElementById("nav");
const scrollContainer = document.getElementById("scrollContainer");

scrollContainer.addEventListener("scroll", () => {
  nav.classList.toggle("nav--scrolled", scrollContainer.scrollTop > 50);
  updateActiveNav();
});


/* ─────────────────────────────────────────────
   ACTIVE NAV LINK
   Highlights the nav link matching the section
   currently snapped into view
───────────────────────────────────────────── */
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav__link");

function updateActiveNav() {
  // Find which section is most visible in the scroll container
  let currentId = "";
  const containerMid = scrollContainer.scrollTop + window.innerHeight / 2;

  sections.forEach(section => {
    const offsetTop = section.offsetTop;
    if (containerMid >= offsetTop) {
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

// Set initial active state on load
updateActiveNav();


/* ─────────────────────────────────────────────
   HAMBURGER MENU
───────────────────────────────────────────── */
const hamburger  = document.getElementById("hamburger");
const mobileNav  = document.querySelector(".nav__links");

hamburger.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("nav__links--open");
  hamburger.classList.toggle("is-open", isOpen);
  hamburger.setAttribute("aria-expanded", isOpen);
});

// Close on link click
document.querySelectorAll(".nav__link").forEach(link => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("nav__links--open");
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});


/* ─────────────────────────────────────────────
   CONTACT FORM — submission feedback
   Intercepts the Formspree submit, shows a
   success message instead of redirecting
───────────────────────────────────────────── */
const contactForm  = document.getElementById("contactForm");
const submitBtn    = document.getElementById("submitBtn");
const formSuccess  = document.getElementById("formSuccess");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Show loading state on button
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
        // Success — hide form, show message
        contactForm.reset();
        submitBtn.textContent = "Send Message";
        submitBtn.disabled    = false;
        formSuccess.classList.add("is-visible");

        // Hide success message after 6 seconds
        setTimeout(() => {
          formSuccess.classList.remove("is-visible");
        }, 6000);

      } else {
        // Formspree returned an error
        submitBtn.textContent = "Try again";
        submitBtn.disabled    = false;
      }

    } catch {
      // Network error
      submitBtn.textContent = "Try again";
      submitBtn.disabled    = false;
    }
  });
}