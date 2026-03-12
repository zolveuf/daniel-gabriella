const countdownEl = document.getElementById("countdown");
const navToggle = document.querySelector(".nav__toggle");
const navLinks = document.querySelector(".nav__links");
const languageOverlay = document.getElementById("languageOverlay");
const languageButtons = document.querySelectorAll("[data-lang-choice]");

function updateCountdown() {
  if (!countdownEl) return;
  const weddingDate = new Date("2026-06-20T15:00:00+02:00");
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();

  if (diff <= 0) {
    countdownEl.textContent = "Idag är det bröllop!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  countdownEl.textContent = `${days} dagar, ${hours} timmar`;
}

updateCountdown();
setInterval(updateCountdown, 60 * 1000);

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("nav__links--open");
    document.body.classList.toggle("nav-open");
  });

  navLinks.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (link) {
      navLinks.classList.remove("nav__links--open");
      document.body.classList.remove("nav-open");
    }
  });
}

if (languageOverlay && languageButtons.length) {
  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.getAttribute("data-lang-choice") || "sv";
      document.body.setAttribute("data-lang", lang);
      document.documentElement.lang = lang === "hr" ? "hr" : "sv";
      languageOverlay.classList.add("language-overlay--hidden");
    });
  });
}

