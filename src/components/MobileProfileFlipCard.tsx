import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import * as THREE from "../vendor/three.module.js";
import ProfileCard from "./ProfileCard";

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

/** Three.js-driven 3D flip card, mounted only under the portfolio desktop breakpoint. */
export default function MobileProfileFlipCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const turnRef = useRef<((next: boolean) => void) | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const media = window.matchMedia("(max-width: 850px)");
    if (!media.matches) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stage = card.querySelector<HTMLElement>(".p-mobile-flip__turntable");
    if (!stage) return;

    const tilt = new THREE.Vector2(0, 0);
    const tiltTarget = new THREE.Vector2(0, 0);
    const turn = { value: 0, target: 0 };
    const transform = new THREE.Object3D();
    transform.rotation.order = "YXZ";
    let frame = 0;
    let last = 0;
    let activePointer: number | null = null;

    const render = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      if (reducedMotion) {
        turn.value = turn.target;
        tilt.copy(tiltTarget);
      } else {
        turn.value = THREE.MathUtils.damp(turn.value, turn.target, 8.5, delta);
        tilt.x = THREE.MathUtils.damp(tilt.x, tiltTarget.x, 9, delta);
        tilt.y = THREE.MathUtils.damp(tilt.y, tiltTarget.y, 9, delta);
        if (Math.abs(turn.value - turn.target) < 0.0005) turn.value = turn.target;
        if (Math.abs(tilt.x - tiltTarget.x) < 0.0005) tilt.x = tiltTarget.x;
        if (Math.abs(tilt.y - tiltTarget.y) < 0.0005) tilt.y = tiltTarget.y;
      }

      transform.rotation.set(tilt.y * 0.075, Math.PI * turn.value, -tilt.x * 0.075, "YXZ");
      transform.updateMatrix();
      stage.style.transform = `matrix3d(${transform.matrix.elements.join(",")})`;

      if (turn.value !== turn.target || tilt.x !== tiltTarget.x || tilt.y !== tiltTarget.y) frame = requestAnimationFrame(render);
      else frame = 0;
    };
    const wake = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(render);
    };
    const point = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      tiltTarget.set(clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1), clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1));
      wake();
    };
    const onEnter = (event: PointerEvent) => { if (event.pointerType === "mouse") point(event); };
    const onMove = (event: PointerEvent) => { if (event.pointerType === "mouse" || event.pointerId === activePointer) point(event); };
    const resetTilt = () => { tiltTarget.set(0, 0); wake(); };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      activePointer = event.pointerId;
      point(event);
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerId !== activePointer) return;
      activePointer = null;
      resetTilt();
    };
    turnRef.current = (next) => {
      turn.target = next ? 1 : 0;
      wake();
    };

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", resetTilt);
    card.addEventListener("pointerdown", onDown);
    card.addEventListener("pointerup", onUp);
    card.addEventListener("pointercancel", onUp);
    wake();
    return () => {
      cancelAnimationFrame(frame);
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", resetTilt);
      card.removeEventListener("pointerdown", onDown);
      card.removeEventListener("pointerup", onUp);
      card.removeEventListener("pointercancel", onUp);
      turnRef.current = null;
    };
  }, []);

  useEffect(() => {
    const faces = cardRef.current?.querySelectorAll<HTMLElement>(".p-mobile-flip__face");
    faces?.forEach((face) => {
      face.inert = face.classList.contains("p-mobile-flip__quote-face") ? flipped : !flipped;
    });
  }, [flipped]);

  const toggle = () => {
    const next = !flipped;
    setFlipped(next);
    turnRef.current?.(next);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  };

  return <div
    ref={cardRef}
    className="p-mobile-flip"
    role="group"
    tabIndex={0}
    data-flipped={flipped}
    aria-label={flipped ? "Profile card shown. Activate to turn back to the quote." : "Profile quote shown. Activate to reveal the profile card."}
    onClick={(event) => { if (!(event.target as HTMLElement).closest("a,button")) toggle(); }}
    onKeyDown={onKeyDown}
  >
    <div className="p-mobile-flip__turntable">
      <div className="p-mobile-flip__face p-mobile-flip__quote-face" aria-hidden={flipped}>
        <span className="p-mobile-flip__eyebrow">A NOTE ON BUILDING</span>
        <blockquote>“Make it useful.<br />Make it clear.<br /><em>Keep learning.</em>”</blockquote>
        <span className="p-mobile-flip__signature">— SANJAY D.</span>
        <button type="button" className="p-mobile-flip__reveal" onClick={(event) => { event.stopPropagation(); toggle(); }}>TAP TO REVEAL <b aria-hidden="true">↗</b></button>
      </div>
      <div className="p-mobile-flip__face p-mobile-flip__profile-face" aria-hidden={!flipped}>
        <ProfileCard
          name="Sanjay Dharmarajou"
          title="CS Undergraduate · Builder"
          handle="SanjayD11"
          status="Online"
          contactText="Contact"
          avatarUrl="/images/portfolio-profile-card.png"
          holo={0.8}
          glare={0.5}
          tiltStrength={0}
          parallax={0}
          radius={16}
          enableTilt={false}
          intro={false}
          showUserInfo
          onContactClick={() => { window.location.href = "mailto:sanjayraju5164@gmail.com"; }}
          className="p-mobile-flip__profile"
        />
      </div>
    </div>
  </div>;
}
