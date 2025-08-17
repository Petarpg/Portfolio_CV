document.addEventListener("DOMContentLoaded", function () {
  var toggleButton = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("nav-links");
  if (!toggleButton || !navLinks) return;

  toggleButton.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("open");
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when clicking a link (mobile UX)
  navLinks.addEventListener("click", function (e) {
    var target = e.target;
    if (target && target.tagName === "A") {
      navLinks.classList.remove("open");
      toggleButton.setAttribute("aria-expanded", "false");
    }
  });

  // Language Switcher
  var langBgBtn = document.getElementById("lang-bg");
  var langEnBtn = document.getElementById("lang-en");
  var currentLang = localStorage.getItem("language") || "en";

  // Initialize language
  setLanguage(currentLang);

  if (langBgBtn && langEnBtn) {
    langBgBtn.addEventListener("click", function () {
      setLanguage("bg");
      localStorage.setItem("language", "bg");
      currentLang = "bg";
    });

    langEnBtn.addEventListener("click", function () {
      setLanguage("en");
      localStorage.setItem("language", "en");
      currentLang = "en";
    });
  }

  function setLanguage(lang) {
    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update page title
    var title = document.querySelector("title");
    if (title && title.dataset[lang]) {
      title.textContent = title.dataset[lang];
    }

    // Update all elements with data attributes
    var elements = document.querySelectorAll("[data-en][data-bg]");
    elements.forEach(function (element) {
      if (element.dataset[lang]) {
        element.textContent = element.dataset[lang];
      }
    });

    // Update language button states
    if (langBgBtn && langEnBtn) {
      langBgBtn.classList.toggle("active", lang === "bg");
      langEnBtn.classList.toggle("active", lang === "en");
    }
  }

  // --- Language dots initialization ---
  document.querySelectorAll(".lang-dots").forEach(function (row) {
    var score = Math.max(0, Math.min(5, Number(row.dataset.score || 0)));
    for (var i = 1; i <= 5; i++) {
      var d = document.createElement("span");
      d.className = "dot" + (i <= score ? " filled" : "");
      row.appendChild(d);
    }
  });

  // --- Year in footer ---
  var year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
});
