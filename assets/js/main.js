// Scroll Animation System
document.addEventListener("DOMContentLoaded", function () {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      } else {
        entry.target.classList.remove("animate-in");
      }
    });
  }, observerOptions);

  // Observe all elements with scroll-animate class
  const animateElements = document.querySelectorAll(".scroll-animate");
  animateElements.forEach(function (element) {
    observer.observe(element);
  });

  // Lazy button functionality
  const lazyBtn = document.getElementById("lazy-btn");
  const marquee = document.querySelector(".marquee");

  if (lazyBtn && marquee) {
    lazyBtn.addEventListener("click", function () {
      marquee.classList.add("show");
      lazyBtn.style.display = "none"; // Hide button after clicking
    });
  }

  // Navbar scroll detection for Memory section
  const siteHeader = document.querySelector(".site-header");
  const memorySection = document.getElementById("memory");

  if (siteHeader && memorySection) {
    function handleNavbarScroll() {
      const memoryRect = memorySection.getBoundingClientRect();
      const headerHeight = siteHeader.offsetHeight;

      // Check if navbar is over the memory section
      const isOverMemory =
        memoryRect.top <= headerHeight && memoryRect.bottom >= 0;

      if (isOverMemory) {
        siteHeader.classList.add("over-memory");
      } else {
        siteHeader.classList.remove("over-memory");
      }
    }

    // Listen for scroll events
    window.addEventListener("scroll", handleNavbarScroll);

    // Check initial state
    handleNavbarScroll();
  }
});

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

  // --- Wig Selection ---
  var noneBtn = document.getElementById("none-btn");
  var shortHairBtn = document.getElementById("short-hair-btn");
  var longHairBtn = document.getElementById("long-hair-btn");
  var shortHairImg = document.getElementById("short-hair");
  var longHairImg = document.getElementById("long-hair");

  if (noneBtn && shortHairBtn && longHairBtn && shortHairImg && longHairImg) {
    // Initially show no hair (none selected)
    shortHairImg.classList.remove("show");
    longHairImg.classList.remove("show");

    function updateButtonStates(activeBtn) {
      // Remove active class from all buttons
      noneBtn.classList.remove("active");
      shortHairBtn.classList.remove("active");
      longHairBtn.classList.remove("active");

      // Add active class to clicked button
      activeBtn.classList.add("active");
    }

    function hideAllHair() {
      shortHairImg.classList.remove("show");
      longHairImg.classList.remove("show");
    }

    noneBtn.addEventListener("click", function () {
      updateButtonStates(noneBtn);
      hideAllHair();
    });

    shortHairBtn.addEventListener("click", function () {
      updateButtonStates(shortHairBtn);

      // Hide long hair first, then show short hair with animation
      longHairImg.classList.remove("show");
      setTimeout(function () {
        shortHairImg.classList.add("show");
      }, 50);
    });

    longHairBtn.addEventListener("click", function () {
      updateButtonStates(longHairBtn);

      // Hide short hair first, then show long hair with animation
      shortHairImg.classList.remove("show");
      setTimeout(function () {
        longHairImg.classList.add("show");
      }, 50);
    });
  }
});

