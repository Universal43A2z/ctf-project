// Light/dark theme toggle (persisted in localStorage).
(function () {
  var KEY = "ctf-theme";

  function isLoginPage() {
    return document.body && document.body.classList.contains("login-page");
  }

  function apply() {
    var t = localStorage.getItem(KEY) || "dark";
    if (t !== "light" && t !== "dark") t = "dark";
    document.documentElement.setAttribute("data-theme", t);

    var btn = document.getElementById("themeToggle");
    if (!btn) return;
    if (isLoginPage()) {
      // Landing page: labeled pill showing the mode you switch to.
      btn.textContent = t === "dark" ? "☀️ LIGHT" : "🌙 DARK";
    } else {
      // Other pages: compact circular button.
      btn.textContent = t === "dark" ? "☀️" : "🌙";
    }
  }

  window.toggleTheme = function () {
    var cur = document.documentElement.getAttribute("data-theme");
    localStorage.setItem(KEY, cur === "light" ? "dark" : "light");
    apply();
  };

  // Script runs in <head>, before the button exists, so bind once the
  // DOM is ready (and also handle script tags loaded after DOM ready).
  function init() {
    var btn = document.getElementById("themeToggle");
    if (btn) btn.addEventListener("click", window.toggleTheme);
    apply();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();