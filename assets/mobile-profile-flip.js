(() => {
  const media = window.matchMedia("(max-width: 850px)");

  const mount = (root) => {
    if (root.dataset.flipReady === "true" || !window.THREE) return () => {};
    root.dataset.flipReady = "true";
    const stage = root.querySelector(".p-mobile-flip__turntable");
    const quote = root.querySelector('[data-flip-face="quote"]');
    const profile = root.querySelector('[data-flip-face="profile"]');
    if (!stage || !quote || !profile) return () => { delete root.dataset.flipReady; };

    const THREE = window.THREE;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tilt = new THREE.Vector2(0, 0);
    const tiltTarget = new THREE.Vector2(0, 0);
    const transform = new THREE.Object3D();
    transform.rotation.order = "YXZ";
    let progress = root.dataset.flipped === 'true' ? 1 : 0;
    let target = progress;
    let frame = 0;
    let last = 0;
    let activePointer = null;

    const paint = () => {
      transform.rotation.set(tilt.y * .075, Math.PI * progress, -tilt.x * .075, "YXZ");
      transform.updateMatrix();
      stage.style.transform = `matrix3d(${transform.matrix.elements.join(",")})`;
    };
    const render = (now) => {
      const delta = Math.min(.05, (now - last) / 1000 || 0);
      last = now;
      if (reducedMotion) {
        progress = target;
        tilt.copy(tiltTarget);
      } else {
        progress = THREE.MathUtils.damp(progress, target, 8.5, delta);
        tilt.x = THREE.MathUtils.damp(tilt.x, tiltTarget.x, 9, delta);
        tilt.y = THREE.MathUtils.damp(tilt.y, tiltTarget.y, 9, delta);
        if (Math.abs(progress - target) < .0005) progress = target;
        if (Math.abs(tilt.x - tiltTarget.x) < .0005) tilt.x = tiltTarget.x;
        if (Math.abs(tilt.y - tiltTarget.y) < .0005) tilt.y = tiltTarget.y;
      }
      paint();
      if (progress !== target || tilt.x !== tiltTarget.x || tilt.y !== tiltTarget.y) frame = requestAnimationFrame(render);
      else frame = 0;
    };
    const wake = () => { if (!frame) { last = performance.now(); frame = requestAnimationFrame(render); } };
    const setTurn = (flipped) => {
      root.dataset.flipped = String(flipped);
      root.setAttribute("aria-label", flipped ? "Profile photo shown. Activate the card to return to the quote." : "Profile quote shown. Activate to reveal the profile photo.");
      quote.setAttribute("aria-hidden", String(flipped));
      profile.setAttribute("aria-hidden", String(!flipped));
      quote.inert = flipped;
      profile.inert = !flipped;
      target = flipped ? 1 : 0;
      if (reducedMotion) { progress = target; paint(); }
      else wake();
    };
    const toggle = () => setTurn(root.dataset.flipped !== "true");
    const point = (event) => {
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      tiltTarget.set(THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1), THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1));
      wake();
    };
    const onClick = (event) => {
      if (event.target.closest("a")) return;
      if (event.target.closest("[data-flip-toggle]")) { toggle(); return; }
      toggle();
    };
    const onKeyDown = (event) => {
      if (event.target !== root || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      toggle();
    };
    const onEnter = (event) => { if (event.pointerType === "mouse") point(event); };
    const onMove = (event) => { if (event.pointerType === "mouse" || event.pointerId === activePointer) point(event); };
    const resetTilt = () => { tiltTarget.set(0, 0); wake(); };
    const onDown = (event) => { if (event.pointerType !== "mouse") { activePointer = event.pointerId; point(event); } };
    const onUp = (event) => { if (event.pointerId === activePointer) { activePointer = null; resetTilt(); } };

    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKeyDown);
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", resetTilt);
    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onUp);
    quote.setAttribute('aria-hidden', String(progress === 1));
    profile.setAttribute('aria-hidden', String(progress !== 1));
    quote.inert = progress === 1;
    profile.inert = progress !== 1;
    paint();
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", resetTilt);
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
      delete root.dataset.flipReady;
    };
  };

  const roots = Array.from(document.querySelectorAll("[data-mobile-profile-flip]"));
  let cleanups = [];
  const sync = () => {
    cleanups.forEach((cleanup) => cleanup());
    cleanups = media.matches ? roots.map(mount) : [];
  };
  sync();
  media.addEventListener("change", sync);
})();