// Memory Flip Game (icon ↔ name) with timer mode and animations
document.addEventListener("DOMContentLoaded", function () {
  var gameEl = document.getElementById("memory-game");
  var movesEl = document.getElementById("mem-moves");
  var matchesEl = document.getElementById("mem-matches");
  var bestEl = document.getElementById("mem-best");
  var restartBtn = document.getElementById("mem-restart");
  var timerToggle = document.getElementById("mem-timer-toggle");
  var timerEl = document.getElementById("mem-timer");
  var overlay = document.getElementById("mem-overlay");
  var overlayRestart = document.getElementById("mem-overlay-restart");

  if (!gameEl || !movesEl || !matchesEl || !bestEl || !restartBtn) return;

  var deck = [];
  var firstFlipped = null;
  var lockBoard = false;
  var moves = 0;
  var matches = 0;
  var best = Number(localStorage.getItem("mem_best") || 0);
  if (best > 0) bestEl.textContent = String(best);
  var timerId = null;
  var timeLeft = 30;

  var items = [
    { key: "html", label: "HTML5", img: "assets/img/tech/icons8-html-48.png" },
    { key: "css", label: "CSS", img: "assets/img/tech/icons8-css-100.png" },
    { key: "js", label: "JavaScript", img: "assets/img/tech/icons8-js-48.png" },
    {
      key: "React",
      label: "React",
      img: "assets/img/tech/science.png",
    },
    {
      key: "python",
      label: "Python",
      img: "assets/img/tech/icons8-python-48.png",
    },
    {
      key: "django",
      label: "Django",
      img: "assets/img/tech/icons8-django-24.png",
    },
    { key: "php", label: "PHP", img: "assets/img/tech/icons8-php-80.png" },
    {
      key: "mysql",
      label: "MySQL",
      img: "assets/img/tech/icons8-mysql-96.png",
    },
  ];

  function buildDeck() {
    var pairs = [];
    items.forEach(function (it) {
      pairs.push({ type: "icon", key: it.key, content: it });
      pairs.push({ type: "name", key: it.key, content: it });
    });
    for (var i = pairs.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = pairs[i];
      pairs[i] = pairs[j];
      pairs[j] = t;
    }
    deck = pairs;
  }

  function render() {
    gameEl.innerHTML = "";
    deck.forEach(function (card) {
      var cardEl = document.createElement("button");
      cardEl.className = "card";
      cardEl.type = "button";
      cardEl.setAttribute("data-key", card.key);
      cardEl.setAttribute("data-type", card.type);
      cardEl.setAttribute(
        "aria-label",
        card.type === "icon"
          ? card.content.label + " icon"
          : card.content.label + " name"
      );

      var inner = document.createElement("div");
      inner.className = "card-inner";

      var front = document.createElement("div");
      front.className = "card-face card-front";
      var back = document.createElement("div");
      back.className = "card-face card-back";

      var backContent = document.createElement("div");
      backContent.className = "card-content";
      if (card.type === "icon") {
        var img = document.createElement("img");
        img.src = card.content.img;
        img.alt = card.content.label;
        backContent.appendChild(img);
        var span = document.createElement("div");
        span.className = "label";
        span.textContent = card.content.label;
        backContent.appendChild(span);
      } else {
        var img2 = document.createElement("img");
        img2.src = card.content.img;
        img2.alt = card.content.label;
        backContent.appendChild(img2);
        var nameDiv = document.createElement("div");
        nameDiv.textContent = card.content.label;
        nameDiv.style.fontWeight = "700";
        backContent.appendChild(nameDiv);
      }

      back.appendChild(backContent);
      inner.appendChild(front);
      inner.appendChild(back);
      cardEl.appendChild(inner);

      var sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      cardEl.appendChild(sparkle);

      cardEl.addEventListener("click", function () {
        if (lockBoard) return;
        if (cardEl.classList.contains("is-flipped")) return;
        flip(cardEl);
        handleFlip(cardEl);
      });

      gameEl.appendChild(cardEl);
    });
  }

  function flip(el) {
    el.classList.add("is-flipped");
  }
  function unflip(el) {
    el.classList.remove("is-flipped");
  }
  function match(el1, el2) {
    el1.classList.add("is-matched");
    el2.classList.add("is-matched");
    el1.setAttribute("disabled", "true");
    el2.setAttribute("disabled", "true");
  }

  function handleFlip(current) {
    if (!firstFlipped) {
      firstFlipped = current;
      return;
    }
    moves += 1;
    movesEl.textContent = String(moves);

    var key1 = firstFlipped.getAttribute("data-key");
    var type1 = firstFlipped.getAttribute("data-type");
    var key2 = current.getAttribute("data-key");
    var type2 = current.getAttribute("data-type");

    if (key1 === key2 && type1 !== type2) {
      match(firstFlipped, current);
      matches += 1;
      matchesEl.textContent = String(matches);
      firstFlipped = null;
      if (matches === items.length) {
        if (best === 0 || moves < best) {
          best = moves;
          localStorage.setItem("mem_best", String(best));
          bestEl.textContent = String(best);
        }
        stopTimer();
      }
    } else {
      lockBoard = true;
      setTimeout(function () {
        firstFlipped.classList.add("shake");
        current.classList.add("shake");
        setTimeout(function () {
          firstFlipped.classList.remove("shake");
          current.classList.remove("shake");
          unflip(firstFlipped);
          unflip(current);
          firstFlipped = null;
          lockBoard = false;
        }, 180);
      }, 700);
    }
  }

  function resetGame() {
    moves = 0;
    matches = 0;
    firstFlipped = null;
    lockBoard = false;
    movesEl.textContent = "0";
    matchesEl.textContent = "0";
    stopTimer();
    if (timerToggle && timerToggle.checked) {
      timeLeft = 10;
      timerEl.hidden = false;
      timerEl.textContent = formatTime(timeLeft);
      timerId = setInterval(function () {
        timeLeft -= 1;
        timerEl.textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
          stopTimer();
          lockBoard = true;
          showGameOver();
        }
      }, 1000);
    } else if (timerEl) {
      timerEl.hidden = true;
    }
    buildDeck();
    render();
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }
  function formatTime(s) {
    var m = Math.floor(s / 60);
    var r = s % 60;
    return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
  }

  function showGameOver() {
    if (!overlay) return;
    overlay.classList.remove("hidden");
    if (overlayRestart) {
      overlayRestart.addEventListener(
        "click",
        function () {
          overlay.classList.add("hidden");
          resetGame();
        },
        { once: true }
      );
    }
  }

  restartBtn.addEventListener("click", resetGame);
  if (timerToggle) {
    timerToggle.addEventListener("change", resetGame);
  }
  resetGame();
});
