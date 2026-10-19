(() => {
  document.querySelectorAll("[data-rotating-text]").forEach((node) => {
    const values = node.dataset.rotatingText.split("|");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0;
    const value = node.querySelector(".p-rotating-text-value");
    const render = (text) => {
      value.replaceChildren(...Array.from(text, (character, characterIndex) => {
        const span = document.createElement("span");
        span.className = "p-static-text-character";
        span.style.setProperty("--character-delay", reduceMotion ? "0ms" : `${characterIndex * 14}ms`);
        span.textContent = character === " " ? "\u00a0" : character;
        return span;
      }));
      requestAnimationFrame(() => {
        node.style.width = `${value.getBoundingClientRect().width}px`;
      });
    };
    if (!value) return;
    render(values[0]);
    if (values.length < 2 || reduceMotion) return;
    window.setInterval(() => {
      index = (index + 1) % values.length;
      render(values[index]);
    }, 2600);
  });
  const pixelCards = document.querySelectorAll(".p-profile-card");
  pixelCards.forEach((card) => {
    const canvas = document.createElement("canvas");
    canvas.className = "pixel-card-canvas";
    canvas.setAttribute("aria-hidden", "true");
    card.prepend(canvas);
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const state = { width: 0, height: 0, ratio: 1, cells: [], active: false, visible: false, raf: 0, last: 0, changedAt: 0, originX: 0, originY: 0, pointerX: 0, pointerY: 0, palette: [] };
    const mixColor = (hex, amount, toWhite) => {
      const value = hex.replace("#", "");
      const rgb = value.length === 3 ? value.split("").map((part) => parseInt(part + part, 16)) : [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
      return `rgb(${rgb.map((part) => Math.round(part + ((toWhite ? 255 : 0) - part) * amount)).join(",")})`;
    };
    const setPalette = () => {
      const tint = getComputedStyle(card).getPropertyValue("--profile-tint").trim() || "#7359d9";
      state.palette = [mixColor(tint, 0.58, true), tint, mixColor(tint, 0.2, false)];
    };
    const build = () => {
      const rect = card.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      if (width === state.width && height === state.height && ratio === state.ratio) return;
      state.width = width; state.height = height; state.ratio = ratio;
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      const gap = 8; const columns = Math.floor((width - 1) / gap) + 1; const rows = Math.floor((height - 1) / gap) + 1;
      state.cells = [];
      for (let column = 0; column < columns; column++) for (let row = 0; row < rows; row++) {
        const x = (width - (columns - 1) * gap) / 2 + column * gap;
        const y = (height - (rows - 1) * gap) / 2 + row * gap;
        state.cells.push({ x, y, size: 0.65 + Math.random() * 1.3, tint: Math.floor(Math.random() * 3), phase: Math.random() * Math.PI * 2, jitter: Math.random(), presence: 0, delay: 0 });
      }
    };
    const wake = () => { if (!state.raf && state.visible && !reduceMotion.matches) state.raf = requestAnimationFrame(draw); };
    const activate = (event) => {
      const rect = card.getBoundingClientRect();
      state.originX = event?.clientX ? event.clientX - rect.left : state.width / 2;
      state.originY = event?.clientY ? event.clientY - rect.top : state.height / 2;
      state.pointerX = state.originX; state.pointerY = state.originY;
      state.active = true; state.changedAt = performance.now(); card.dataset.pixelActive = "true";
      const far = Math.hypot(state.width, state.height) || 1;
      state.cells.forEach((cell) => { cell.delay = Math.hypot(cell.x - state.originX, cell.y - state.originY) / far * 440 + cell.jitter * 80; });
      if (reduceMotion.matches) drawStatic(); else wake();
    };
    const deactivate = () => { state.active = false; state.changedAt = performance.now(); delete card.dataset.pixelActive; if (reduceMotion.matches) drawStatic(); else wake(); };
    const drawStatic = () => {
      context.setTransform(state.ratio, 0, 0, state.ratio, 0, 0); context.clearRect(0, 0, state.width, state.height);
      if (state.active) state.cells.forEach((cell) => { context.fillStyle = state.palette[cell.tint]; context.globalAlpha = .7; context.fillRect(cell.x - cell.size / 2, cell.y - cell.size / 2, cell.size, cell.size); });
      context.globalAlpha = 1;
    };
    function draw(now = performance.now()) {
      state.raf = 0;
      if (!state.visible) return;
      const dt = state.last ? Math.min(.05, (now - state.last) / 1000) : 1 / 60; state.last = now;
      context.setTransform(state.ratio, 0, 0, state.ratio, 0, 0); context.clearRect(0, 0, state.width, state.height);
      const elapsed = now - state.changedAt; let remaining = false;
      state.cells.forEach((cell) => {
        const ready = elapsed >= cell.delay;
        const target = state.active && ready ? 1 : 0;
        const step = dt / (target ? .22 : .18);
        cell.presence = target > cell.presence ? Math.min(target, cell.presence + step) : Math.max(target, cell.presence - step);
        if (cell.presence > .002) {
          remaining = true;
          const wave = reduceMotion.matches ? 0 : Math.sin(now / 1000 * 2.2 + cell.phase) * .1;
          const spot = state.active ? Math.max(0, 1 - Math.hypot(cell.x - state.pointerX, cell.y - state.pointerY) / Math.max(state.width, state.height) * 1.8) : 0;
          context.fillStyle = state.palette[cell.tint]; context.globalAlpha = Math.min(.9, (.45 + cell.presence * .48 + wave + spot * .18) * cell.presence);
          const size = cell.size * (1 + spot * .65);
          context.fillRect(cell.x - size / 2, cell.y - size / 2, size, size);
        }
      });
      context.globalAlpha = 1;
      if (state.active || remaining) state.raf = requestAnimationFrame(draw); else state.last = 0;
    }
    const onMove = (event) => { const rect = card.getBoundingClientRect(); state.pointerX = event.clientX - rect.left; state.pointerY = event.clientY - rect.top; wake(); };
    const onEnter = (event) => { if (event.pointerType !== "touch") activate(event); };
    const onLeave = () => { if (!card.matches(":focus-visible")) deactivate(); };
    const onFocus = () => activate();
    const onBlur = (event) => { if (!card.contains(event.relatedTarget) && !card.matches(":hover")) deactivate(); };
    const onDown = (event) => { if (event.pointerType === "touch") activate(event); };
    const onMotionChange = (event) => {
      if (event.matches) { cancelAnimationFrame(state.raf); state.raf = 0; state.last = 0; drawStatic(); }
      else wake();
    };
    card.addEventListener("pointerenter", onEnter); card.addEventListener("pointermove", onMove); card.addEventListener("pointerleave", onLeave);
    card.addEventListener("pointerdown", onDown); card.addEventListener("focus", onFocus); card.addEventListener("blur", onBlur);
    setPalette(); build();
    const resizeObserver = new ResizeObserver(() => { build(); if (state.active) wake(); }); resizeObserver.observe(card);
    const visibility = new IntersectionObserver((entries) => { state.visible = entries.some((entry) => entry.isIntersecting); if (!state.visible && state.raf) { cancelAnimationFrame(state.raf); state.raf = 0; } else if (state.active) wake(); });
    visibility.observe(card);
    const themeObserver = new MutationObserver(setPalette); themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const cleanup = () => {
      cancelAnimationFrame(state.raf); resizeObserver.disconnect(); visibility.disconnect(); themeObserver.disconnect();
      card.removeEventListener("pointerenter", onEnter); card.removeEventListener("pointermove", onMove); card.removeEventListener("pointerleave", onLeave);
      card.removeEventListener("pointerdown", onDown); card.removeEventListener("focus", onFocus); card.removeEventListener("blur", onBlur);
      reduceMotion.removeEventListener("change", onMotionChange);
      window.removeEventListener("pagehide", cleanup);
    };
    reduceMotion.addEventListener("change", onMotionChange);
    window.addEventListener("pagehide", cleanup, { once: true });
  });
  const focusSection = document.querySelector(".p-capabilities");
  const focusCards = Array.from(focusSection?.querySelectorAll(".p-skill-feature, .p-expertise-card") || []).slice(0, 7);
  const focusStage = focusSection?.querySelector(".p-expertise");
  if (focusSection && focusStage && focusCards.length) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactView = window.matchMedia("(max-width: 850px)");
    let scanIndex = 0;
    let direction = 1;
    let engagedIndex = null;
    let scanTimer = 0;
    let viewportFrame = 0;
    let paintedIndex = -1;
    const scanFrame = document.createElement("span");
    scanFrame.className = "p-focus-scan-frame";
    scanFrame.setAttribute("aria-hidden", "true");
    scanFrame.innerHTML = "<i></i><i></i><i></i><i></i>";
    focusStage.append(scanFrame);
    const paintFocus = (force = false) => {
      const activeIndex = engagedIndex ?? scanIndex;
      if (!force && paintedIndex === activeIndex) return;
      paintedIndex = activeIndex;
      focusCards.forEach((card, index) => {
        card.classList.toggle("is-focus-active", index === activeIndex);
        card.classList.toggle("is-focus-muted", index !== activeIndex);
      });
      const cardRect = focusCards[activeIndex].getBoundingClientRect();
      const stageRect = focusStage.getBoundingClientRect();
      const gap = Number.parseFloat(getComputedStyle(focusStage).getPropertyValue("--focus-frame-gap")) || 8;
      scanFrame.style.width = `${cardRect.width + gap * 2}px`;
      scanFrame.style.height = `${cardRect.height + gap * 2}px`;
      scanFrame.style.transform = `translate3d(${cardRect.left - stageRect.left - gap}px, ${cardRect.top - stageRect.top - gap}px, 0)`;
    };
    const advanceFocus = () => {
      if (engagedIndex !== null || focusCards.length < 2) return;
      scanIndex += direction;
      if (scanIndex >= focusCards.length - 1 || scanIndex <= 0) direction *= -1;
      paintFocus();
    };
    const syncViewportFocus = () => {
      viewportFrame = 0;
      if (!compactView.matches) return;
      const focusLine = window.innerHeight * .48;
      const currentRect = engagedIndex === null ? null : focusCards[engagedIndex]?.getBoundingClientRect();
      // Keep the current card while it still occupies the focus line. This
      // deadband prevents neighboring cards from trading focus near a boundary.
      if (currentRect && currentRect.top <= focusLine && currentRect.bottom >= focusLine) return;
      let nearestIndex = -1;
      let nearestDistance = Infinity;
      let containingIndex = -1;
      let containingDistance = Infinity;
      focusCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
        if (rect.top <= focusLine && rect.bottom >= focusLine) {
          const centerDistance = Math.abs((rect.top + rect.bottom) / 2 - focusLine);
          if (centerDistance < containingDistance) { containingDistance = centerDistance; containingIndex = index; }
        }
        const distance = focusLine < rect.top ? rect.top - focusLine : focusLine > rect.bottom ? focusLine - rect.bottom : 0;
        if (distance < nearestDistance) { nearestDistance = distance; nearestIndex = index; }
      });
      const nextIndex = containingIndex >= 0 ? containingIndex : nearestIndex;
      if (nextIndex >= 0 && nextIndex !== engagedIndex) { engagedIndex = nextIndex; paintFocus(); }
    };
    const scheduleViewportFocus = () => {
      if (!compactView.matches || viewportFrame) return;
      viewportFrame = requestAnimationFrame(syncViewportFocus);
    };
    focusCards.forEach((card, index) => {
      card.classList.add("p-focus-card");
      card.addEventListener("pointerenter", () => { if (!compactView.matches) { engagedIndex = index; paintFocus(); } });
      card.addEventListener("pointerleave", () => {
        if (!compactView.matches && engagedIndex === index && !card.matches(":focus-within")) { engagedIndex = null; paintFocus(); }
      });
      card.addEventListener("focusin", () => { engagedIndex = index; paintFocus(); });
      card.addEventListener("focusout", (event) => {
        if (engagedIndex === index && !card.contains(event.relatedTarget)) {
          engagedIndex = null;
          if (compactView.matches) scheduleViewportFocus();
          else paintFocus();
        }
      });
    });
    paintFocus();
    const focusResizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => paintFocus(true)) : null;
    focusResizeObserver?.observe(focusStage);
    focusCards.forEach((card) => focusResizeObserver?.observe(card));
    const syncScanMode = () => {
      window.clearInterval(scanTimer);
      scanTimer = 0;
      if (compactView.matches) { engagedIndex = null; scheduleViewportFocus(); }
      else {
        engagedIndex = null;
        paintFocus();
        if (!reducedMotion.matches) scanTimer = window.setInterval(advanceFocus, 1900);
      }
    };
    if (compactView.matches) syncViewportFocus();
    else if (!reducedMotion.matches) scanTimer = window.setInterval(advanceFocus, 1900);
    const onViewportChange = () => syncScanMode();
    window.addEventListener("scroll", scheduleViewportFocus, { passive: true });
    window.addEventListener("resize", scheduleViewportFocus, { passive: true });
    compactView.addEventListener("change", onViewportChange);
    reducedMotion.addEventListener("change", (event) => {
      window.clearInterval(scanTimer);
      scanTimer = event.matches || compactView.matches ? 0 : window.setInterval(advanceFocus, 1900);
      if (compactView.matches) scheduleViewportFocus();
      else paintFocus();
    });
    window.addEventListener("pagehide", () => {
      window.clearInterval(scanTimer);
      window.cancelAnimationFrame(viewportFrame);
      window.removeEventListener("scroll", scheduleViewportFocus);
      window.removeEventListener("resize", scheduleViewportFocus);
      compactView.removeEventListener("change", onViewportChange);
      focusResizeObserver?.disconnect();
      scanFrame.remove();
    }, { once: true });
  }
  if (window.Lenis) {
    const lenis = new window.Lenis({ lerp: 0.1, duration: 1.2, wheelMultiplier: 1, syncTouch: false, anchors: true, autoRaf: false, respectReducedMotion: true });
    window.portfolioLenis = lenis;
    let rafId = 0;
    let disposed = false;
    const frame = (time) => {
      if (disposed || document.hidden || lenis.isStopped) { rafId = 0; return; }
      lenis.raf(time);
      rafId = lenis.isScrolling === "smooth" ? requestAnimationFrame(frame) : 0;
    };
    const wake = () => {
      if (!rafId && !disposed && !document.hidden && !lenis.isStopped) {
        // Lenis integrates elapsed frame time. Rebase its clock after idle so
        // the first frame cannot apply the entire sleep interval as one step.
        lenis.time = performance.now();
        rafId = requestAnimationFrame(frame);
      }
    };
    const onScroll = () => {
      window.ScrollTrigger?.update?.();
      if (lenis.isScrolling === "smooth") wake();
    };
    const onVirtualScroll = () => wake();
    const onAnchorIntent = (event) => {
      if (event.target instanceof Element && event.target.closest('a[href^="#"]')) wake();
    };
    const onLock = (event) => {
      if (event.detail) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
        lenis.stop();
      } else lenis.start();
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      } else wake();
    };
    lenis.on("scroll", onScroll);
    lenis.on("virtual-scroll", onVirtualScroll);
    window.addEventListener("portfolio:lenis-lock", onLock);
    document.addEventListener("click", onAnchorIntent, true);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.portfolioLenisWake = wake;
    window.addEventListener("pagehide", () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("portfolio:lenis-lock", onLock);
      document.removeEventListener("click", onAnchorIntent, true);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      lenis.off("scroll", onScroll);
      lenis.off("virtual-scroll", onVirtualScroll);
      lenis.destroy();
      delete window.portfolioLenis;
      delete window.portfolioLenisWake;
    }, { once: true });
  }
  document.querySelector(".p-footer-top")?.addEventListener("click", (event) => {
    const lenis = window.portfolioLenis;
    if (!lenis) return;
    event.preventDefault();
    event.stopPropagation();
    const compactViewport = window.matchMedia("(max-width: 850px)").matches;
    if (lenis.isStopped) lenis.start();
    else if (!compactViewport) lenis.reset();
    lenis.scrollTo(0, {
      duration: 2.1,
      force: compactViewport,
      easing: (progress) => progress * progress * progress * (progress * (progress * 6 - 15) + 10),
    });
    window.portfolioLenisWake?.();
  });

  const projects = window.PORTFOLIO_PROJECTS || [];
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[char]);
  const artFor = (project) => {
    if (project.art === "codesentry") return '<div class="p-code-art"><span>STATIC ANALYSIS / AI-ASSISTED SECURITY</span><b><span>FIND THE</span><i>WEAK POINTS.</i></b><div class="p-code-flow"><i>ZIP</i><i>RULES</i><i>REPORT</i></div></div>';
    if (project.art === "nourish") return '<div class="p-nourish-art"><div class="p-nourish-stamp"><span>GOOD FOOD.</span><i>SHARED<br>BETTER.</i></div><div class="p-nourish-arc"></div><span>COMMUNITY / FOOD SHARING</span></div>';
    if (project.art === "lens") return '<div class="p-lens-art"><div class="p-lens-sheet"><span>RESUME / JOB ALIGNMENT</span><svg class="p-lens-scan" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path d="M5 13V5h8M27 35h8v-8"/></svg><b><span>MAKE EXPERIENCE</span><i>COUNT.</i></b><div class="p-lens-lines"><i></i><i></i><i></i><i></i></div><span class="p-lens-score">SKILL MATCH <b>AI</b></span></div></div>';
    if (project.art === "vox") return `<div class="p-vox-art"><span>VOICE / CONTEXT / RESPONSE</span><div class="p-wave">${Array.from({length:37},(_,i)=>`<i style="height:${18+Math.abs(Math.sin(i*1.73))*(i%4===0?65:38)}%"></i>`).join("")}</div><b><span>CONVERSATIONS</span><em>THAT CONTINUE.</em></b><small>STREAM · FAILOVER · REMEMBER</small></div>`;
    if (project.art === "florentix") return '<div class="p-florentix-art"><span>PLANT HEALTH / HYBRID AI</span><b><span>HELP PLANTS</span><i>THRIVE.</i></b><svg class="p-leaf-orbit" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle class="p-leaf-frame" cx="50" cy="50" r="48.5"/><g class="p-leaf-lines"><path class="p-leaf-stem" d="M50 79 L50 63 M50 61 L50 45 M50 43 L50 22"/><path class="p-leaf-shape" d="M50 62 C44 50 35 45 27 49 C28 59 37 65 50 62 Z"/><path class="p-leaf-vein" d="M50 62 Q39 54 27 49"/><path class="p-leaf-shape" d="M50 62 C56 50 65 45 73 49 C72 59 63 65 50 62 Z"/><path class="p-leaf-vein" d="M50 62 Q61 54 73 49"/><path class="p-leaf-shape" d="M50 44 C44 32 35 27 27 31 C28 41 37 47 50 44 Z"/><path class="p-leaf-vein" d="M50 44 Q39 36 27 31"/><path class="p-leaf-shape" d="M50 44 C56 32 65 27 73 31 C72 41 63 47 50 44 Z"/><path class="p-leaf-vein" d="M50 44 Q61 36 73 31"/></g></svg></div>';
    return "";
  };

  const grid = document.getElementById("project-grid");
  grid.innerHTML = projects.map((project) => `<article class="p-project ${escapeHtml(project.art)} p-card-${escapeHtml(project.art)} p-reveal" data-category="${escapeHtml(project.category)}">
    <button class="p-project-visual p-card-${escapeHtml(project.art)}" type="button" data-project-details="${escapeHtml(project.slug)}" aria-haspopup="dialog" aria-label="View ${escapeHtml(project.name)} project details">
      <div class="p-project-visual-top"><span>${escapeHtml(project.number)} / ${String(projects.length).padStart(2,"0")}</span><span>${escapeHtml(project.category)}</span></div>
      ${artFor(project)}<span class="p-project-mark">${escapeHtml(project.mark)}</span><span class="p-visual-open" aria-hidden="true">↗</span>
    </button>
    <div class="p-project-info"><div><div class="p-project-title"><h3>${escapeHtml(project.name)}</h3></div><p class="p-project-kind">${escapeHtml(project.kind)}</p><p class="p-project-summary">${escapeHtml(project.summary)}</p><div class="p-stack">${project.stack.map((item)=>`<span>${escapeHtml(item)}</span>`).join("")}</div></div><button class="p-project-link" type="button" data-project-details="${escapeHtml(project.slug)}" aria-label="View ${escapeHtml(project.name)} project details">Details <span>↗</span></button></div>
  </article>`).join("");

  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  let dark = false;
  const compactThemeView = window.matchMedia("(max-width: 620px)");
  let themeFrame = 0;
  let themeReleaseFrame = 0;
  themeButton.addEventListener("click", () => {
    if (compactThemeView.matches) {
      cancelAnimationFrame(themeFrame);
      cancelAnimationFrame(themeReleaseFrame);
      root.classList.add("is-theme-switching");
    }
    dark = !dark;
    root.classList.toggle("portfolio-dark", dark);
    themeButton.classList.toggle("is-dark", dark);
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.setAttribute("aria-label", dark ? "Switch to light color scheme" : "Switch to dark color scheme");
    document.querySelector('meta[name="theme-color"]').content = dark ? "#111322" : "#f5f5fb";
    if (compactThemeView.matches) {
      themeFrame = requestAnimationFrame(() => {
        themeReleaseFrame = requestAnimationFrame(() => {
          root.classList.remove("is-theme-switching");
          themeFrame = 0;
          themeReleaseFrame = 0;
        });
      });
    }
  });

  const menuButton = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-cardnav-panel");
  const menuGlyph = document.getElementById("menu-icon");
  if (menuButton && menu && menuGlyph) {
    const content = menu.querySelector(".p-mobile-cardnav-content");
    const cards = Array.from(menu.querySelectorAll(".p-mobile-cardnav-row"));
    const mobileMenu = window.matchMedia("(max-width: 620px)");
    const reduceMenuMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const state = { progress: 0, velocity: 0, height: 0 };
    let menuOpen = false;
    let frame = 0;
    let previousFrame = 0;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const measureMenu = () => {
      const style = getComputedStyle(menu);
      const borders = (Number.parseFloat(style.borderTopWidth) || 0) + (Number.parseFloat(style.borderBottomWidth) || 0);
      state.height = (content?.getBoundingClientRect().height || 0) + borders;
      wakeMenu();
    };
    const renderMenu = () => {
      const progress = Math.max(0, state.progress);
      menu.style.height = `${progress * state.height}px`;
      menu.style.opacity = String(clamp(progress * 1.65, 0, 1));
      menu.style.visibility = menuOpen || progress > 0.002 ? "visible" : "hidden";
      menu.style.pointerEvents = menuOpen && mobileMenu.matches ? "auto" : "none";
      const lag = cards.length > 1 ? Math.min(0.12, 0.7 / (cards.length - 1)) : 0;
      const span = 1 - lag * Math.max(0, cards.length - 1);
      cards.forEach((card, index) => {
        const local = clamp((state.progress - index * lag) / Math.max(span, 0.05), 0, 1);
        const eased = 1 - (1 - local) ** 3;
        card.style.opacity = String(clamp(local * 1.8, 0, 1));
        card.style.transform = `translateY(${(1 - eased) * 17}px) scale(${0.985 + eased * 0.015})`;
      });
    };
    const tickMenu = (now) => {
      frame = 0;
      const dt = previousFrame ? Math.min(0.05, (now - previousFrame) / 1000) : 1 / 60;
      previousFrame = now;
      const target = menuOpen && mobileMenu.matches ? 1 : 0;
      if (reduceMenuMotion.matches) {
        state.progress = target;
        state.velocity = 0;
      } else {
        const stiffness = 160;
        const dampingRatio = menuOpen ? 0.84 : 1;
        const steps = Math.ceil(dt / (1 / 240));
        const step = dt / steps;
        for (let index = 0; index < steps; index += 1) {
          state.velocity += (-stiffness * (state.progress - target) - 2 * dampingRatio * Math.sqrt(stiffness) * state.velocity) * step;
          state.progress += state.velocity * step;
        }
      }
      const done = Math.abs(state.progress - target) < 0.0005 && Math.abs(state.velocity) < 0.002;
      if (done) { state.progress = target; state.velocity = 0; }
      renderMenu();
      if (!done) frame = requestAnimationFrame(tickMenu);
    };
    function wakeMenu() {
      if (!frame) { previousFrame = 0; frame = requestAnimationFrame(tickMenu); }
    }
    const setMenuOpen = (nextOpen) => {
      menuOpen = Boolean(nextOpen && mobileMenu.matches);
      menu.classList.toggle("is-open", menuOpen);
      menuButton.classList.toggle("is-open", menuOpen);
      menuGlyph.classList.toggle("is-open", menuOpen);
      menuButton.setAttribute("aria-expanded", String(menuOpen));
      menuButton.setAttribute("aria-label", menuOpen ? "Close navigation menu" : "Open navigation menu");
      menu.setAttribute("aria-hidden", String(!menuOpen));
      menu.inert = !menuOpen;
      menu.querySelectorAll("a").forEach((link) => { link.tabIndex = menuOpen ? 0 : -1; });
      wakeMenu();
    };
    if (content && "ResizeObserver" in window) new ResizeObserver(measureMenu).observe(content);
    measureMenu();
    menuButton.addEventListener("click", () => setMenuOpen(!menuOpen));
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
    document.addEventListener("pointerdown", (event) => {
      if (menuOpen && !menu.contains(event.target) && !menuButton.contains(event.target)) setMenuOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuOpen) { setMenuOpen(false); menuButton.focus(); }
    });
    mobileMenu.addEventListener("change", (event) => { if (!event.matches) setMenuOpen(false); else measureMenu(); });
    reduceMenuMotion.addEventListener("change", wakeMenu);
  }

  const dialog = document.getElementById("project-details");
  const closeButton = document.getElementById("project-details-close");
  const previousOverflow = { value: "", rootValue: "", paddingRight: "" };
  let opener = null;
  let dialogCloseTimer = 0;
  let dialogClosing = false;
  const projectLogos = {
    codesentry: { src: "./assets/logos/codesentry.png", alt: "CodeSentry shield and wordmark" },
    nourishnet: { src: "./assets/logos/nourishnet.png", alt: "NourishNet leaf mark and wordmark" },
    resumelens: { src: "./assets/logos/resumelens.png", alt: "ResumeLens AI document and wordmark" },
    intellivox: { src: "./assets/logos/intellivox.png", alt: "IntelliVox voice mark and wordmark" },
    "florentix-ai": { src: "./assets/logos/florentix-ai.png", alt: "Florentix AI leaf mark and wordmark" },
  };
  const openProject = (slug, trigger) => {
    const project = projects.find((item) => item.slug === slug);
    if (!project || dialog.open) return;
    opener = trigger;
    dialog.dataset.project = project.slug;
    document.getElementById("project-dialog-title").textContent = project.name;
    document.getElementById("project-dialog-subtitle").textContent = project.subtitle;
    document.getElementById("project-dialog-category").textContent = `PROJECT CASE STUDY / ${project.categoryDetail || project.category}`;
    const logo = projectLogos[project.slug];
    const branding = document.getElementById("project-dialog-branding");
    const logoFrame = document.getElementById("project-dialog-logo-frame");
    const logoImage = document.getElementById("project-dialog-logo");
    branding.classList.toggle("has-logo", Boolean(logo));
    logoFrame.hidden = !logo;
    if (logo) { logoImage.src = logo.src; logoImage.alt = logo.alt; }
    else { logoImage.removeAttribute("src"); logoImage.alt = ""; }
    document.getElementById("project-dialog-badges").innerHTML = project.stack.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
    const sections = [
      ["01 / Overview", project.overview], ["02 / Problem", project.problem],
      ["05 / Implementation", project.implementation], ["06 / Development focus", project.contribution]
    ];
    const content = document.getElementById("project-dialog-content");
    content.innerHTML = `<section class="p-detail-section"><span class="p-detail-index">${sections[0][0]}</span><p>${escapeHtml(sections[0][1])}</p></section>
      <section class="p-detail-section"><span class="p-detail-index">${sections[1][0]}</span><p>${escapeHtml(sections[1][1])}</p></section>
      <section class="p-detail-section"><span class="p-detail-index">03 / What it does</span><ul class="p-detail-features">${project.features.map((feature)=>`<li>${escapeHtml(feature)}</li>`).join("")}</ul></section>
      <section class="p-detail-architecture"><div class="p-detail-architecture-heading"><div><span class="p-detail-index">04 / System architecture</span><h3>${escapeHtml(project.architectureTitle)}</h3></div><a href="./assets/architecture/${escapeHtml(project.slug)}.png" target="_blank" rel="noopener noreferrer">Open full image <span aria-hidden="true">↗</span></a></div><a class="p-detail-architecture-image" href="./assets/architecture/${escapeHtml(project.slug)}.png" target="_blank" rel="noopener noreferrer" aria-label="Open full-size ${escapeHtml(project.name)} architecture diagram"><img src="./assets/architecture/${escapeHtml(project.slug)}.png" alt="${escapeHtml(project.name)} system architecture diagram" loading="lazy"></a></section>
      <section class="p-detail-section"><span class="p-detail-index">${sections[2][0]}</span><p>${escapeHtml(sections[2][1])}</p></section>
      <section class="p-detail-section"><span class="p-detail-index">${sections[3][0]}</span><p>${escapeHtml(sections[3][1])}</p></section>`;
    const actions = [[project.repository, "Repository", "GH"], [project.live, "Live project", "↗"], [project.documentation, "Documentation", "DOC"]].filter(([url]) => Boolean(url));
    document.getElementById("project-dialog-actions").innerHTML = actions.map(([url,label,mark]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">${escapeHtml(mark)}</span> ${escapeHtml(label)} <span aria-hidden="true">↗</span></a>`).join("");
    previousOverflow.value = document.body.style.overflow;
    previousOverflow.rootValue = document.documentElement.style.overflow;
    previousOverflow.paddingRight = document.body.style.paddingRight;
    const scrollbarGap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    if (scrollbarGap > 0) {
      const currentPaddingRight = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPaddingRight + scrollbarGap}px`;
    }
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("portfolio:lenis-lock", { detail: true }));
    dialog.showModal();
    closeButton.focus();
  };
  const finishProjectClose = () => {
    if (!dialog.open) return;
    window.clearTimeout(dialogCloseTimer);
    dialogCloseTimer = 0;
    dialog.classList.remove("is-closing");
    dialog.close();
  };
  const closeProject = () => {
    if (!dialog.open || dialogClosing) return;
    dialogClosing = true;
    dialog.classList.add("is-closing");
    dialogCloseTimer = window.setTimeout(finishProjectClose, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 420);
  };
  grid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-project-details]");
    if (trigger) openProject(trigger.dataset.projectDetails, trigger);
  });
  document.querySelectorAll("[data-skill-project]").forEach((trigger) => {
    trigger.addEventListener("click", () => openProject(trigger.dataset.skillProject, trigger));
  });
  closeButton.addEventListener("click", closeProject);
  dialog.addEventListener("click", (event) => { if (event.target === dialog) closeProject(); });
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeProject(); });
  dialog.addEventListener("animationend", (event) => {
    if (event.target === dialog && event.animationName === "p-detail-dialog-out") finishProjectClose();
  });
  dialog.addEventListener("close", () => {
    window.clearTimeout(dialogCloseTimer);
    dialogCloseTimer = 0;
    dialogClosing = false;
    dialog.classList.remove("is-closing");
    document.body.style.overflow = previousOverflow.value;
    document.body.style.paddingRight = previousOverflow.paddingRight;
    document.documentElement.style.overflow = previousOverflow.rootValue;
    window.dispatchEvent(new CustomEvent("portfolio:lenis-lock", { detail: false }));
    if (opener?.isConnected) opener.focus();
    opener = null;
  });

  const credentialsButton = document.getElementById("credentials-toggle");
  credentialsButton.addEventListener("click", () => {
    const expanded = credentialsButton.getAttribute("aria-expanded") !== "true";
    credentialsButton.setAttribute("aria-expanded", String(expanded));
    document.querySelectorAll(".extra-credential").forEach((item) => { item.hidden = !expanded; });
    credentialsButton.innerHTML = expanded ? "Show fewer <span>↑</span>" : "Show all 15 credentials <span>→</span>";
  });
  document.getElementById("year").textContent = String(new Date().getFullYear());
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const status = document.getElementById("contact-status");
    const sling = contactForm.querySelector("#contact-sling");
    const submit = sling?.querySelector(".sling-button__pad");
    const arrow = sling?.querySelector(".sling-button__arrow");
    const spinner = sling?.querySelector(".sling-button__spinner");
    let sending = false;
    let triggerSubmitBurst = () => {};
    let slingshotSubmitting = false;

    // Port of the supplied SlingButton mechanics for this static HTML portfolio:
    // rubber-band pointer tracking, velocity-based slingshot release, spring-back,
    // threshold feedback, and a restrained directional particle burst.
    if (sling && submit) {
      const size = 56, gap = 4, stroke = 2.5, maxPull = 160, armAt = 48;
      const wellRadius = size / 2 + gap + stroke;
      const padRadius = size / 2 - stroke / 2;
      const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const movePad = sling.querySelector(".sling-button__move");
      const fx = sling.querySelector(".sling-button__tension");
      const band = sling.querySelector(".sling-button__band:not(.sling-button__band--hot)");
      const hotBand = sling.querySelector(".sling-button__band--hot");
      const arc = sling.querySelector(".sling-button__arc");
      const icon = sling.querySelector(".sling-button__arrow");
      const dots = Array.from({ length: 14 }, (_, index) => {
        const dot = document.createElement("span");
        dot.className = "sling-button__dot";
        dot.setAttribute("aria-hidden", "true");
        dot.dataset.dotIndex = String(index);
        sling.append(dot);
        return dot;
      });
      let offsetX = 0, offsetY = 0;
      let directionX = 0, directionY = -1;
      let grip = null, springFrame = 0, paintFrame = 0;
      let armed = false, suppressClick = false, dotPending = false, dotTimer = 0, particlePower = 0;

      const paint = () => {
        paintFrame = 0;
        const projection = offsetX * directionX + offsetY * directionY;
        const tension = clamp(projection / armAt, 0, 1);
        const distance = Math.hypot(offsetX, offsetY);
        movePad.style.transform = `translate3d(${offsetX}px,${offsetY}px,0)`;
        if (distance > .5) {
          const a = Math.atan2(offsetY, offsetX);
          const b = Math.acos(clamp((wellRadius - padRadius) / distance, -1, 1));
          const path = [a + b, a - b].map((angle) => {
            const cx = Math.cos(angle), cy = Math.sin(angle);
            return `M${(wellRadius * cx).toFixed(2)},${(wellRadius * cy).toFixed(2)}L${(offsetX + padRadius * cx).toFixed(2)},${(offsetY + padRadius * cy).toFixed(2)}`;
          }).join("");
          band.setAttribute("d", path);
          hotBand.setAttribute("d", path);
        } else {
          band.setAttribute("d", "");
          hotBand.setAttribute("d", "");
        }
        hotBand.style.opacity = String(tension);
        fx.style.opacity = String(clamp(projection / 6, 0, 1));
        arc.setAttribute("stroke-dasharray", `${tension} ${1 - tension}`);
        arc.setAttribute("stroke-dashoffset", String(tension / 2));
        arc.style.opacity = tension > .01 ? "1" : "0";
        arc.setAttribute("transform", `rotate(${Math.atan2(-directionY, -directionX) * 180 / Math.PI})`);
        if (grip) {
          const angle = Math.atan2(-directionY, -directionX) * 180 / Math.PI + 90;
          icon.style.transform = `rotate(${angle * clamp(distance / 12, 0, 1)}deg)`;
        }
        if (dotPending && projection <= size / 4) launchParticles();
      };
      const queuePaint = () => { if (!paintFrame) paintFrame = requestAnimationFrame(paint); };
      const relaxIcon = () => {
        icon.style.transition = reduceMotion.matches ? "none" : "transform 360ms cubic-bezier(.23,1,.32,1)";
        icon.style.transform = "rotate(0deg)";
      };
      const launchParticles = () => {
        dotPending = false;
        window.clearTimeout(dotTimer);
        relaxIcon();
        const base = Math.atan2(-directionY, -directionX);
        const cone = Math.PI * .72;
        const push = .96 + .28 * particlePower;
        dots.forEach((dot, index) => {
          const lead = index === 0;
          const angle = base + (lead ? 0 : (Math.random() + Math.random() - 1) * cone / 2);
          const cx = Math.cos(angle), cy = Math.sin(angle);
          const reach = lead ? 112 : 88 + Math.random() * 38;
          const drift = lead ? 0 : (Math.random() - .5) * 34;
          const scale = lead ? 1.2 : .7 + Math.random() * .38;
          const shrink = lead ? .48 : scale * (.28 + Math.random() * .22);
          const duration = lead ? 430 : 360 + Math.random() * 150;
          const delay = lead ? 0 : Math.random() * 42;
          const travel = wellRadius + reach * push;
          dot.animate([
            { transform: `translate(${cx * wellRadius}px,${cy * wellRadius}px) scale(${scale})` },
            { transform: `translate(${cx * travel - cy * drift}px,${cy * travel + cx * drift}px) scale(${shrink})` }
          ], { duration, delay, easing: "cubic-bezier(.16,1,.3,1)", fill: "none" });
          dot.animate([
            { opacity: .98, offset: 0 },
            { opacity: .98, offset: .38 },
            { opacity: .68, offset: .67 },
            { opacity: 0, offset: 1 }
          ], { duration, delay, easing: "linear", fill: "none" });
        });
      };
      triggerSubmitBurst = () => {
        if (reduceMotion.matches) return;
        directionX = 0;
        directionY = -1;
        particlePower = .14;
        launchParticles();
      };
      const settle = (velocityX = 0, velocityY = 0) => {
        if (springFrame) cancelAnimationFrame(springFrame);
        springFrame = 0;
        if (reduceMotion.matches) {
          offsetX = 0;
          offsetY = 0;
          movePad.style.transition = "transform 180ms ease-out";
          queuePaint();
          window.setTimeout(() => { movePad.style.transition = ""; }, 190);
          return;
        }
        let vx = velocityX, vy = velocityY;
        let lastTime = performance.now();
        const spring = (now) => {
          const dt = Math.min((now - lastTime) / 1000, .032);
          lastTime = now;
          const stiffness = 330, damping = 29;
          vx += (-stiffness * offsetX - damping * vx) * dt;
          vy += (-stiffness * offsetY - damping * vy) * dt;
          offsetX = clamp(offsetX + vx * dt, -maxPull * 1.35, maxPull * 1.35);
          offsetY = clamp(offsetY + vy * dt, -maxPull * 1.35, maxPull * 1.35);
          paint();
          if (Math.hypot(offsetX, offsetY) < .35 && Math.hypot(vx, vy) < 14) {
            offsetX = 0;
            offsetY = 0;
            paint();
            springFrame = 0;
            return;
          }
          springFrame = requestAnimationFrame(spring);
        };
        springFrame = requestAnimationFrame(spring);
      };
      const submitForm = () => {
        if (sending || submit.disabled) return;
        if (typeof contactForm.requestSubmit === "function") contactForm.requestSubmit(submit);
        else contactForm.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      };
      const onPointerDown = (event) => {
        if (submit.disabled || grip || (event.pointerType === "mouse" && event.button !== 0)) return;
        if (springFrame) cancelAnimationFrame(springFrame);
        springFrame = 0;
        const rect = sling.getBoundingClientRect();
        const scale = rect.width / (sling.offsetWidth || rect.width) || 1;
        const distance = Math.hypot(offsetX, offsetY);
        const limited = Math.min(distance, .95 * maxPull);
        const rawDistance = distance > .5 ? maxPull * limited / (maxPull - limited) : 0;
        grip = {
          id: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          scale,
          moved: false,
          history: [],
          rawX: distance > .5 ? rawDistance * offsetX / distance : 0,
          rawY: distance > .5 ? rawDistance * offsetY / distance : 0,
          slop: event.pointerType === "touch" ? 8 : 4
        };
        try { submit.setPointerCapture(event.pointerId); } catch {}
        submit.dataset.held = "";
      };
      const onPointerMove = (event) => {
        if (!grip || grip.id !== event.pointerId) return;
        const dx = (event.clientX - grip.startX) / grip.scale;
        const dy = (event.clientY - grip.startY) / grip.scale;
        const rawX = grip.rawX + dx, rawY = grip.rawY + dy;
        if (!grip.moved && Math.hypot(dx, dy) > grip.slop) grip.moved = true;
        const rawDistance = Math.hypot(rawX, rawY);
        if (rawDistance < .01) return;
        const distance = maxPull * rawDistance / (maxPull + rawDistance);
        directionX = rawX / rawDistance;
        directionY = rawY / rawDistance;
        offsetX = distance * directionX;
        offsetY = distance * directionY;
        const now = performance.now();
        grip.history.push({ x: offsetX, y: offsetY, time: now });
        while (grip.history.length > 4 || (grip.history.length && now - grip.history[0].time > 80)) grip.history.shift();
        const nextArmed = distance >= armAt;
        if (nextArmed !== armed) {
          armed = nextArmed;
          sling.toggleAttribute("data-armed", armed);
        }
        queuePaint();
      };
      const release = (pointerId, cancelled) => {
        if (!grip || grip.id !== pointerId) return;
        const currentGrip = grip;
        grip = null;
        submit.removeAttribute("data-held");
        if (!cancelled) {
          suppressClick = true;
          window.setTimeout(() => { suppressClick = false; }, 0);
        }
        try { if (submit.hasPointerCapture(pointerId)) submit.releasePointerCapture(pointerId); } catch {}
        const distance = Math.hypot(offsetX, offsetY);
        const power = distance / armAt;
        let vx = 0, vy = 0;
        if (!cancelled && currentGrip.history.length > 1) {
          const first = currentGrip.history[0];
          const last = currentGrip.history[currentGrip.history.length - 1];
          const elapsed = last.time - first.time;
          if (elapsed > 0 && performance.now() - last.time < 50) {
            vx = (last.x - first.x) / elapsed * 1000;
            vy = (last.y - first.y) / elapsed * 1000;
          }
        }
        const velocity = Math.hypot(vx, vy);
        if (velocity > 3000) { vx *= 3000 / velocity; vy *= 3000 / velocity; }
        if (!currentGrip.moved) {
          relaxIcon();
          settle();
          if (!cancelled) submitForm();
        } else if (!cancelled) {
          const fire = armed && !cancelled;
          const launch = fire ? 2600 * Math.min(power, 1.5) : .5 * 2600 * Math.min(power, 1);
          vx -= directionX * launch;
          vy -= directionY * launch;
          const launchVelocity = Math.hypot(vx, vy);
          if (launchVelocity > 6000) { vx *= 6000 / launchVelocity; vy *= 6000 / launchVelocity; }
          if (fire) {
            slingshotSubmitting = true;
            submitForm();
            window.setTimeout(() => { slingshotSubmitting = false; }, 0);
            if (!reduceMotion.matches) {
              dotPending = true;
              particlePower = clamp((Math.min(power, 1.5) - 1) / .5, 0, 1);
              dotTimer = window.setTimeout(launchParticles, 150);
            } else {
              sling.dataset.sent = "";
              window.setTimeout(() => sling.removeAttribute("data-sent"), 200);
            }
          } else relaxIcon();
          settle(vx, vy);
        } else {
          relaxIcon();
          settle();
        }
        armed = false;
        sling.removeAttribute("data-armed");
      };
      submit.addEventListener("pointerdown", onPointerDown);
      submit.addEventListener("pointermove", onPointerMove);
      submit.addEventListener("pointerup", (event) => release(event.pointerId, false));
      submit.addEventListener("pointercancel", (event) => release(event.pointerId, true));
      submit.addEventListener("lostpointercapture", (event) => release(event.pointerId, true));
      submit.addEventListener("keydown", (event) => { if (event.key === "Escape" && grip) release(grip.id, true); });
      submit.addEventListener("click", (event) => {
        if (suppressClick) { event.preventDefault(); suppressClick = false; }
      });
      reduceMotion.addEventListener("change", () => {
        if (!reduceMotion.matches) return;
        dotPending = false;
        window.clearTimeout(dotTimer);
        dots.forEach((dot) => dot.getAnimations().forEach((animation) => animation.cancel()));
        if (springFrame) settle();
      });
      window.addEventListener("pagehide", () => {
        if (springFrame) cancelAnimationFrame(springFrame);
        if (paintFrame) cancelAnimationFrame(paintFrame);
        window.clearTimeout(dotTimer);
        dots.forEach((dot) => dot.getAnimations().forEach((animation) => animation.cancel()));
      }, { once: true });
      paint();
    }
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (sending || !contactForm.reportValidity() || !submit || submit.disabled) return;
      if (contactForm.elements.company_website.value) return;
      if (!slingshotSubmitting) triggerSubmitBurst();
      slingshotSubmitting = false;
      const formData = new FormData(contactForm);
      const name = String(formData.get("name")).trim();
      const email = String(formData.get("email")).trim();
      const message = String(formData.get("message")).trim();
      sending = true;
      submit.disabled = true;
      submit.setAttribute("aria-busy", "true");
      submit.setAttribute("aria-label", "Sending your message");
      sling.dataset.loading = "";
      arrow.hidden = true;
      spinner.hidden = false;
      status.className = "p-form-status";
      status.textContent = "Sending your note…";
      try {
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ service_id: "service_l7jr9q4", template_id: "template_o7b9vu7", user_id: "fHveuQYI0JLBzpeYl", template_params: { name, email, message, from_name: name, from_email: email, reply_to: email } })
        });
        if (!response.ok) throw new Error("Email service returned " + response.status);
        contactForm.reset();
        status.className = "p-form-status is-success";
        status.textContent = "Thanks — your message is on its way. I’ll get back to you soon.";
        sling.dataset.sent = "";
        window.setTimeout(() => sling.removeAttribute("data-sent"), 320);
      } catch (error) {
        status.className = "p-form-status is-error";
        status.textContent = "Your message couldn’t be sent just now. Please email sanjayraju5164@gmail.com instead.";
      } finally {
        sending = false;
        submit.disabled = false;
        submit.removeAttribute("aria-busy");
        submit.setAttribute("aria-label", "Send your message");
        sling.removeAttribute("data-loading");
        spinner.hidden = true;
        arrow.hidden = false;
      }
    });
  }
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .12 });
    document.querySelectorAll(".p-reveal").forEach((item) => observer.observe(item));
  } else document.querySelectorAll(".p-reveal").forEach((item) => item.classList.add("is-visible"));
})();





(() => {
  const markNavIntroReady = nav => {
    if (window.__portfolioNavIntroReady) return;
    window.__portfolioNavIntroReady = true;
    if (nav) nav.dataset.introReady = "true";
    window.dispatchEvent(new Event("portfolio:nav-intro-finished"));
  };

  const introNav = () => {
    const nav = document.querySelector(".p-nav");
    if (!nav) return;
    const mobile = window.matchMedia("(max-width: 620px)").matches;
    const tablet = window.matchMedia("(min-width: 621px) and (max-width: 850px)").matches;
    const desktop = window.matchMedia("(min-width: 851px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (nav.dataset.introPlayed === "true" || window.__portfolioNavIntroPlayed) return;
    if ((!mobile && !tablet && !desktop) || reducedMotion) {
      nav.removeAttribute("data-intro-pending");
      markNavIntroReady(nav);
      return;
    }
    nav.dataset.introPlayed = "true";
    window.__portfolioNavIntroPlayed = true;
    window.requestAnimationFrame(() => {
      if (!nav.isConnected) {
        markNavIntroReady(null);
        return;
      }
      nav.dataset.introAnimating = "true";
      const reveal = nav.animate([
        { clipPath: "inset(0 48% 0 48% round 999px)", opacity: 0.65 },
        { clipPath: "inset(0 0% 0 0% round 999px)", opacity: 1 },
      ], { duration: 1280, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" });
      nav.removeAttribute("data-intro-pending");
      reveal.onfinish = () => {
        reveal.cancel();
        delete nav.dataset.introAnimating;
        markNavIntroReady(nav);
      };
    });
  };

  const loader = document.getElementById("portfolio-loader");
  const skipButton = document.getElementById("loader-skip");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let dismissed = false;
  let identityAligned = false;
  let identityAlignTimer = 0;
  const alignLoaderIdentity = () => {
    const loaderCenter = loader?.querySelector(".p-loader-center");
    if (!loaderCenter || !loader.isConnected || loader.classList.contains("is-leaving") || (dismissed && identityAligned)) return;
    const pairs = [[".p-loader-editorial > .p-overline", ".p-hero-copy > .p-overline"], [".p-loader-editorial > h1", ".p-hero-copy > h1"]];
    if (window.matchMedia("(max-width: 850px)").matches) {
      pairs.forEach(([loaderSelector]) => {
        const source = loader?.querySelector(loaderSelector);
        source?.style.removeProperty("width");
        source?.style.removeProperty("transform");
      });
      loader.classList.add("handoff-ready");
      identityAligned = true;
      return;
    }
    pairs.forEach(([loaderSelector, heroSelector]) => {
      const source = loader?.querySelector(loaderSelector);
      const target = document.querySelector(heroSelector);
      if (!source || !target) return;
      const rect = target.getBoundingClientRect();
      source.style.width = rect.width + "px";
      const sourceRect = source.getBoundingClientRect();
      const transform = getComputedStyle(source).transform;
      const matrix = transform === "none" ? null : new DOMMatrixReadOnly(transform);
      const untransformedLeft = sourceRect.left - (matrix?.m41 || 0);
      const untransformedTop = sourceRect.top - (matrix?.m42 || 0);
      source.style.transform = `translate3d(${rect.left - untransformedLeft}px, ${rect.top - untransformedTop}px, 0)`;
    });
    loader?.classList.add("handoff-ready");
    identityAligned = true;
  };
  if (loader) {
    window.addEventListener("resize", () => {
      if (!identityAligned || loader.classList.contains("is-leaving")) return;
      window.clearTimeout(identityAlignTimer);
      identityAlignTimer = window.setTimeout(alignLoaderIdentity, 140);
    }, { passive: true });
    // Align before the first painted frame so the identity is present from the
    // start of the loader; font readiness is only a later geometry correction.
    alignLoaderIdentity();
    if (document.fonts?.ready) document.fonts.ready.then(() => {
      if (!loader.isConnected || loader.classList.contains("is-leaving")) return;
      loader.classList.add("font-metrics-ready");
      requestAnimationFrame(alignLoaderIdentity);
    });
    let finishTimer;
    let safetyTimer;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      window.clearTimeout(identityAlignTimer);
      if (!identityAligned) alignLoaderIdentity();
      window.clearTimeout(finishTimer);
      window.clearTimeout(safetyTimer);
      const beginExit = () => {
        loader.classList.add("is-leaving");
        window.portfolioCursorHandoff?.();
      };
      if (reduceMotion) window.setTimeout(beginExit, 60);
      else requestAnimationFrame(beginExit);
      window.setTimeout(() => { loader.remove(); introNav(); }, reduceMotion ? 320 : 820);
    };
    skipButton.addEventListener("click", dismiss, { once: true });
    const startedAt = performance.now();
    const minimumDuration = reduceMotion ? 420 : 2220;
    const finishAfterMinimum = () => {
      finishTimer = window.setTimeout(dismiss, Math.max(0, minimumDuration - (performance.now() - startedAt)));
    };
    window.addEventListener("load", finishAfterMinimum, { once: true });
    if (document.readyState === "complete") finishAfterMinimum();
    safetyTimer = window.setTimeout(dismiss, reduceMotion ? 850 : 2920);
  } else introNav();

  const progress = document.getElementById("scroll-progress");
  if (progress) {
    const mobileView = window.matchMedia("(max-width: 620px)");
    let progressFrame = 0;
    const paintProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const updateProgress = () => {
      if (!mobileView.matches) { paintProgress(); return; }
      if (progressFrame) return;
      progressFrame = requestAnimationFrame(() => { progressFrame = 0; paintProgress(); });
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    window.addEventListener("pagehide", () => cancelAnimationFrame(progressFrame), { once: true });
  }

  document.querySelectorAll(".p-ticker").forEach((ticker) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tracks = Array.from(ticker.querySelectorAll(".p-ticker-track"));
    if (!tracks.length) return;
    const animations = tracks.flatMap((track) => track.getAnimations());
    if (!animations.length) return;
    let frame = 0;
    let currentRate = 1;
    let targetRate = 1;
    const easeRate = (target) => {
      if (target === targetRate) return;
      targetRate = target;
      window.cancelAnimationFrame(frame);
      const initialRate = currentRate;
      const startedAt = performance.now();
      const duration = 680;
      const step = (now) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = progress * progress * progress * (progress * (progress * 6 - 15) + 10);
        currentRate = initialRate + (targetRate - initialRate) * eased;
        animations.forEach((animation) => {
          if (typeof animation.updatePlaybackRate === "function") animation.updatePlaybackRate(currentRate);
          else animation.playbackRate = currentRate;
        });
        if (progress < 1) frame = requestAnimationFrame(step);
        else frame = 0;
      };
      frame = requestAnimationFrame(step);
    };
    const syncInteraction = () => easeRate(ticker.matches(":hover, :focus-within") ? .62 : 1);
    ticker.addEventListener("pointerenter", () => easeRate(.62));
    ticker.addEventListener("pointerleave", syncInteraction);
    ticker.addEventListener("focusin", () => easeRate(.62));
    ticker.addEventListener("focusout", () => requestAnimationFrame(syncInteraction));
  });

  const pointerRoot = document.querySelector(".portfolio");
  if (pointerRoot && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const pageCursor = pointerRoot.querySelector(":scope > .p-cursor");
    const loader = document.querySelector(".p-loader");
    const loaderCursor = loader && pageCursor ? pageCursor.cloneNode(true) : null;
    if (loaderCursor) { loaderCursor.classList.add("p-cursor-loader"); loader.append(loaderCursor); }
    let frame = 0, x = 0, y = 0, clientX = 0, clientY = 0, hasPointerPosition = false;
    const handoff = () => {
      if (!hasPointerPosition || !pointerRoot.classList.contains("has-custom-cursor")) return;
      document.querySelectorAll(".p-cursor").forEach((node) => node.classList.remove("is-active", "is-hand", "is-text"));
      pageCursor.querySelectorAll(".p-cursor-plane,.p-cursor-hand,.p-cursor-text").forEach((icon) => {
        icon.style.setProperty("--pointer-x", clientX + "px");
        icon.style.setProperty("--pointer-y", clientY + "px");
      });
      pageCursor.classList.remove("is-hand", "is-text");
      pageCursor.classList.add("is-active");
      loader?.classList.remove("has-custom-cursor");
    };
    window.portfolioCursorHandoff = handoff;
    window.addEventListener("pagehide", () => { delete window.portfolioCursorHandoff; }, { once: true });
    const move = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const dialog = target?.closest(".p-detail-dialog[open], .p-notebook-dialog[open]") || document.querySelector(".p-detail-dialog[open], .p-notebook-dialog[open]");
      const loaderTarget = target?.closest(".p-loader");
      const onLoader = loaderTarget && !loaderTarget.classList.contains("is-leaving");
      const leavingIntro = !!loaderTarget && loaderTarget.classList.contains("is-leaving");
      const inPortfolio = !!target?.closest(".portfolio");
      const cursor = dialog?.querySelector(".p-cursor") || (onLoader ? loaderCursor : pageCursor);
      if (!cursor || (!dialog && !onLoader && !inPortfolio && !leavingIntro)) { pointerRoot.classList.remove("has-custom-cursor"); loader?.classList.remove("has-custom-cursor"); document.querySelectorAll(".p-cursor").forEach((node) => node.classList.remove("is-active", "is-hand", "is-text")); return; }
      const rect = dialog?.getBoundingClientRect();
      clientX = event.clientX; clientY = event.clientY; hasPointerPosition = true;
      x = event.clientX - (rect ? rect.left + dialog.clientLeft : 0);
      y = event.clientY - (rect ? rect.top + dialog.clientTop : 0);
      if (!cursor.classList.contains("is-active")) cursor.querySelectorAll(".p-cursor-plane,.p-cursor-hand,.p-cursor-text").forEach((icon) => { icon.style.setProperty("--pointer-x", x + "px"); icon.style.setProperty("--pointer-y", y + "px"); });
      pointerRoot.classList.add("has-custom-cursor");
      loader?.classList.toggle("has-custom-cursor", cursor === loaderCursor);
      const projectCard = target?.closest(".p-project");
      const textEntry = !!target?.closest(".p-contact-form input:not([type='submit']):not([type='button']):not([type='hidden']), .p-contact-form textarea, .p-contact-form [contenteditable='true']");
      const lanyard = !!target?.closest("[data-lanyard]");
      const pointerInsideDialog = !dialog || !!target?.closest(".p-detail-dialog[open], .p-notebook-dialog[open]");
      const actionable = pointerInsideDialog && (lanyard || !!projectCard || !!target?.closest("a, button, [role='button'], input[type='submit'], input[type='button']"));
      const accentSource = dialog || projectCard;
      const accentProperty = dialog ? (dialog.matches(".p-detail-dialog") ? "--detail-accent" : "--accent") : "--project-accent";
      const projectAccent = accentSource ? getComputedStyle(accentSource).getPropertyValue(accentProperty).trim() : "";
      document.querySelectorAll(".p-cursor").forEach((node) => {
        node.classList.toggle("is-active", node === cursor);
        node.classList.toggle("is-hand", node === cursor && actionable);
        node.classList.toggle("is-text", node === cursor && textEntry);
        if (node === cursor && projectAccent) node.style.setProperty("--cursor-accent", projectAccent);
        else if (node === cursor) node.style.removeProperty("--cursor-accent");
      });
      if (!frame) frame = requestAnimationFrame(() => { cursor.querySelectorAll(".p-cursor-plane,.p-cursor-hand,.p-cursor-text").forEach((icon) => { icon.style.setProperty("--pointer-x", x + "px"); icon.style.setProperty("--pointer-y", y + "px"); }); frame = 0; });
    };
    const leave = () => { pointerRoot.classList.remove("has-custom-cursor"); loader?.classList.remove("has-custom-cursor"); document.querySelectorAll(".p-cursor").forEach((node) => node.classList.remove("is-active", "is-hand", "is-text")); };
    const out = (event) => { if (event.relatedTarget === null) leave(); };
    const onVisibilityChange = () => { if (document.visibilityState !== "visible") leave(); };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerover", move);
    document.addEventListener("pointerout", out);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", leave);
  }

  const iconCloud = document.getElementById("project-icon-cloud");
  if (iconCloud) {
    const technologies = [
      ["Java", "java", "ed8b00"], ["Spring", "spring", "6db33f"], ["React", "react", "61dafb"],
      ["TypeScript", "typescript", "3178c6"], ["JavaScript", "javascript", "f7df1e"], ["Python", "python", "3776ab"],
      ["MySQL", "mysql", "4479a1"], ["PostgreSQL", "postgresql", "4169e1"], ["Supabase", "supabase", "3fcf8e"],
      ["Firebase", "firebase", "ffca28"], ["Docker", "docker", "2496ed"], ["GitHub", "github", "181717"],
      ["Git", "git", "f05032"], ["Amazon Web Services", "amazonaws", "232f3e"], ["HTML5", "html5", "e34f26"],
      ["CSS3", "css3", "1572b6"], ["FastAPI", "fastapi", "009688"], ["Vercel", "vercel", "000000"],
      ["Postman", "postman", "ff6c37"], ["IntelliJ IDEA", "intellijidea", "000000"], ["Streamlit", "streamlit", "ff4b4b"],
      ["TensorFlow", "tensorflow", "ff6f00"],
    ];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    technologies.forEach(([name, slug, color], index) => {
      const y = 1 - index / (technologies.length - 1) * 2;
      const radial = Math.sqrt(1 - y * y);
      const angle = goldenAngle * index;
      const node = document.createElement("span");
      node.className = "p-icon-cloud-node";
      node.dataset.cloudNode = "";
      node.dataset.x = String(Math.cos(angle) * radial);
      node.dataset.y = String(y);
      node.dataset.z = String(Math.sin(angle) * radial);
      node.title = name;
      const image = document.createElement("img");
      image.alt = "";
      // The nodes move around inside a sphere, so lazy loading can leave icons
      // unloaded even while their cards are visible. Load the small SVGs up
      // front and retry via jsDelivr if the colorized Simple Icons endpoint fails.
      image.loading = "eager";
      image.decoding = "async";
      image.draggable = false;
      const iconSources = [
        `https://cdn.simpleicons.org/${slug}/${color}`,
        `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`,
      ];
      let sourceIndex = 0;
      image.addEventListener("load", () => node.classList.remove("has-icon-fallback"));
      image.addEventListener("error", () => {
        sourceIndex += 1;
        if (sourceIndex < iconSources.length) image.src = iconSources[sourceIndex];
        else node.classList.add("has-icon-fallback");
      });
      const fallback = document.createElement("span");
      fallback.className = "p-icon-cloud-fallback";
      fallback.textContent = name.slice(0, 2);
      fallback.setAttribute("aria-hidden", "true");
      node.append(image, fallback);
      image.src = iconSources[sourceIndex];
      iconCloud.append(node);
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileView = window.matchMedia("(max-width: 850px)");
    const nodes = Array.from(iconCloud.querySelectorAll("[data-cloud-node]"));
    let frame = 0, rotationX = 0, rotationY = 0, targetX = 0, targetY = 0;
    let velocityX = 0, velocityY = 0, pointerX = 0, pointerY = 0, pointerTime = 0;
    let dragging = false, hovering = false, lastTime = 0;
    let cloudIntersecting = !mobileView.matches || !("IntersectionObserver" in window);
    let cloudVisible = cloudIntersecting;
    const stopRenderLoop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    };
    const scheduleRender = () => {
      if (frame || !cloudVisible || (mobileView.matches && document.hidden)) return;
      if (mobileView.matches && !dragging) {
        const stillSettling = Math.abs(velocityX) > .00004 || Math.abs(velocityY) > .00004 ||
          Math.abs(targetX - rotationX) > .001 || Math.abs(targetY - rotationY) > .001;
        if (reducedMotion || !stillSettling) {
          velocityX = 0;
          velocityY = 0;
          return;
        }
      }
      frame = requestAnimationFrame(render);
    };
    const wake = () => {
      if (!cloudVisible || (mobileView.matches && document.hidden)) return;
      if (!frame) frame = requestAnimationFrame(render);
    };
    const render = (time) => {
      frame = 0;
      if (!cloudVisible || (mobileView.matches && document.hidden)) { lastTime = 0; return; }
      const delta = lastTime ? Math.min(time - lastTime, 40) : 16;
      lastTime = time;
      if (!mobileView.matches && !reducedMotion && !dragging) targetY += delta * (hovering ? .00008 : .00012);
      if (!dragging) {
        targetX += velocityX * delta;
        targetY += velocityY * delta;
        const damping = Math.pow(.92, delta / 16.67);
        velocityX *= damping;
        velocityY *= damping;
      }
      const ease = 1 - Math.pow(.82, delta / 16.67);
      rotationX += (targetX - rotationX) * ease;
      rotationY += (targetY - rotationY) * ease;
      const cosineY = Math.cos(rotationY), sineY = Math.sin(rotationY);
      const cosineX = Math.cos(rotationX), sineX = Math.sin(rotationX);
      const radius = Math.min(iconCloud.clientWidth, iconCloud.clientHeight) * .37;
      nodes.forEach((node) => {
        const x = Number(node.dataset.x), y = Number(node.dataset.y), z = Number(node.dataset.z);
        const yawX = x * cosineY - z * sineY, yawZ = x * sineY + z * cosineY;
        const rotatedY = y * cosineX - yawZ * sineX, rz = y * sineX + yawZ * cosineX;
        const depth = (rz + 1) / 2;
        node.style.transform = `translate3d(${yawX * radius}px, ${rotatedY * radius}px, 0) translate(-50%, -50%) scale(${.76 + depth * .34})`;
        node.style.opacity = String(.62 + depth * .38);
        node.style.zIndex = String(Math.round(depth * 100));
      });
      scheduleRender();
    };
    const onPointerDown = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragging = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerTime = performance.now();
      velocityX = 0;
      velocityY = 0;
      wake();
      iconCloud.setPointerCapture(event.pointerId);
      iconCloud.classList.add("is-dragging");
    };
    const onPointerMove = (event) => {
      if (!dragging) return;
      const now = performance.now(), elapsed = Math.max(now - pointerTime, 8);
      const deltaX = event.clientX - pointerX, deltaY = event.clientY - pointerY;
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerTime = now;
      targetY -= deltaX * .006;
      targetX -= deltaY * .006;
      velocityY = Math.max(-.014, Math.min(.014, -deltaX * .006 / elapsed));
      velocityX = Math.max(-.014, Math.min(.014, -deltaY * .006 / elapsed));
      wake();
    };
    const endDrag = () => { dragging = false; iconCloud.classList.remove("is-dragging"); wake(); };
    const onPointerEnter = () => { hovering = true; wake(); };
    const onPointerLeave = () => { hovering = false; };
    const onCompactChange = () => {
      cloudVisible = mobileView.matches ? cloudIntersecting : true;
      if (cloudVisible) wake(); else stopRenderLoop();
    };
    const onVisibilityChange = () => {
      if (!mobileView.matches) return;
      if (document.hidden) stopRenderLoop(); else wake();
    };
    const visibility = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
      cloudIntersecting = entries.some((entry) => entry.isIntersecting);
      if (!mobileView.matches) return;
      cloudVisible = cloudIntersecting;
      if (cloudVisible) wake(); else stopRenderLoop();
    }, { rootMargin: "100px 0px" }) : null;
    visibility?.observe(iconCloud);
    iconCloud.addEventListener("pointerdown", onPointerDown);
    iconCloud.addEventListener("pointermove", onPointerMove);
    iconCloud.addEventListener("pointerup", endDrag);
    iconCloud.addEventListener("pointercancel", endDrag);
    iconCloud.addEventListener("pointerenter", onPointerEnter);
    iconCloud.addEventListener("pointerleave", onPointerLeave);
    mobileView.addEventListener("change", onCompactChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", () => {
      stopRenderLoop();
      visibility?.disconnect();
      mobileView.removeEventListener("change", onCompactChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      iconCloud.removeEventListener("pointerdown", onPointerDown);
      iconCloud.removeEventListener("pointermove", onPointerMove);
      iconCloud.removeEventListener("pointerup", endDrag);
      iconCloud.removeEventListener("pointercancel", endDrag);
      iconCloud.removeEventListener("pointerenter", onPointerEnter);
      iconCloud.removeEventListener("pointerleave", onPointerLeave);
    }, { once: true });
    if (!mobileView.matches) wake();
  }
})();

