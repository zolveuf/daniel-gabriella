const countdownEl = document.getElementById("countdown");
const navToggle = document.querySelector(".nav__toggle");
const navLinks = document.querySelector(".nav__links");
const languageOverlay = document.getElementById("languageOverlay");
const languageButtons = document.querySelectorAll("[data-lang-choice]");
const langToggle = document.getElementById("langToggle");
const LANGUAGE_STORAGE_KEY = "weddingSiteLanguage";

function getCurrentLang() {
  return document.body.getAttribute("data-lang") === "hr" ? "hr" : "sv";
}

function syncAccessibleLabels() {
  const heroImg = document.getElementById("heroPhoto");
  if (heroImg) {
    const altSv = heroImg.getAttribute("data-alt-sv");
    const altHr = heroImg.getAttribute("data-alt-hr");
    if (altSv && altHr) {
      heroImg.alt = getCurrentLang() === "hr" ? altHr : altSv;
    }
  }

  const mapWrap = document.getElementById("venueMapWrap");
  if (mapWrap) {
    const aSv = mapWrap.getAttribute("data-aria-sv");
    const aHr = mapWrap.getAttribute("data-aria-hr");
    if (aSv && aHr) {
      mapWrap.setAttribute("aria-label", getCurrentLang() === "hr" ? aHr : aSv);
    }
  }

  const mapsBtn = document.getElementById("mapsLinkBtn");
  if (mapsBtn) {
    const aSv = mapsBtn.getAttribute("data-aria-sv");
    const aHr = mapsBtn.getAttribute("data-aria-hr");
    if (aSv && aHr) {
      mapsBtn.setAttribute("aria-label", getCurrentLang() === "hr" ? aHr : aSv);
    }
  }

  document.querySelectorAll("[data-placeholder-sv]").forEach((el) => {
    const ps = el.getAttribute("data-placeholder-sv");
    const ph = el.getAttribute("data-placeholder-hr");
    if (ps && ph && "placeholder" in el) {
      el.placeholder = getCurrentLang() === "hr" ? ph : ps;
    }
  });
}

function applyLanguage(lang) {
  const safeLang = lang === "hr" ? "hr" : "sv";
  document.body.setAttribute("data-lang", safeLang);
  document.documentElement.lang = safeLang;
  syncAccessibleLabels();
  updateCountdown();
}

function updateCountdown() {
  if (!countdownEl) return;
  const weddingDate = new Date("2026-06-20T15:00:00+02:00");
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();
  const hr = getCurrentLang() === "hr";

  if (diff <= 0) {
    countdownEl.textContent = hr ? "Danas je vjenčanje!" : "Idag är det bröllop!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  countdownEl.textContent = hr
    ? `${days} dana, ${hours} sati`
    : `${days} dagar, ${hours} timmar`;
}

const savedLanguageEarly = localStorage.getItem(LANGUAGE_STORAGE_KEY);
if (savedLanguageEarly === "sv" || savedLanguageEarly === "hr") {
  applyLanguage(savedLanguageEarly);
  if (languageOverlay) {
    languageOverlay.classList.add("language-overlay--hidden");
  }
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
      applyLanguage(lang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      languageOverlay.classList.add("language-overlay--hidden");
    });
  });
}

if (langToggle) {
  langToggle.addEventListener("click", () => {
    const next = getCurrentLang() === "hr" ? "sv" : "hr";
    applyLanguage(next);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    if (languageOverlay) {
      languageOverlay.classList.add("language-overlay--hidden");
    }
  });
}

// FormKeep expects absolute redirect URLs. Build them at runtime.
const redirectInputs = document.querySelectorAll("input[data-redirect-path]");
if (redirectInputs.length) {
  const isHttp = window.location.protocol === "http:" || window.location.protocol === "https:";
  redirectInputs.forEach((input) => {
    const redirectPath = input.getAttribute("data-redirect-path");
    if (!redirectPath) return;
    if (isHttp) {
      input.value = new URL(redirectPath, window.location.href).toString();
      return;
    }
    // On file:// previews, avoid invalid redirect URLs that can break submission.
    input.removeAttribute("name");
  });
}

syncAccessibleLabels();

