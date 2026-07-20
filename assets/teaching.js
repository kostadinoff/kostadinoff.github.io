/* ============================================================================
   Teaching materials browser
   ----------------------------------------------------------------------------
   Renders window.TEACHING_DATA (see teaching-data.js) into a
   discipline → language → year → {lecture slides | student handouts} browser
   with search, tag filtering, sorting, and drag-and-drop ordering.

   Everything is derived from the data file, so adding a discipline, a year or
   a single PDF requires no changes here.
   ========================================================================== */

(function () {
  "use strict";

  var DATA = window.TEACHING_DATA;
  var root = document.getElementById("teaching-app");
  if (!DATA || !root) return;

  var GROUPS = [
    { key: "lectures", label: "Lecture slides" },
    { key: "handouts", label: "Student handouts" }
  ];

  var ORDER_STORE = "kk-teaching-order-v1";
  var VIEW_STORE = "kk-teaching-view-v1";
  var ALL_YEARS = "__all__";

  /* The block a file sits in *is* its academic year, so stamp each item with
     its block's label. Nothing in the data file has to repeat it. */
  DATA.disciplines.forEach(function (disc) {
    disc.languages.forEach(function (lang) {
      (lang.years || []).forEach(function (year) {
        ["lectures", "handouts"].forEach(function (g) {
          (year[g] || []).forEach(function (item) {
            item.academicYear = year.academicYear || year.label;
          });
        });
      });
    });
  });

  /* ---------------------------------------------------------------- state */

  var state = {
    discipline: DATA.disciplines[0].id,
    language: null, // resolved per discipline
    academicYear: null, // resolved below
    query: "",
    tags: [], // active tag filters
    sort: "curated", // curated | newest | title
    view: "list", // list | cards — resolved from storage below
    reorder: false
  };

  try {
    var savedView = localStorage.getItem(VIEW_STORE);
    if (savedView === "cards" || savedView === "list") state.view = savedView;
  } catch (e) {
    /* storage unavailable — fall back to the default view */
  }

  var order = readOrder();

  /* ------------------------------------------------------------- helpers */

  function readOrder() {
    try {
      return JSON.parse(localStorage.getItem(ORDER_STORE) || "{}");
    } catch (e) {
      return {};
    }
  }

  function writeOrder() {
    try {
      localStorage.setItem(ORDER_STORE, JSON.stringify(order));
    } catch (e) {
      /* storage unavailable — ordering simply won't persist */
    }
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var COMBINING = new RegExp("[\\u0300-\\u036f]", "g");

  function fold(s) {
    // Case- and diacritic-insensitive key for search (works for Cyrillic too).
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(COMBINING, "");
  }

  function formatDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function getDiscipline(id) {
    return DATA.disciplines.filter(function (d) { return d.id === id; })[0] || DATA.disciplines[0];
  }

  function getLanguage(disc, code) {
    return disc.languages.filter(function (l) { return l.code === code; })[0] || disc.languages[0];
  }

  function collectionKey(discId, langCode, yearId, groupKey) {
    return [discId, langCode, yearId, groupKey].join("/");
  }

  /* Every item gets a stable identity so a saved order survives edits
     elsewhere in the data file. */
  function itemId(item) {
    if (item.files && item.files.length) return item.files[0].href;
    if (item.links && item.links.length) return item.links[0].href;
    return item.title;
  }

  function applyOrder(key, items) {
    var saved = order[key];
    if (!saved || !saved.length) return items.slice();
    var index = {};
    saved.forEach(function (id, i) { index[id] = i; });
    return items.slice().sort(function (a, b) {
      var ia = index[itemId(a)];
      var ib = index[itemId(b)];
      if (ia == null && ib == null) return 0;
      if (ia == null) return 1;   // new items sink to the bottom
      if (ib == null) return -1;
      return ia - ib;
    });
  }

  function sortItems(key, items) {
    if (state.sort === "newest") {
      return items.slice().sort(function (a, b) {
        return String(b.date || "").localeCompare(String(a.date || ""));
      });
    }
    if (state.sort === "title") {
      return items.slice().sort(function (a, b) {
        return String(a.title).localeCompare(String(b.title), undefined, { numeric: true });
      });
    }
    return applyOrder(key, items);
  }

  function matches(item) {
    if (state.academicYear !== ALL_YEARS && item.academicYear !== state.academicYear) {
      return false;
    }
    if (state.tags.length) {
      var itemTags = (item.tags || []).map(fold);
      var all = state.tags.every(function (t) { return itemTags.indexOf(fold(t)) !== -1; });
      if (!all) return false;
    }
    var q = fold(state.query).trim();
    if (!q) return true;
    var haystack = fold(
      [item.title, item.description, (item.tags || []).join(" "), item.version].join(" ")
    );
    return q.split(/\s+/).every(function (term) { return haystack.indexOf(term) !== -1; });
  }

  /* Flatten the whole tree once — used for global search and tag lists. */
  function allItems() {
    var out = [];
    DATA.disciplines.forEach(function (disc) {
      disc.languages.forEach(function (lang) {
        (lang.years || []).forEach(function (year) {
          GROUPS.forEach(function (g) {
            (year[g.key] || []).forEach(function (item) {
              out.push({
                item: item,
                discipline: disc,
                language: lang,
                year: year,
                group: g
              });
            });
          });
        });
      });
    });
    return out;
  }

  var ALL = allItems();

  /* Academic years present in the data, newest first. The page opens on the
     newest one that actually has materials, so it never shows an empty
     "current" year in the weeks before new files are uploaded. */
  var ACADEMIC_YEARS = ALL.map(function (r) { return r.item.academicYear; })
    .filter(function (y, i, a) { return y && a.indexOf(y) === i; })
    .sort()
    .reverse();

  state.academicYear = ACADEMIC_YEARS[0] || ALL_YEARS;

  function inYear(item) {
    return state.academicYear === ALL_YEARS || item.academicYear === state.academicYear;
  }

  function tagsInScope() {
    var scope = (state.query ? ALL : ALL.filter(function (r) {
      return r.discipline.id === state.discipline && r.language.code === currentLangCode();
    })).filter(function (r) { return inYear(r.item); });
    var counts = {};
    scope.forEach(function (r) {
      (r.item.tags || []).forEach(function (t) {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.keys(counts)
      .sort(function (a, b) {
        return counts[b] - counts[a] || a.localeCompare(b);
      })
      .map(function (t) { return { tag: t, count: counts[t] }; });
  }

  function currentLangCode() {
    var disc = getDiscipline(state.discipline);
    return getLanguage(disc, state.language).code;
  }

  /* -------------------------------------------------------------- render */

  /* Titles are written as "<label> · <rest>" — "Class 3 · Demography indices",
     "Домашна 4–5 · Корелация". The list view splits them so the label can sit
     in its own column; anything without a separator keeps its whole title. */
  function splitTitle(title) {
    var i = String(title).indexOf(" · ");
    if (i === -1) return { label: "", rest: title };
    return { label: title.slice(0, i), rest: title.slice(i + 3) };
  }

  function filesHtml(item) {
    return (item.files || [])
      .map(function (f) {
        return (
          '<a class="tm-file" href="' + esc(f.href) + '" target="_blank" rel="noopener">' +
          '<span class="tm-file-kind">' + esc((f.kind || "file").toUpperCase()) + "</span>" +
          esc(f.label) +
          "</a>"
        );
      })
      .join("");
  }

  function linksHtml(item) {
    return (item.links || [])
      .map(function (l) {
        return (
          '<a class="tm-link" href="' + esc(l.href) + '" target="_blank" rel="noopener">' +
          esc(l.label) + " ↗</a>"
        );
      })
      .join("");
  }

  function tagsHtml(item) {
    return (item.tags || [])
      .map(function (t) {
        return '<button type="button" class="tm-tag" data-tag="' + esc(t) + '">' + esc(t) + "</button>";
      })
      .join("");
  }

  function handleHtml() {
    return state.reorder
      ? '<div class="tm-handle" aria-hidden="true">⠿</div>' +
        '<div class="tm-move">' +
        '<button type="button" class="tm-move-btn" data-move="up" aria-label="Move up">↑</button>' +
        '<button type="button" class="tm-move-btn" data-move="down" aria-label="Move down">↓</button>' +
        "</div>"
      : "";
  }

  /* Compact row for the list view: label column, title with its tags, and the
     download on the right. Same classes as a card where the JS hooks need
     them (.tm-card, data-id) so reordering works identically in both views. */
  function itemRow(item) {
    var parts = splitTitle(item.title);

    return (
      '<article class="tm-card tm-row' + (state.reorder ? " tm-card-reorder" : "") + '"' +
      ' data-id="' + esc(itemId(item)) + '"' +
      (state.reorder ? ' draggable="true"' : "") +
      ">" +
      handleHtml() +
      (parts.label ? '<span class="tm-rowlabel">' + esc(parts.label) + "</span>" : "") +
      '<div class="tm-card-body">' +
      '<span class="tm-rowtitle" title="' + esc(item.description || "") + '">' +
      esc(parts.rest) + "</span>" +
      '<span class="tm-rowmeta">' +
      (item.tags || []).map(function (t) {
        return '<button type="button" class="tm-tag" data-tag="' + esc(t) + '">' + esc(t) + "</button>";
      }).join("") +
      (item.date ? '<span class="tm-date">' + esc(formatDate(item.date)) + "</span>" : "") +
      "</span>" +
      "</div>" +
      '<div class="tm-actions">' + filesHtml(item) + linksHtml(item) + "</div>" +
      "</article>"
    );
  }

  function itemCard(item, opts) {
    opts = opts || {};
    var files = filesHtml(item);
    var links = linksHtml(item);
    var tags = tagsHtml(item);

    var breadcrumb = opts.breadcrumb
      ? '<p class="tm-breadcrumb">' + esc(opts.breadcrumb) + "</p>"
      : "";

    var handle = handleHtml();

    return (
      '<article class="tm-card' + (state.reorder ? " tm-card-reorder" : "") + '"' +
      ' data-id="' + esc(itemId(item)) + '"' +
      (state.reorder ? ' draggable="true"' : "") +
      ">" +
      handle +
      '<div class="tm-card-body">' +
      breadcrumb +
      '<h4 class="tm-title">' + esc(item.title) + "</h4>" +
      (item.description ? '<p class="tm-desc">' + esc(item.description) + "</p>" : "") +
      '<p class="tm-meta">' +
      (item.date ? '<span class="tm-date" title="Upload date">' + esc(formatDate(item.date)) + "</span>" : "") +
      (item.version ? '<span class="tm-version" title="Version">v' + esc(item.version) + "</span>" : "") +
      "</p>" +
      (tags ? '<div class="tm-tags">' + tags + "</div>" : "") +
      '<div class="tm-actions">' + files + links + "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function renderControls() {
    var disc = getDiscipline(state.discipline);
    var langCode = currentLangCode();

    var discTabs = DATA.disciplines
      .map(function (d) {
        var count = ALL.filter(function (r) {
          return r.discipline.id === d.id && inYear(r.item);
        }).length;
        return (
          '<button type="button" class="tm-disc' + (d.id === state.discipline ? " is-active" : "") +
          '" data-discipline="' + esc(d.id) + '">' +
          esc(d.title) + '<span class="tm-count">' + count + "</span></button>"
        );
      })
      .join("");

    var langTabs = disc.languages
      .map(function (l) {
        var count = ALL.filter(function (r) {
          return r.discipline.id === disc.id && r.language.code === l.code && inYear(r.item);
        }).length;
        return (
          '<button type="button" class="tm-lang' + (l.code === langCode ? " is-active" : "") +
          '" data-language="' + esc(l.code) + '">' +
          esc(l.label) + '<span class="tm-count">' + count + "</span></button>"
        );
      })
      .join("");

    var chips = tagsInScope()
      .map(function (t) {
        var on = state.tags.indexOf(t.tag) !== -1;
        return (
          '<button type="button" class="tm-chip' + (on ? " is-active" : "") +
          '" data-tag="' + esc(t.tag) + '">' + esc(t.tag) +
          '<span class="tm-count">' + t.count + "</span></button>"
        );
      })
      .join("");

    return (
      '<nav class="tm-disciplines" aria-label="Discipline">' + discTabs + "</nav>" +
      '<div class="tm-toolbar">' +
      '<div class="tm-search">' +
      '<label class="visually-hidden" for="tm-q">Search teaching materials</label>' +
      '<input id="tm-q" type="search" placeholder="Search all materials — title, description, tag…" value="' +
      esc(state.query) + '" autocomplete="off">' +
      "</div>" +
      '<div class="tm-year-filter">' +
      '<label class="visually-hidden" for="tm-ay">Academic year</label>' +
      '<select id="tm-ay" title="Academic year">' +
      ACADEMIC_YEARS.map(function (y) {
        var n = ALL.filter(function (r) { return r.item.academicYear === y; }).length;
        return '<option value="' + esc(y) + '"' + (state.academicYear === y ? " selected" : "") +
          ">" + esc(y) + " (" + n + ")</option>";
      }).join("") +
      '<option value="' + ALL_YEARS + '"' + (state.academicYear === ALL_YEARS ? " selected" : "") +
      ">All years (" + ALL.length + ")</option>" +
      "</select>" +
      "</div>" +
      '<div class="tm-sort">' +
      '<label class="visually-hidden" for="tm-sort">Sort</label>' +
      '<select id="tm-sort">' +
      '<option value="curated"' + (state.sort === "curated" ? " selected" : "") + ">Curated order</option>" +
      '<option value="newest"' + (state.sort === "newest" ? " selected" : "") + ">Newest first</option>" +
      '<option value="title"' + (state.sort === "title" ? " selected" : "") + ">Title (A–Z)</option>" +
      "</select>" +
      "</div>" +
      '<div class="tm-view" role="group" aria-label="View">' +
      '<button type="button" class="tm-btn tm-viewbtn' + (state.view === "list" ? " is-active" : "") +
      '" data-view="list" aria-pressed="' + (state.view === "list") + '">List</button>' +
      '<button type="button" class="tm-btn tm-viewbtn' + (state.view === "cards" ? " is-active" : "") +
      '" data-view="cards" aria-pressed="' + (state.view === "cards") + '">Cards</button>' +
      "</div>" +
      '<button type="button" id="tm-reorder" class="tm-btn' + (state.reorder ? " is-active" : "") + '"' +
      (state.sort !== "curated" ? " disabled" : "") +
      ' title="Drag cards to arrange them in your own order (saved in this browser)">' +
      (state.reorder ? "Done reordering" : "Reorder") +
      "</button>" +
      (Object.keys(order).length
        ? '<button type="button" id="tm-reset" class="tm-btn tm-btn-quiet">Reset order</button>'
        : "") +
      "</div>" +
      '<nav class="tm-languages" aria-label="Language">' + langTabs + "</nav>" +
      (chips ? '<div class="tm-chips">' + chips + "</div>" : "")
    );
  }

  function renderResults() {
    var q = state.query.trim();
    var hits = ALL.filter(function (r) { return matches(r.item); });

    if (q || state.tags.length) {
      var scoped = q
        ? hits
        : hits.filter(function (r) {
            return r.discipline.id === state.discipline && r.language.code === currentLangCode();
          });

      if (!scoped.length) {
        return (
          '<p class="tm-empty">No materials match ' +
          (q ? '“' + esc(q) + "”" : "the selected tags") +
          ". Try a different term, or clear the filters.</p>"
        );
      }

      var cards = scoped
        .map(function (r) {
          return itemCard(r.item, {
            breadcrumb:
              r.discipline.title + " · " + r.language.label + " · " + r.year.label + " · " + r.group.label
          });
        })
        .join("");

      return (
        '<section class="tm-searchresults">' +
        '<h3 class="tm-group-title">' + scoped.length + " result" + (scoped.length === 1 ? "" : "s") +
        (q ? " for “" + esc(q) + "”" : "") + "</h3>" +
        '<div class="tm-grid">' + cards + "</div>" +
        "</section>"
      );
    }

    var disc = getDiscipline(state.discipline);
    var lang = getLanguage(disc, state.language);

    var years = (lang.years || [])
      .filter(function (year) {
        return GROUPS.some(function (g) {
          return (year[g.key] || []).some(inYear);
        });
      })
      .map(function (year) {
        var groups = GROUPS.map(function (g) {
          var key = collectionKey(disc.id, lang.code, year.id, g.key);
          var items = sortItems(key, (year[g.key] || []).filter(inYear));
          var list = state.view === "list";
          var body = items.length
            ? '<div class="tm-grid' + (list ? " tm-list" : "") + '" data-collection="' + esc(key) + '">' +
              items.map(function (i) { return list ? itemRow(i) : itemCard(i); }).join("") +
              "</div>"
            : '<p class="tm-empty tm-empty-small">Nothing here yet.</p>';

          return (
            '<section class="tm-group tm-group-' + g.key + '">' +
            '<h4 class="tm-group-title">' + esc(g.label) +
            '<span class="tm-count">' + items.length + "</span></h4>" +
            body +
            "</section>"
          );
        }).join("");

        return (
          '<section class="tm-year" id="' + esc(disc.id + "-" + lang.code + "-" + year.id) + '">' +
          '<h3 class="tm-year-title">' + esc(year.label) + "</h3>" +
          (year.note ? '<p class="tm-year-note">' + esc(year.note) + "</p>" : "") +
          groups +
          "</section>"
        );
      })
      .join("");

    var archiveNote =
      state.academicYear !== ALL_YEARS && state.academicYear !== DATA.currentAcademicYear
        ? '<p class="tm-archive">You are viewing the <strong>' + esc(state.academicYear) +
          "</strong> archive. Materials for " + esc(DATA.currentAcademicYear) +
          " appear here as they are prepared.</p>"
        : "";

    var empty =
      '<p class="tm-empty">Nothing published for ' +
      (state.academicYear === ALL_YEARS ? "this language" : esc(state.academicYear) + " in this language") +
      " yet.</p>";

    return (
      '<p class="tm-blurb">' + esc(disc.blurb) + "</p>" +
      archiveNote +
      (years || empty)
    );
  }

  function render() {
    var disc = getDiscipline(state.discipline);
    if (!state.language || !disc.languages.some(function (l) { return l.code === state.language; })) {
      state.language = disc.languages[0].code;
    }
    root.innerHTML =
      '<div class="tm-controls">' + renderControls() + "</div>" +
      '<div class="tm-results">' + renderResults() + "</div>";
    bindResults();
  }

  /* --------------------------------------------------------------- events */

  root.addEventListener("click", function (e) {
    var t = e.target.closest("[data-discipline], [data-language], [data-view], .tm-chip, .tm-tag, #tm-reorder, #tm-reset, .tm-move-btn");
    if (!t) return;

    if (t.dataset.view) {
      state.view = t.dataset.view;
      try { localStorage.setItem(VIEW_STORE, state.view); } catch (err) {}
      return render();
    }

    if (t.dataset.discipline) {
      state.discipline = t.dataset.discipline;
      state.language = null;
      state.tags = [];
      state.reorder = false;
      return render();
    }
    if (t.dataset.language) {
      state.language = t.dataset.language;
      state.tags = [];
      state.reorder = false;
      return render();
    }
    if (t.id === "tm-reorder") {
      state.reorder = !state.reorder;
      return render();
    }
    if (t.id === "tm-reset") {
      order = {};
      writeOrder();
      return render();
    }
    if (t.classList.contains("tm-move-btn")) {
      return moveCard(t.closest(".tm-card"), t.dataset.move === "up" ? -1 : 1);
    }
    if (t.classList.contains("tm-chip") || t.classList.contains("tm-tag")) {
      var tag = t.dataset.tag;
      var i = state.tags.indexOf(tag);
      if (i === -1) state.tags.push(tag);
      else state.tags.splice(i, 1);
      return render();
    }
  });

  root.addEventListener("input", function (e) {
    if (e.target.id === "tm-q") {
      state.query = e.target.value;
      var results = root.querySelector(".tm-results");
      results.innerHTML = renderResults();
      // Refresh the chips (their scope changes with the query) without
      // stealing focus from the search box.
      var chips = root.querySelector(".tm-chips");
      var html = tagsInScope()
        .map(function (tg) {
          var on = state.tags.indexOf(tg.tag) !== -1;
          return (
            '<button type="button" class="tm-chip' + (on ? " is-active" : "") +
            '" data-tag="' + esc(tg.tag) + '">' + esc(tg.tag) +
            '<span class="tm-count">' + tg.count + "</span></button>"
          );
        })
        .join("");
      if (chips) chips.innerHTML = html;
      bindResults();
    }
  });

  root.addEventListener("change", function (e) {
    if (e.target.id === "tm-ay") {
      state.academicYear = e.target.value;
      state.tags = [];
      state.reorder = false;
      render();
    }
    if (e.target.id === "tm-sort") {
      state.sort = e.target.value;
      if (state.sort !== "curated") state.reorder = false;
      render();
    }
  });

  /* ------------------------------------------------------ drag and drop */

  var dragged = null;

  function bindResults() {
    if (!state.reorder) return;
    root.querySelectorAll(".tm-grid[data-collection]").forEach(function (grid) {
      grid.addEventListener("dragstart", onDragStart);
      grid.addEventListener("dragover", onDragOver);
      grid.addEventListener("drop", onDrop);
      grid.addEventListener("dragend", onDragEnd);
    });
  }

  function onDragStart(e) {
    var card = e.target.closest(".tm-card");
    if (!card) return;
    dragged = card;
    card.classList.add("is-dragging");
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", card.dataset.id); } catch (err) {}
  }

  function onDragOver(e) {
    if (!dragged) return;
    var grid = e.currentTarget;
    if (dragged.parentNode !== grid) return; // ordering stays inside a collection
    e.preventDefault();
    var target = e.target.closest(".tm-card");
    if (!target || target === dragged) return;
    var rect = target.getBoundingClientRect();
    var after = e.clientY - rect.top > rect.height / 2;
    grid.insertBefore(dragged, after ? target.nextSibling : target);
  }

  function onDrop(e) {
    e.preventDefault();
    persist(e.currentTarget);
  }

  function onDragEnd() {
    if (dragged) dragged.classList.remove("is-dragging");
    dragged = null;
  }

  function moveCard(card, delta) {
    var grid = card.parentNode;
    if (delta < 0 && card.previousElementSibling) {
      grid.insertBefore(card, card.previousElementSibling);
    } else if (delta > 0 && card.nextElementSibling) {
      grid.insertBefore(card.nextElementSibling, card);
    } else {
      return;
    }
    persist(grid);
    var btn = card.querySelector('.tm-move-btn[data-move="' + (delta < 0 ? "up" : "down") + '"]');
    if (btn) btn.focus();
  }

  function persist(grid) {
    var key = grid.dataset.collection;
    if (!key) return;
    order[key] = Array.prototype.map.call(grid.querySelectorAll(".tm-card"), function (c) {
      return c.dataset.id;
    });
    writeOrder();
  }

  /* ------------------------------------------------------------- notebooks */

  var nbRoot = document.getElementById("teaching-notebooks");
  if (nbRoot && DATA.notebooks) {
    nbRoot.innerHTML = DATA.notebooks
      .map(function (n) {
        return (
          '<a class="tm-notebook" href="' + esc(n.href) + '" target="_blank" rel="noopener">' +
          '<span class="tm-file-kind">AI</span>' + esc(n.title) + "</a>"
        );
      })
      .join("");
  }

  render();
})();
