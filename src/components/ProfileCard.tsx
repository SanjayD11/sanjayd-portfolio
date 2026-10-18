import { memo, useEffect, useRef, type CSSProperties } from "react";

type ProfileCardProps = {
  avatarUrl: string;
  name: string;
  title: string;
  handle: string;
  status?: string;
  contactText?: string;
  holo?: number;
  glare?: number;
  tiltStrength?: number;
  parallax?: number;
  radius?: number;
  enableTilt?: boolean;
  intro?: boolean;
  showUserInfo?: boolean;
  onContactClick?: () => void;
  className?: string;
};

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

/**
 * React Bits ProfileCard, adapted only to use the portfolio's existing icon
 * set instead of introducing a second icon runtime. The motion engine and
 * visual variables follow the JS-CSS registry implementation.
 */
function ProfileCard({
  avatarUrl,
  name,
  title,
  handle,
  status = "Online",
  contactText = "Contact",
  holo = 0.8,
  glare = 0.5,
  tiltStrength = 12,
  parallax = 8,
  radius = 16,
  enableTilt = true,
  intro = true,
  showUserInfo = true,
  onContactClick,
  className = "",
}: ProfileCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const size = { width: root.offsetWidth, height: root.offsetHeight };
    const x = { position: 0, velocity: 0, target: 0 };
    const y = { position: 0, velocity: 0, target: 0 };
    const light = { position: 0, target: 0 };
    let frameId = 0;
    let lastFrame = 0;
    let slowUntil = 0;
    let activeTouchId: number | null = null;

    const write = () => {
      const activeTilt = enableTilt && !reducedMotion ? tiltStrength : 0;
      const reach = Math.min(1, Math.hypot(x.position, y.position));
      root.style.setProperty("--pc-light-x", `${((x.position + 1) * 0.5 * size.width).toFixed(1)}px`);
      root.style.setProperty("--pc-light-y", `${((y.position + 1) * 0.5 * size.height).toFixed(1)}px`);
      root.style.setProperty("--pc-pointer-x", `${((x.position + 1) * 50).toFixed(2)}%`);
      root.style.setProperty("--pc-pointer-y", `${((y.position + 1) * 50).toFixed(2)}%`);
      root.style.setProperty("--pc-band-x", `${(50 + x.position * 15).toFixed(2)}%`);
      root.style.setProperty("--pc-band-y", `${(50 + y.position * 15).toFixed(2)}%`);
      root.style.setProperty("--pc-rotate-x", `${(y.position * activeTilt).toFixed(3)}deg`);
      root.style.setProperty("--pc-rotate-y", `${(-x.position * activeTilt).toFixed(3)}deg`);
      root.style.setProperty("--pc-shift-x", `${(x.position * (reducedMotion ? 0 : parallax)).toFixed(2)}px`);
      root.style.setProperty("--pc-shift-y", `${(y.position * (reducedMotion ? 0 : parallax)).toFixed(2)}px`);
      root.style.setProperty("--pc-reach", reach.toFixed(4));
      root.style.setProperty("--pc-tilt", (reach * light.position).toFixed(4));
      root.style.setProperty("--pc-active", light.position.toFixed(4));
    };

    const animate = (now: number) => {
      const elapsed = Math.min(0.05, (now - lastFrame) / 1000 || 0);
      lastFrame = now;
      const slow = now < slowUntil;
      const stiffness = slow ? 24 : 120;
      const damping = slow ? 9 : 16;
      const steps = Math.max(1, Math.ceil(elapsed / (1 / 120)));
      const step = elapsed / steps;
      for (let index = 0; index < steps; index += 1) {
        for (const axis of [x, y]) {
          axis.velocity += (stiffness * (axis.target - axis.position) - damping * axis.velocity) * step;
          axis.position += axis.velocity * step;
        }
      }
      const tau = light.target > light.position ? 0.18 : slow ? 0.9 : 0.45;
      light.position += (light.target - light.position) * (1 - Math.exp(-elapsed / tau));
      write();
      const moving = Math.abs(x.target - x.position) > 0.0005 || Math.abs(y.target - y.position) > 0.0005 || Math.abs(x.velocity) > 0.0005 || Math.abs(y.velocity) > 0.0005 || Math.abs(light.target - light.position) > 0.002;
      if (moving) frameId = requestAnimationFrame(animate);
      else {
        x.position = x.target;
        y.position = y.target;
        light.position = light.target;
        write();
        frameId = 0;
      }
    };

    const wake = () => {
      if (frameId) return;
      lastFrame = performance.now();
      frameId = requestAnimationFrame(animate);
    };
    const aim = (nextX: number, nextY: number, lit = true) => {
      x.target = clamp(nextX, -1, 1);
      y.target = clamp(nextY, -1, 1);
      light.target = lit ? 1 : 0;
      slowUntil = 0;
      wake();
    };
    const aimAt = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      aim(((event.clientX - rect.left) / rect.width) * 2 - 1, ((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const release = () => aim(0, 0, false);
    const onEnter = (event: PointerEvent) => { if (event.pointerType === "mouse") aimAt(event); };
    const onMove = (event: PointerEvent) => { if (event.pointerType === "mouse" || event.pointerId === activeTouchId) aimAt(event); };
    const onLeave = (event: PointerEvent) => { if (event.pointerType === "mouse") release(); };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      activeTouchId = event.pointerId;
      aimAt(event);
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerId !== activeTouchId) return;
      activeTouchId = null;
      release();
    };

    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onUp);
    const observer = new ResizeObserver(() => {
      size.width = root.offsetWidth;
      size.height = root.offsetHeight;
      write();
    });
    observer.observe(root);

    if (intro && !reducedMotion) {
      x.position = 0.62;
      y.position = -0.55;
      light.position = 1;
      slowUntil = performance.now() + 1400;
      write();
      wake();
    } else write();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
    };
  }, [enableTilt, intro, parallax, tiltStrength]);

  const style = {
    "--pc-radius": `${Math.max(0, radius)}px`,
    "--pc-holo": clamp(holo, 0, 1),
    "--pc-glare": clamp(glare, 0, 1),
  } as CSSProperties;

  return <div ref={rootRef} className={`profile-card ${className}`.trim()} style={style}>
    <div className="profile-card__body">
      <div className="profile-card__tile">
        <span className="profile-card__sheen" />
        <span className="profile-card__holo" />
        <img className="profile-card__photo" src={avatarUrl} alt={name} draggable={false} />
        <span className="profile-card__scrim" />
        <div className="profile-card__info"><h3>{name}</h3><p>{title}</p></div>
        <span className="profile-card__tile-rim" />
      </div>
      {showUserInfo && <div className="profile-card__footer">
        <div className="profile-card__meta"><span className="profile-card__handle">@{handle}</span><span className="profile-card__status">{status}</span></div>
        <button type="button" className="profile-card__contact" onClick={onContactClick} aria-label={`${contactText} ${name}`}>
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3.75 5.75h16.5v12.5H3.75zM4.5 6.5 12 12l7.5-5.5" /></svg>{contactText}
        </button>
      </div>}
      <span className="profile-card__glare" /><span className="profile-card__shade" /><span className="profile-card__rim" />
    </div>
  </div>;
}

export default memo(ProfileCard);
