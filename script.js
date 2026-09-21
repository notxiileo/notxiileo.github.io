var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- scroll progress bar ---------------- */
(function () {
  var bar = document.getElementById("scrollProgress");
  if (!bar) return;
  var fill = bar.querySelector("span");

  function update() {
    var h = document.documentElement;
    var scrollable = h.scrollHeight - h.clientHeight;
    var pct = scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0;
    fill.style.width = pct + "%";
  }
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
})();

/* ---------------- matrix rain ---------------- */
(function () {
  var canvas = document.getElementById("rain");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var chars = "01アイウエオカキクケコサシスセソタチツテト";
  var fontSize = 15;
  var columns, drops;

  function size() {
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(0).map(function () {
      return Math.floor(Math.random() * -40);
    });
  }
  size();
  window.addEventListener("resize", size);

  if (reduceMotion) {
    ctx.fillStyle = "#050805";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + "px monospace";
    for (var i = 0; i < columns; i++) {
      ctx.fillStyle = "rgba(61,255,122,0.25)";
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, Math.random() * canvas.height);
    }
    return;
  }

  function draw() {
    ctx.fillStyle = "rgba(5,8,5,0.14)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + "px monospace";
    for (var i = 0; i < drops.length; i++) {
      var char = chars[Math.floor(Math.random() * chars.length)];
      var x = i * fontSize;
      var y = drops[i] * fontSize;
      ctx.fillStyle = Math.random() > 0.94 ? "#bfffd6" : "rgba(61,255,122,0.55)";
      ctx.fillText(char, x, y);
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* ---------------- boot loader (index.html only) ---------------- */
(function () {
  var loader = document.getElementById("loader");
  var statusEl = document.getElementById("loaderStatus");
  var typedEl = statusEl ? statusEl.querySelector(".typed") : null;
  var fill = document.getElementById("loaderFill");
  var pctEl = document.getElementById("loaderPct");
  var heroContent = document.getElementById("heroContent");
  if (!loader || !fill || !pctEl || !heroContent) return;

  function reveal() {
    loader.classList.add("is-done");
    heroContent.classList.add("is-visible");
  }

  if (reduceMotion) {
    reveal();
    return;
  }

  var messages = ["booting notxiileo.dev", "compiling scene graph", "ready"];
  var msgIndex = 0;
  var duration = 1600;
  var start = null;

  function typeMessage(text, onDone) {
    var pos = 0;
    typedEl.textContent = "";
    var iv = setInterval(function () {
      pos++;
      typedEl.textContent = text.slice(0, pos);
      if (pos >= text.length) {
        clearInterval(iv);
        if (onDone) setTimeout(onDone, 260);
      }
    }, 28);
  }

  function nextMessage() {
    if (msgIndex >= messages.length) return;
    typeMessage(messages[msgIndex], function () {
      msgIndex++;
      if (msgIndex < messages.length) nextMessage();
    });
  }
  nextMessage();

  function step(ts) {
    if (!start) start = ts;
    var progress = Math.min((ts - start) / duration, 1);
    var pct = Math.round(progress * 100);
    fill.style.width = pct + "%";
    pctEl.textContent = pct;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      setTimeout(reveal, 260);
    }
  }
  requestAnimationFrame(step);
})();

/* ---------------- periodic auto-glitch pulse ---------------- */
(function () {
  var target = document.getElementById("heroGlitch");
  if (!target || reduceMotion) return;
  setInterval(function () {
    target.classList.add("auto-glitch");
    setTimeout(function () { target.classList.remove("auto-glitch"); }, 340);
  }, 4200);
})();

/* ---------------- count-up stats ---------------- */
(function () {
  var stats = document.querySelectorAll(".stat-num");
  if (!stats.length) return;

  function animate(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }
    var start = null;
    var duration = 1100;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  stats.forEach(function (el) { observer.observe(el); });
})();

/* ---------------- reveal on scroll ---------------- */
(function () {
  var targets = document.querySelectorAll(".skill-card, .project, .contact-panel, .gallery-item, .feature-card, .commission-panel");
  if (!targets.length) return;
  targets.forEach(function (el) { el.classList.add("reveal"); });

  if (reduceMotion) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, idx) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add("is-visible");
        }, idx * 40);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(function (el) { observer.observe(el); });
})();

/* ---------------- timeline: rail fill + dot activation ---------------- */
(function () {
  var timeline = document.querySelector(".timeline");
  var rail = document.getElementById("railFill");
  var entries = document.querySelectorAll(".timeline-entry");
  if (!timeline || !rail || !entries.length) return;

  function updateRail() {
    var rect = timeline.getBoundingClientRect();
    var viewportMid = window.innerHeight * 0.5;
    var total = rect.height;
    var progressed = viewportMid - rect.top;
    var pct = Math.max(0, Math.min(1, progressed / total));
    rail.style.height = (pct * 100) + "%";
  }
  updateRail();
  window.addEventListener("scroll", updateRail, { passive: true });
  window.addEventListener("resize", updateRail);

  var dotObserver = new IntersectionObserver(function (obsEntries) {
    obsEntries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.35 });
  entries.forEach(function (el) { dotObserver.observe(el); });
})();