/* React Bits ProfileCard motion for the static portfolio entry point. */
(() => {
  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
  document.querySelectorAll("[data-profile-card]").forEach((card) => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const size = { width: card.offsetWidth, height: card.offsetHeight };
    const x = { position: .62, velocity: 0, target: 0 };
    const y = { position: -.55, velocity: 0, target: 0 };
    const light = { position: reducedMotion ? 0 : 1, target: 0 };
    let frame = 0;
    let last = 0;
    let slowUntil = reducedMotion ? 0 : performance.now() + 1400;
    let touchId = null;
    const write = () => {
      const reach = Math.min(1, Math.hypot(x.position, y.position));
      const style = card.style;
      style.setProperty("--pc-light-x", `${((x.position + 1) * .5 * size.width).toFixed(1)}px`);
      style.setProperty("--pc-light-y", `${((y.position + 1) * .5 * size.height).toFixed(1)}px`);
      style.setProperty("--pc-pointer-x", `${((x.position + 1) * 50).toFixed(2)}%`);
      style.setProperty("--pc-pointer-y", `${((y.position + 1) * 50).toFixed(2)}%`);
      style.setProperty("--pc-band-x", `${(50 + x.position * 15).toFixed(2)}%`);
      style.setProperty("--pc-band-y", `${(50 + y.position * 15).toFixed(2)}%`);
      style.setProperty("--pc-rotate-x", `${(y.position * (reducedMotion ? 0 : 12)).toFixed(3)}deg`);
      style.setProperty("--pc-rotate-y", `${(-x.position * (reducedMotion ? 0 : 12)).toFixed(3)}deg`);
      style.setProperty("--pc-shift-x", `${(x.position * (reducedMotion ? 0 : 8)).toFixed(2)}px`);
      style.setProperty("--pc-shift-y", `${(y.position * (reducedMotion ? 0 : 8)).toFixed(2)}px`);
      style.setProperty("--pc-reach", reach.toFixed(4));
      style.setProperty("--pc-tilt", (reach * light.position).toFixed(4));
      style.setProperty("--pc-active", light.position.toFixed(4));
    };
    const animate = (now) => {
      const elapsed = Math.min(.05, (now - last) / 1000 || 0);
      last = now;
      const slow = now < slowUntil;
      const stiffness = slow ? 24 : 120;
      const damping = slow ? 9 : 16;
      const steps = Math.max(1, Math.ceil(elapsed / (1 / 120)));
      const step = elapsed / steps;
      for (let index = 0; index < steps; index += 1) for (const axis of [x, y]) {
        axis.velocity += (stiffness * (axis.target - axis.position) - damping * axis.velocity) * step;
        axis.position += axis.velocity * step;
      }
      const tau = light.target > light.position ? .18 : slow ? .9 : .45;
      light.position += (light.target - light.position) * (1 - Math.exp(-elapsed / tau));
      write();
      const moving = Math.abs(x.target - x.position) > .0005 || Math.abs(y.target - y.position) > .0005 || Math.abs(x.velocity) > .0005 || Math.abs(y.velocity) > .0005 || Math.abs(light.target - light.position) > .002;
      if (moving) frame = requestAnimationFrame(animate);
      else { x.position = x.target; y.position = y.target; light.position = light.target; write(); frame = 0; }
    };
    const wake = () => { if (!frame) { last = performance.now(); frame = requestAnimationFrame(animate); } };
    const aim = (nextX, nextY, lit = true) => { x.target = clamp(nextX, -1, 1); y.target = clamp(nextY, -1, 1); light.target = lit ? 1 : 0; slowUntil = 0; wake(); };
    const aimAt = (event) => { const rect = card.getBoundingClientRect(); if (rect.width && rect.height) aim(((event.clientX - rect.left) / rect.width) * 2 - 1, ((event.clientY - rect.top) / rect.height) * 2 - 1); };
    const release = () => aim(0, 0, false);
    card.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") aimAt(event); });
    card.addEventListener("pointermove", (event) => { if (event.pointerType === "mouse" || event.pointerId === touchId) aimAt(event); });
    card.addEventListener("pointerleave", (event) => { if (event.pointerType === "mouse") release(); });
    card.addEventListener("pointerdown", (event) => { if (event.pointerType !== "mouse") { touchId = event.pointerId; aimAt(event); } });
    const releaseTouch = (event) => { if (event.pointerId === touchId) { touchId = null; release(); } };
    card.addEventListener("pointerup", releaseTouch); card.addEventListener("pointercancel", releaseTouch);
    new ResizeObserver(() => { size.width = card.offsetWidth; size.height = card.offsetHeight; write(); }).observe(card);
    write();
    if (!reducedMotion) wake();
  });
})();

