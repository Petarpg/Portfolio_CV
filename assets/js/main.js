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
});