/* ---------------- cursor glow ---------------- */
(function () {
  var glow = document.getElementById("cursorGlow");
  if (!glow) return;
  var hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (!hasFinePointer) return;

  window.addEventListener("pointermove", function (e) {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
    glow.classList.add("is-active");
  });
  window.addEventListener("pointerleave", function () {
    glow.classList.remove("is-active");
  });
})();

/* ---------------- magnetic buttons ---------------- */
(function () {
  var hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (!hasFinePointer || reduceMotion) return;
  var buttons = document.querySelectorAll(".magnetic");
  buttons.forEach(function (btn) {
    btn.addEventListener("mousemove", function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = "translate(" + (x * 0.18) + "px, " + (y * 0.28) + "px)";
    });
    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "translate(0, 0)";
    });
  });
})();

/* ---------------- tilt cards (skill/feature/commission — subtle 3D follow) ---------------- */
(function () {
  var hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (!hasFinePointer || reduceMotion) return;
  var els = document.querySelectorAll(".tilt");
  els.forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = "perspective(800px) rotateX(" + (-y * 7) + "deg) rotateY(" + (x * 7) + "deg) translateY(-6px)";
    });
    el.addEventListener("mouseleave", function () {
      el.style.transform = "";
    });
  });
})();

/* ---------------- media lightbox (gallery-item + media-thumb, grouped, prev/next, video) ---------------- */
(function () {
  var lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  var imgEl = document.getElementById("lightboxImg");
  var videoEl = document.getElementById("lightboxVideo");
  var titleEl = document.getElementById("lightboxTitle");
  var descEl = document.getElementById("lightboxDesc");
  var closeBtn = document.getElementById("lightboxClose");
  var prevBtn = document.getElementById("lightboxPrev");
  var nextBtn = document.getElementById("lightboxNext");

  // Collect every openable item, grouped by data-group (falls back to a
  // single shared group so ungrouped items still get prev/next).
  var allItems = Array.prototype.slice.call(document.querySelectorAll(".media-thumb, .gallery-item"));
  if (!allItems.length) return;

  var groups = {};
  allItems.forEach(function (item) {
    var filmstrip = item.closest("[data-group]");
    var group = filmstrip ? filmstrip.getAttribute("data-group") : "default";
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
  });

  var currentGroup = [];
  var currentIndex = 0;

  function itemData(item) {
    return {
      type: item.getAttribute("data-type") || "image",
      src: item.getAttribute("data-src") || item.getAttribute("data-full") || item.querySelector("img").src,
      poster: item.getAttribute("data-poster") || "",
      title: item.getAttribute("data-title") || "",
      desc: item.getAttribute("data-desc") || ""
    };
  }

  function show(index) {
    currentIndex = (index + currentGroup.length) % currentGroup.length;
    var data = itemData(currentGroup[currentIndex]);

    if (data.type === "video") {
      videoEl.pause();
      videoEl.src = data.src;
      if (data.poster) videoEl.poster = data.poster;
      videoEl.hidden = false;
      imgEl.hidden = true;
    } else {
      imgEl.src = data.src;
      imgEl.alt = data.title;
      imgEl.hidden = false;
      videoEl.hidden = true;
      videoEl.pause();
      videoEl.src = "";
    }
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;

    var multiple = currentGroup.length > 1;
    prevBtn.hidden = !multiple;
    nextBtn.hidden = !multiple;
  }

  function openAt(group, index) {
    currentGroup = groups[group] || [];
    if (!currentGroup.length) return;
    show(index || 0);

    lightbox.hidden = false;
    requestAnimationFrame(function () { lightbox.classList.add("is-open"); });
    closeBtn.focus();
    document.body.style.overflow = "hidden";
  }

  function open(item) {
    var filmstrip = item.closest("[data-group]");
    var group = filmstrip ? filmstrip.getAttribute("data-group") : "default";
    var list = groups[group] || [item];
    var index = list.indexOf(item);
    openAt(group, index < 0 ? 0 : index);
  }

  function close() {
    lightbox.classList.remove("is-open");
    videoEl.pause();
    setTimeout(function () {
      lightbox.hidden = true;
      imgEl.src = "";
      videoEl.src = "";
    }, reduceMotion ? 0 : 220);
    document.body.style.overflow = "";
  }

  allItems.forEach(function (item) {
    item.addEventListener("click", function () { open(item); });
  });

  // "view full gallery" pills on each timeline entry jump straight into
  // that project's set, starting from its first item.
  document.querySelectorAll(".gallery-cta[data-group]").forEach(function (cta) {
    cta.addEventListener("click", function () {
      openAt(cta.getAttribute("data-group"), 0);
    });
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", function () { show(currentIndex - 1); });
  nextBtn.addEventListener("click", function () { show(currentIndex + 1); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(currentIndex - 1);
    if (e.key === "ArrowRight") show(currentIndex + 1);
  });
})();

/* ---------------- smooth in-page nav ---------------- */
(function () {
  var header = document.querySelector(".site-nav");
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href").slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var headerHeight = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      history.pushState(null, "", "#" + id);
    });
  });
})();