(() => {
  const root = document.getElementById("engineering-notebook");
  const folder = document.getElementById("notebook-folder");
  const dialog = document.getElementById("engineering-notebook-dialog");
  if (!root || !folder || !dialog) return;
  const sheets = Array.from(folder.querySelectorAll("[data-notebook-open]"));
  const toggle = folder.querySelector("[data-notebook-toggle]");
  const title = dialog.querySelector("[data-notebook-title]");
  const eyebrow = dialog.querySelector("[data-notebook-eyebrow]");
  const summary = dialog.querySelector("[data-notebook-summary]");
  const content = dialog.querySelector("[data-notebook-content]");
  const count = dialog.querySelector("[data-notebook-count]");
  const closeButton = dialog.querySelector("[data-notebook-close]");
  const notes = [
    { eyebrow: "01 / Foundations · FIELD NOTES", title: "Engineering Principles", summary: "Layered responsibilities. Clear boundaries.", content: `<p class="p-notebook-lede">The projects here document a consistent focus on readable structure, clear boundaries, and changes that remain understandable.</p><h3>Layered responsibilities</h3><p>CodeSentry separates its React client, Java Spring Boot REST API, scan services, and JPA-backed persistence. This gives interface, application, and data work distinct responsibilities within the documented flow.</p><div class="p-notebook-diagram" role="img" aria-label="A project flow from interface to application logic to persistence"><span>Interface</span><i>→</i><span>Application logic</span><i>→</i><span>Persistence</span></div><h3>Maintainability in practice</h3><p>Validation and persistence live with the backend flow that owns them, while the client focuses on user interaction. The separation keeps the main system path easier to follow as features are added.</p><p class="p-notebook-callout">A clear boundary makes the purpose of each layer easier to explain, review, and extend.</p>` },
    { eyebrow: "02 / Trust boundaries · FIELD NOTES", title: "Security by Design", summary: "Validation. Authenticated APIs. Deliberate limits.", content: `<p class="p-notebook-lede">Security checks are part of the request flow, beginning where external data enters the application.</p><h3>Input validation at the boundary</h3><p>CodeSentry checks archive integrity, file extensions, and duplicate files before scanning. Its authenticated routes use Spring Security and JWT, with authorization enforced by the server.</p><pre class="p-notebook-code"><code>// Illustrative Spring validation pattern\nrecord ScanRequest(\n  @NotBlank String projectId,\n  @NotEmpty List&lt;@Valid SourceFile&gt; files\n) {}\n\n@PostMapping("/scans")\nScanResult scan(@Valid @RequestBody ScanRequest request) {\n  return scanService.start(request);\n}</code></pre><h3>Scope and review</h3><p>Static rules provide repeatable signals that can be reviewed alongside file evidence. AI-generated explanations add context, but neither the analysis nor its guidance guarantees detection or replaces a security audit. Spring Security is an area of practical, foundational experience.</p>` },
    { eyebrow: "03 / Method · FIELD NOTES", title: "Problem Solving", summary: "Decomposition. Debugging. Edge cases.", content: `<p class="p-notebook-lede">Problem-solving practice turns larger tasks into a sequence of clear, verifiable steps.</p><ol class="p-notebook-steps"><li><b>Clarify</b><span>Record the input, expected result, and constraints.</span></li><li><b>Break down</b><span>Separate the main path from validation and failure cases.</span></li><li><b>Trace</b><span>Work through a small example and its boundary cases.</span></li><li><b>Debug</b><span>Use evidence to isolate a cause, then verify the change.</span></li></ol><h3>Java and DSA practice</h3><p>Java is the primary language for coding practice across LeetCode and SkillRack. That work reinforces data structures, algorithms, logical tracing, and attention to empty input, invalid states, duplicates, and limits.</p><p class="p-notebook-callout">A reduced example often makes the failing assumption or boundary easier to identify.</p>` },
    { eyebrow: "04 / APIs & data · FIELD NOTES", title: "Backend Engineering", summary: "REST APIs. Persistence. Useful error handling.", content: `<p class="p-notebook-lede">The CodeSentry backend connects REST endpoints, application services, persistence, authentication, and reporting in a Java-based workflow.</p><div class="p-notebook-diagram" role="img" aria-label="Request flows through validation, service logic, database, and response"><span>Request</span><i>→</i><span>Validate</span><i>→</i><span>Service</span><i>→</i><span>Database</span><i>→</i><span>Response</span></div><h3>Persistence and API behavior</h3><p>Spring Data JPA and MySQL store the project, scan, file, and finding data described in the project architecture. Postman supports request and response checks while developing API behavior.</p><h3>Error handling</h3><p>Request validation and clear failure responses help callers understand rejected input without exposing implementation details. These practices support a predictable REST contract as the backend grows.</p><p class="p-notebook-tags"><span>Java</span><span>Spring Boot</span><span>REST</span><span>JPA</span><span>MySQL</span></p>` },
    { eyebrow: "05 / Reflection · FIELD NOTES", title: "Learnings & Trade-offs", summary: "Scope. Alternatives. Continuous improvement.", content: `<p class="p-notebook-lede">The project work captures decisions made within real constraints—and the lessons those choices leave behind.</p><h3>Repeatability with useful context</h3><p>CodeSentry runs deterministic checks before adding AI-assisted explanations. The rules provide repeatable findings; generated guidance adds context but still needs review and remains limited by rule coverage.</p><h3>Resilience and added complexity</h3><p>IntelliVox routes to a fallback provider when its primary route is unavailable. Florentix AI also documents a fallback inference path. These alternatives improve continuity while adding configuration and additional failure cases to manage.</p><h3>Learning in progress</h3><p>Current development is focused on deeper Java backend practice, database design, testing, and independent frontend fluency. Reviewing alternatives and refining earlier decisions remain part of that ongoing learning.</p><p class="p-notebook-callout">That balance keeps trade-offs visible and leaves room to adjust as requirements become clearer.</p>` }
  ];
  let activeIndex = -1;
  let previousOverflow = null;
  let returnFocus = null;
  let lastPointerType = "";
  let closing = false;
  let closeTimer = 0;
  let tiltFrame = 0;
  let pendingTiltPoint = null;
  let lastScrollAt = 0;
  let scrollSettleTimer = 0;
  const setFolderOpen = (isOpen) => {
    folder.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close engineering notebook folder" : "Open engineering notebook folder");
    sheets.forEach((sheet) => { sheet.tabIndex = isOpen ? 0 : -1; });
  };
  const render = (index) => {
    if (closeTimer) { window.clearTimeout(closeTimer); closeTimer = 0; }
    closing = false;
    dialog.classList.remove("is-closing");
    activeIndex = (index + notes.length) % notes.length;
    const shouldOpenDialog = !dialog.open;
    const openingSheetRect = shouldOpenDialog ? sheets[activeIndex]?.getBoundingClientRect() : null;
    const note = notes[activeIndex];
    eyebrow.textContent = note.eyebrow;
    title.textContent = note.title;
    summary.textContent = note.summary;
    content.innerHTML = note.content;
    count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(notes.length).padStart(2, "0")}`;
    setFolderOpen(true);
    if (shouldOpenDialog) {
      returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      previousOverflow = {
        body: document.body.style.overflow,
        root: document.documentElement.style.overflow,
        bodyPaddingRight: document.body.style.paddingRight
      };
      const scrollbarGap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
      if (scrollbarGap > 0) {
        const currentPaddingRight = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
        document.body.style.paddingRight = `${currentPaddingRight + scrollbarGap}px`;
      }
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      window.dispatchEvent(new CustomEvent("portfolio:lenis-lock", { detail: true }));
      dialog.classList.add("is-paper-transition");
      dialog.showModal();
      if (openingSheetRect && window.matchMedia("(max-width:480px)").matches) {
        const dialogRect = dialog.getBoundingClientRect();
        const scaleX = Math.min(.8, Math.max(.25, openingSheetRect.width / dialogRect.width));
        const scaleY = Math.min(.8, Math.max(.2, openingSheetRect.height / dialogRect.height));
        dialog.style.setProperty("--notebook-shift-x", `${openingSheetRect.left + openingSheetRect.width / 2 - (dialogRect.left + dialogRect.width / 2)}px`);
        dialog.style.setProperty("--notebook-shift-y", `${openingSheetRect.top + openingSheetRect.height / 2 - (dialogRect.top + dialogRect.height / 2)}px`);
        dialog.style.setProperty("--notebook-scale-x", String(scaleX));
        dialog.style.setProperty("--notebook-scale-y", String(scaleY));
      }
    }
    closeButton.focus();
    content.scrollTop = 0;
  };
  folder.addEventListener("pointerenter", (event) => { lastPointerType = event.pointerType; if (event.pointerType === "mouse" && performance.now() - lastScrollAt > 160) setFolderOpen(true); });
  folder.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    pendingTiltPoint = { x: event.clientX, y: event.clientY };
    if (tiltFrame) return;
    tiltFrame = requestAnimationFrame(() => {
      tiltFrame = 0;
      if (!pendingTiltPoint || !folder.isConnected) return;
      const rect = folder.getBoundingClientRect();
      const x = (pendingTiltPoint.x - rect.left) / rect.width - .5;
      const y = (pendingTiltPoint.y - rect.top) / rect.height - .5;
      folder.style.setProperty("--notebook-tilt-x", `${x * 2.4}deg`);
      folder.style.setProperty("--notebook-tilt-y", `${y * -1.8}deg`);
    });
  });
  folder.addEventListener("pointerleave", (event) => {
    lastPointerType = event.pointerType;
    pendingTiltPoint = null;
    if (tiltFrame) { cancelAnimationFrame(tiltFrame); tiltFrame = 0; }
    folder.style.setProperty("--notebook-tilt-x", "0deg");
    folder.style.setProperty("--notebook-tilt-y", "0deg");
    if (event.pointerType === "mouse" && activeIndex < 0 && performance.now() - lastScrollAt > 160) setFolderOpen(false);
  });
  const settleFolderAfterScroll = () => {
    lastScrollAt = performance.now();
    folder.classList.add("is-scrolling");
    window.clearTimeout(scrollSettleTimer);
    scrollSettleTimer = window.setTimeout(() => {
      folder.classList.remove("is-scrolling");
      if (activeIndex < 0) setFolderOpen(folder.matches(":hover") || folder.contains(document.activeElement));
    }, 180);
  };
  window.addEventListener("scroll", settleFolderAfterScroll, { passive: true });
  folder.addEventListener("focusin", () => setFolderOpen(true));
  folder.addEventListener("focusout", (event) => { if (!folder.contains(event.relatedTarget) && activeIndex < 0) setFolderOpen(false); });
  toggle.addEventListener("pointerdown", (event) => { lastPointerType = event.pointerType; });
  toggle.addEventListener("click", (event) => {
    if (event.detail === 0) setFolderOpen(true);
    else if (lastPointerType === "mouse") setFolderOpen(true);
    else setFolderOpen(!folder.classList.contains("is-open"));
  });
  sheets.forEach((sheet) => sheet.addEventListener("click", () => render(Number(sheet.dataset.notebookOpen) || 0)));
  const finishClose = () => { if (!dialog.open) return; if (closeTimer) window.clearTimeout(closeTimer); closeTimer = 0; closing = false; dialog.classList.remove("is-closing"); dialog.close(); };
  const requestClose = () => { if (!dialog.open || closing) return; closing = true; dialog.classList.add("is-closing"); const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; const mobilePaperMotion = window.matchMedia("(max-width:480px)").matches; closeTimer = window.setTimeout(finishClose, reducedMotion ? 0 : mobilePaperMotion ? 580 : 420); };
  closeButton.addEventListener("click", requestClose);
  dialog.querySelector("[data-notebook-prev]").addEventListener("click", () => render(activeIndex - 1));
  dialog.querySelector("[data-notebook-next]").addEventListener("click", () => render(activeIndex + 1));
  dialog.addEventListener("click", (event) => { if (event.target === dialog) requestClose(); });
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); requestClose(); });
  dialog.addEventListener("animationend", (event) => { if (event.target === dialog && ["p-notebook-dialog-out", "p-notebook-dialog-mobile-out"].includes(event.animationName)) finishClose(); });
  dialog.addEventListener("close", () => {
    if (closeTimer) window.clearTimeout(closeTimer);
    closeTimer = 0;
    closing = false;
    dialog.classList.remove("is-closing");
    dialog.classList.remove("is-paper-transition");
    ["--notebook-shift-x", "--notebook-shift-y", "--notebook-scale-x", "--notebook-scale-y"].forEach((property) => dialog.style.removeProperty(property));
    activeIndex = -1;
    setFolderOpen(false);
    if (previousOverflow) {
      document.body.style.overflow = previousOverflow.body;
      document.body.style.paddingRight = previousOverflow.bodyPaddingRight;
      document.documentElement.style.overflow = previousOverflow.root;
      previousOverflow = null;
    }
    window.dispatchEvent(new CustomEvent("portfolio:lenis-lock", { detail: false }));
    returnFocus?.focus();
  });
  window.addEventListener("pagehide", () => {
    window.clearTimeout(scrollSettleTimer);
    if (tiltFrame) cancelAnimationFrame(tiltFrame);
    window.removeEventListener("scroll", settleFolderAfterScroll);
  }, { once: true });
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) root.dataset.visible = "true";
  else {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      root.dataset.visible = "true";
      observer.disconnect();
    }, { threshold: .18 });
    observer.observe(root);
  }
})();
