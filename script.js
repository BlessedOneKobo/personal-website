const html = document.documentElement;
const btn = document.getElementById("theme-btn");
const iconEl = document.getElementById("theme-icon");
const labelEl = document.getElementById("theme-label");

function applyTheme(theme) {
  html.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (theme === "dark") {
    iconEl.textContent = "☾";
    labelEl.textContent = "Dark";
  } else {
    iconEl.textContent = "☀";
    labelEl.textContent = "Light";
  }
}

const stored = localStorage.getItem("theme");
if (stored) {
  applyTheme(stored);
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });

btn.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
window.addEventListener("scroll", onScroll, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }),
  { threshold: 0.08 },
);
document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));
