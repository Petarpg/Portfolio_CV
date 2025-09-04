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

  var year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  // Memory Flip Game
  var gameEl = document.getElementById("memory-game");
  var movesEl = document.getElementById("mem-moves");
  var matchesEl = document.getElementById("mem-matches");
  var bestEl = document.getElementById("mem-best");
  var restartBtn = document.getElementById("mem-restart");

  if (gameEl && movesEl && matchesEl && bestEl && restartBtn) {
    var deck = [];
    var firstFlipped = null;
    var lockBoard = false;
    var moves = 0;
    var matches = 0;
    var best = Number(localStorage.getItem("mem_best") || 0);
    if (best > 0) bestEl.textContent = String(best);

    var items = [
      {
        key: "html",
        label: "HTML5",
        img: "assets/img/tech/icons8-html-48.png",
      },
      { key: "css", label: "CSS", img: "assets/img/tech/icons8-css-100.png" },
      {
        key: "js",
        label: "JavaScript",
        img: "assets/img/tech/icons8-js-48.png",
      },
      {
        key: "symfony",
        label: "Symfony",
        img: "assets/img/tech/symfony-icon.png",
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
      // icon/name pairs per key
      var pairs = [];
      items.forEach(function (it) {
        pairs.push({ type: "icon", key: it.key, content: it });
        pairs.push({ type: "name", key: it.key, content: it });
      });
      // shuffle
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
      deck.forEach(function (card, idx) {
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
          var nameDiv = document.createElement("div");
          nameDiv.textContent = card.content.label;
          nameDiv.style.fontWeight = "700";
          backContent.appendChild(nameDiv);
        }

        back.appendChild(backContent);
        inner.appendChild(front);
        inner.appendChild(back);
        cardEl.appendChild(inner);

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
        // match
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
        }
      } else {
        lockBoard = true;
        setTimeout(function () {
          unflip(firstFlipped);
          unflip(current);
          firstFlipped = null;
          lockBoard = false;
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
      buildDeck();
      render();
    }

    restartBtn.addEventListener("click", resetGame);
    resetGame();
  }
});
