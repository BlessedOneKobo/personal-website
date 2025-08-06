// Smooth scrolling and navigation
document.addEventListener("DOMContentLoaded", function () {
  // Initialize animations and interactions
  initNavigation();
  initThemeToggle();
  initScrollAnimations();
  initSkillBars();
  initContactForm();

  // Add scroll event listeners
  window.addEventListener("scroll", updateNavbarBackground);
  window.addEventListener("scroll", updateActiveNavLink);
});

// Navigation functionality
function initNavigation() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Toggle mobile menu
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });

  // Smooth scroll for anchor links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Theme toggle functionality
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

// Update navbar background on scroll
function updateNavbarBackground() {
  const navbar = document.querySelector(".navbar");
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > 50) {
    navbar.style.background =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--bg-primary")
        .trim() === "#FFFFFF"
        ? "rgba(248, 250, 252, 0.95)"
        : "rgba(15, 23, 42, 0.95)";
  } else {
    navbar.style.background =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--bg-primary")
        .trim() === "#FFFFFF"
        ? "rgba(248, 250, 252, 0.8)"
        : "rgba(15, 23, 42, 0.8)";
  }
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const scrollPos = window.pageYOffset + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

// Initialize scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
        entry.target.classList.add("animate-in");

        // Trigger skill bars animation
        if (entry.target.classList.contains("skills")) {
          animateSkillBars();
        }

        // Trigger counter animation
        if (entry.target.classList.contains("about")) {
          animateCounters();
        }
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll("section").forEach((section) => {
    observer.observe(section);
  });

  // Add fade-in animations to cards and timeline items
  document
    .querySelectorAll(".project-card, .timeline-item, .skill-category")
    .forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(30px)";
      item.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      item.style.transitionDelay = `${index * 0.1}s`;
    });

  // Animate elements when they come into view
  const itemObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".project-card, .timeline-item, .skill-category")
    .forEach((item) => {
      itemObserver.observe(item);
    });
}

// Initialize and animate skill bars
function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");
  skillBars.forEach((bar) => {
    bar.style.width = "0%";
  });
}

function animateSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");
  skillBars.forEach((bar, index) => {
    const targetWidth = bar.getAttribute("data-width");
    setTimeout(() => {
      bar.style.width = `${targetWidth}%`;
    }, index * 100);
  });
}

// Animate counters in about section
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");

  counters.forEach((counter) => {
    const target = parseInt(counter.textContent.replace(/\D/g, ""));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = counter.textContent.replace(/\d+/, target);
        clearInterval(timer);
      } else {
        counter.textContent = counter.textContent.replace(
          /\d+/,
          Math.floor(current),
        );
      }
    }, 16);
  });
}

// Contact form functionality
function initContactForm() {
  const contactForm = document.getElementById("contact-form");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    // Create mailto link
    const mailtoLink = `mailto:blessedonekobo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

    // Open default email client
    window.location.href = mailtoLink;

    // Show success message
    showNotification("Thank you! Your message has been sent.", "success");

    // Reset form
    contactForm.reset();
  });
}

// Show notification
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "var(--success)" : "var(--primary)"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}

// Add hover effects to project cards
document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px) scale(1.02)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)";
    });
  });
});

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");

  if (hero && heroContent) {
    const rate = scrolled * -0.5;
    heroContent.style.transform = `translateY(${rate}px)`;
  }
});

// Add typing effect to hero title
function initTypingEffect() {
  const titleElement = document.querySelector(".hero-title");
  const originalText = titleElement.innerHTML;
  const textContent = titleElement.textContent;

  titleElement.innerHTML = "";

  let i = 0;
  const typeWriter = () => {
    if (i < textContent.length) {
      if (
        textContent.charAt(i) === "A" &&
        textContent.substring(i, i + 10) === "Abel Kalu"
      ) {
        titleElement.innerHTML +=
          '<span class="gradient-text">Abel Kalu</span>';
        i += 9;
      } else if (textContent.charAt(i) !== "A") {
        titleElement.innerHTML += textContent.charAt(i);
      }
      i++;
      setTimeout(typeWriter, 100);
    }
  };

  setTimeout(typeWriter, 1000);
}

// Initialize typing effect when page loads
window.addEventListener("load", () => {
  // setTimeout(initTypingEffect, 500);
});
