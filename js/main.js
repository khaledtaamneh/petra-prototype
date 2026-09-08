(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("#primary-nav");
  var searchOpen = document.querySelectorAll("[data-open-search]");
  var searchDialog = document.querySelector("#search-dialog");
  var searchInput = document.querySelector("#site-search");
  var searchResults = document.querySelector("#search-results");
  var videoOpen = document.querySelectorAll("[data-open-video]");
  var videoDialog = document.querySelector("#video-dialog");
  var facultyGrid = document.querySelector("[data-faculty-grid]");
  var facultyList = document.querySelector("[data-faculty-list]");
  var yearEl = document.querySelector("[data-year]");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  function ownText(el) {
    var text = "";
    for (var node = el.firstChild; node; node = node.nextSibling) {
      if (node.nodeType === 3) text += node.nodeValue;
    }
    return text.replace(/\s+/g, " ").trim();
  }

  function isBlackboxNode(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el === document.documentElement || el === document.body || el === document.head) return false;
    var tag = (el.tagName || "").toLowerCase();
    if (tag === "blackbox-agent" || tag === "blackbox-chat") return true;
    var id = (el.id || "").toLowerCase();
    var cls = (typeof el.className === "string" ? el.className : "").toLowerCase();
    if (id.indexOf("blackbox") !== -1 || cls.indexOf("blackbox") !== -1 || cls.indexOf("bbx-") !== -1) return true;
    var src = (el.getAttribute && (el.getAttribute("src") || el.getAttribute("href"))) || "";
    if (String(src).toLowerCase().indexOf("blackbox") !== -1) return true;
    var text = ownText(el);
    if (text.indexOf("BLACKBOX.AI") !== -1 || text.indexOf("Message Blackbox") !== -1) return true;
    return false;
  }

  function walkAndRemove(root) {
    if (!root || !root.querySelectorAll) return;
    var nodes = root.querySelectorAll("*");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (isBlackboxNode(el)) {
        el.remove();
        continue;
      }
      if (el.shadowRoot) walkAndRemove(el.shadowRoot);
    }
  }

  function removeBlackboxChat() {
    document
      .querySelectorAll(
        'iframe[src*="blackbox"], script[src*="blackbox"], [id*="blackbox" i], [class*="blackbox" i], [class*="bbx-" i], [data-blackbox], blackbox-chat, blackbox-agent'
      )
      .forEach(function (el) {
        el.remove();
      });
    walkAndRemove(document.documentElement);
  }

  removeBlackboxChat();
  window.addEventListener("load", removeBlackboxChat);
  if (window.MutationObserver) {
    new MutationObserver(removeBlackboxChat).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  function openNav() {
    if (!nav || !navToggle) return;
    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      if (open) closeNav();
      else openNav();
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    },
    { passive: true }
  );

  function trapFocus(dialog) {
    var focusable = dialog.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    focusable[0].focus();
  }

  function openDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.body.classList.add("dialog-open");
    trapFocus(dialog);
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
    document.body.classList.remove("dialog-open");
  }

  searchOpen.forEach(function (btn) {
    btn.addEventListener("click", function () {
      closeNav();
      openDialog(searchDialog);
      if (searchInput) searchInput.focus();
    });
  });

  videoOpen.forEach(function (btn) {
    btn.addEventListener("click", function () {
      openDialog(videoDialog);
    });
  });

  document.querySelectorAll("dialog").forEach(function (dialog) {
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeDialog(dialog);
    });
    dialog.querySelectorAll("[data-close-dialog]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        closeDialog(dialog);
      });
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeNav();
  });

  function iconSvg(name) {
    var icons = {
      monitor:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
      gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.7 1 1.2 1.7 1.2H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
      tooth:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 4c2 0 2.5 1.5 4 1.5S14 4 16 4c3 0 4 2.5 4 5 0 5-3 11-5 11-1.2 0-1.5-3-3-3s-1.8 3-3 3c-2 0-5-6-5-11 0-2.5 1-5 4-5z"/></svg>',
      flask:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 3h6M10 3v6L5.5 19a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 9V3"/><path d="M8.5 14h7"/></svg>',
      briefcase:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></svg>',
      scale:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3v18M8 21h8M12 5l-7 8h5l2-8 2 8h5l-7-8"/></svg>',
      building:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 21h16M6 21V8l6-4 6 4v13M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01"/></svg>',
      megaphone:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 10v4a2 2 0 0 0 2 2h1l3 4V6L7 8H6a2 2 0 0 0-2 2z"/><path d="M10 8.5 20 5v14l-10-3.5"/></svg>',
      book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    };
    return icons[name] || icons.book;
  }

  function facultyCard(item) {
    return (
      '<a class="interest-card" href="' +
      item.url +
      '" rel="noopener noreferrer"><h3>' +
      item.title +
      "</h3>" +
      '<span class="interest-card__arrow" aria-hidden="true">→</span></a>'
    );
  }

  var data = window.UOP_DATA;
  if (data && facultyGrid) {
    facultyGrid.innerHTML = data.faculties
      .filter(function (item) {
        return item.home !== false;
      })
      .map(facultyCard)
      .join("");
  }

  if (data && facultyList) {
    facultyList.innerHTML = data.faculties
      .map(function (item) {
        return (
          '<article class="faculty-panel">' +
          '<div class="faculty-panel__icon">' +
          iconSvg(item.icon) +
          "</div>" +
          "<div><h2>" +
          item.title +
          "</h2><p>" +
          item.summary +
          "</p>" +
          '<p class="faculty-panel__meta">' +
          item.countLabel +
          "</p>" +
          '<a class="text-link" href="' +
          item.url +
          '" rel="noopener noreferrer">Visit faculty website →</a></div></article>'
        );
      })
      .join("");
  }

  function runSearch(query) {
    if (!searchResults || !data) return;
    var q = query.trim().toLowerCase();
    if (!q) {
      searchResults.innerHTML =
        "<p class='search-hint'>Search faculties, admissions, campus life, and official services.</p>";
      return;
    }

    var extra = [
      {
        title: "Admissions and Registration",
        url: "admissions.html",
        countLabel: "Internal page",
      },
      {
        title: "Admission requirements",
        url: "https://uop.edu.jo/En/AdmissionsAndRegistration/Pages/AdmissionRequirements.aspx",
        countLabel: "Official page",
      },
      {
        title: "Apply online",
        url: data.applyUrl,
        countLabel: "EduGate",
      },
      {
        title: "Campus life",
        url: "campus-life.html",
        countLabel: "Internal page",
      },
      {
        title: "About University of Petra",
        url: "about.html",
        countLabel: "Internal page",
      },
    ];

    var pool = data.faculties.concat(extra);
    var matches = pool.filter(function (item) {
      return (
        (item.title && item.title.toLowerCase().indexOf(q) !== -1) ||
        (item.summary && item.summary.toLowerCase().indexOf(q) !== -1) ||
        (item.countLabel && item.countLabel.toLowerCase().indexOf(q) !== -1)
      );
    });

    if (!matches.length) {
      searchResults.innerHTML = "<p class='search-hint'>No matching pages. Try a faculty name or “admissions”.</p>";
      return;
    }

    searchResults.innerHTML = matches
      .slice(0, 8)
      .map(function (item) {
        var href = item.url || "#";
        var ext = href.indexOf("http") === 0;
        return (
          '<a href="' +
          href +
          '"' +
          (ext ? ' rel="noopener noreferrer"' : "") +
          "><strong>" +
          item.title +
          "</strong><span>" +
          (item.countLabel || "") +
          "</span></a>"
        );
      })
      .join("");
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      runSearch(searchInput.value);
    });
    runSearch("");
  }
})();
