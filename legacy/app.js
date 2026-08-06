/* Anushtanam — reader app (vanilla JS, hash routing, offline-friendly) */
(function () {
  "use strict";

  var data = window.ANUSHTANAM || { daily: [], categories: [] };

  // ---- flatten items for lookup + prev/next ordering ----
  var allItems = [];
  data.categories.forEach(function (cat) {
    cat.items.forEach(function (it) {
      allItems.push(Object.assign({}, it, { catId: cat.id, catTitle: cat.title, catTitleEn: cat.titleEn }));
    });
  });
  function findItem(id) { return allItems.filter(function (i) { return i.id === id; })[0]; }

  var page = document.getElementById("page");

  // ---------- Preferences (theme + font size) ----------
  var PREFS = "anushtanam.prefs";
  function loadPrefs() {
    try { return JSON.parse(localStorage.getItem(PREFS)) || {}; } catch (e) { return {}; }
  }
  function savePrefs(p) { try { localStorage.setItem(PREFS, JSON.stringify(p)); } catch (e) {} }
  var prefs = loadPrefs();
  var fontStep = typeof prefs.fontStep === "number" ? prefs.fontStep : 0;

  function applyTheme() {
    document.body.classList.toggle("dark", prefs.theme === "dark");
    var b = document.getElementById("themeBtn");
    if (b) b.innerHTML = prefs.theme === "dark" ? "&#9728;" : "&#9789;"; // sun / moon
  }
  function applyFont() {
    var base = 1.25 + fontStep * 0.09;
    base = Math.max(0.95, Math.min(1.9, base));
    document.documentElement.style.setProperty("--fs", base + "rem");
  }
  applyTheme();
  applyFont();

  document.getElementById("themeBtn").addEventListener("click", function () {
    prefs.theme = prefs.theme === "dark" ? "light" : "dark";
    savePrefs(prefs); applyTheme();
  });
  document.getElementById("fontUpBtn").addEventListener("click", function () {
    fontStep = Math.min(7, fontStep + 1); prefs.fontStep = fontStep; savePrefs(prefs); applyFont();
  });
  document.getElementById("fontDownBtn").addEventListener("click", function () {
    fontStep = Math.max(-3, fontStep - 1); prefs.fontStep = fontStep; savePrefs(prefs); applyFont();
  });

  // ---------- Drawer ----------
  var drawer = document.getElementById("drawer");
  var scrim = document.getElementById("scrim");
  function openDrawer() { drawer.classList.add("open"); scrim.classList.add("show"); drawer.setAttribute("aria-hidden", "false"); }
  function closeDrawer() { drawer.classList.remove("open"); scrim.classList.remove("show"); drawer.setAttribute("aria-hidden", "true"); }
  document.getElementById("menuBtn").addEventListener("click", openDrawer);
  scrim.addEventListener("click", closeDrawer);
  document.getElementById("brandBtn").addEventListener("click", function () { location.hash = "#/today"; });

  function buildDrawer() {
    var host = document.getElementById("drawerLibrary");
    var html = '<div class="drawer-cat">📖 గ్రంథాలయం · Library</div>';
    data.categories.forEach(function (cat) {
      html += '<div class="drawer-cat">' + esc(cat.title) + " · " + esc(cat.titleEn) + "</div>";
      cat.items.forEach(function (it) {
        html += '<a class="drawer-link" href="#/read/' + encodeURIComponent(it.id) + '">' + esc(it.title) + "</a>";
      });
    });
    host.innerHTML = html;
    Array.prototype.forEach.call(host.querySelectorAll("a"), function (a) {
      a.addEventListener("click", closeDrawer);
    });
  }

  // ---------- Helpers ----------
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderLinePairs(item) {
    var te = item.telugu || [];
    var en = item.english || [];
    var n = Math.max(te.length, en.length);
    var out = "";
    for (var i = 0; i < n; i++) {
      out += '<div class="linepair">';
      out += '<div class="line-te">' + esc(te[i] || "") + "</div>";
      if (en[i]) out += '<div class="line-en">' + esc(en[i]) + "</div>";
      out += "</div>";
    }
    return out;
  }

  // ---------- Views ----------
  function viewToday() {
    var ids = data.daily && data.daily.length ? data.daily : allItems.map(function (i) { return i.id; });
    var cards = ids.map(function (id, idx) {
      var it = findItem(id);
      if (!it) return "";
      return (
        '<a class="today-card" href="#/read/' + encodeURIComponent(it.id) + '">' +
        '<span class="idx">' + (idx + 1) + "</span>" +
        '<div class="t">' + esc(it.title) + "</div>" +
        '<div class="e">' + esc(it.titleEn || "") + "</div>" +
        "</a>"
      );
    }).join("");

    var today = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
    page.innerHTML =
      '<h1 class="page-title">🌅 ఈరోజు</h1>' +
      '<div class="page-sub">Today · ' + esc(today) + "</div>" +
      (cards || '<p class="note">No daily items set yet.</p>');
    setActive("#/today");
  }

  function viewRead(id) {
    var item = findItem(id);
    if (!item) { page.innerHTML = '<p class="note">Not found.</p>'; return; }

    var idx = allItems.map(function (i) { return i.id; }).indexOf(id);
    var prev = idx > 0 ? allItems[idx - 1] : null;
    var next = idx < allItems.length - 1 ? allItems[idx + 1] : null;

    var meaningHtml = item.meaning
      ? '<div class="meaning"><span class="lbl">భావం · Meaning</span>' + esc(item.meaning) + "</div>"
      : "";

    page.innerHTML =
      '<div class="reading-head">' +
        "<div>" +
          '<div class="reading-title-te">' + esc(item.title) + "</div>" +
          '<div class="reading-title-en">' + esc(item.catTitleEn || "") + (item.titleEn ? " · " + esc(item.titleEn) : "") + "</div>" +
        "</div>" +
      "</div>" +
      (item.note ? '<div class="note">' + esc(item.note) + "</div>" : "") +
      '<div class="verse">' + renderLinePairs(item) + "</div>" +
      meaningHtml +
      '<div class="reader-nav">' +
        (prev ? '<a href="#/read/' + encodeURIComponent(prev.id) + '">◀ ' + esc(prev.title) + "</a>" : '<a class="disabled">◀</a>') +
        (next ? '<a href="#/read/' + encodeURIComponent(next.id) + '">' + esc(next.title) + " ▶</a>" : '<a class="disabled">▶</a>') +
      "</div>";

    setActive("#/read/" + id);
    window.scrollTo(0, 0);
  }

  function setActive(route) {
    Array.prototype.forEach.call(document.querySelectorAll(".drawer-link"), function (a) {
      a.classList.toggle("active", a.getAttribute("href") === route);
    });
  }

  // ---------- Router ----------
  function route() {
    var h = location.hash || "#/today";
    if (h.indexOf("#/read/") === 0) {
      viewRead(decodeURIComponent(h.slice("#/read/".length)));
    } else {
      viewToday();
    }
  }
  window.addEventListener("hashchange", route);

  buildDrawer();
  route();
})();
