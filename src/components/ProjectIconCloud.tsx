import { useEffect, useMemo, useRef } from "react";

const technologies = [
  ["Java", "java", "ed8b00"],
  ["Spring", "spring", "6db33f"],
  ["React", "react", "61dafb"],
  ["TypeScript", "typescript", "3178c6"],
  ["JavaScript", "javascript", "f7df1e"],
  ["Python", "python", "3776ab"],
  ["MySQL", "mysql", "4479a1"],
  ["PostgreSQL", "postgresql", "4169e1"],
  ["Supabase", "supabase", "3fcf8e"],
  ["Firebase", "firebase", "ffca28"],
  ["Docker", "docker", "2496ed"],
  ["GitHub", "github", "181717"],
  ["Git", "git", "f05032"],
  ["Amazon Web Services", "amazonaws", "232f3e"],
  ["HTML5", "html5", "e34f26"],
  ["CSS3", "css3", "1572b6"],
  ["FastAPI", "fastapi", "009688"],
  ["Vercel", "vercel", "000000"],
  ["Postman", "postman", "ff6c37"],
  ["IntelliJ IDEA", "intellijidea", "000000"],
  ["Streamlit", "streamlit", "ff4b4b"],
  ["TensorFlow", "tensorflow", "ff6f00"],
] as const;

const goldenAngle = Math.PI * (3 - Math.sqrt(5));

export function ProjectIconCloud() {
  const cloudRef = useRef<HTMLDivElement>(null);
  const nodes = useMemo(
    () => technologies.map(([name, slug, color], index) => {
      const y = 1 - (index / (technologies.length - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const angle = goldenAngle * index;
      return {
        name,
        src: `https://cdn.simpleicons.org/${slug}/${color}`,
        x: Math.cos(angle) * radius,
        y,
        z: Math.sin(angle) * radius,
      };
    }),
    [],
  );

  useEffect(() => {
    const cloud = cloudRef.current;
    if (!cloud) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(cloud.querySelectorAll<HTMLElement>("[data-cloud-node]"));
    let frame = 0;
    let rotationX = 0;
    let rotationY = 0;
    let targetX = 0;
    let targetY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pointerTime = 0;
    let isDragging = false;
    let isHovering = false;
    let lastTime = 0;

    const render = (time: number) => {
      const delta = lastTime ? Math.min(time - lastTime, 40) : 16;
      lastTime = time;
      if (!reducedMotion && !isDragging) targetY += delta * (isHovering ? 0.00008 : 0.00012);
      if (!isDragging) {
        targetX += velocityX * delta;
        targetY += velocityY * delta;
        const damping = Math.pow(0.92, delta / 16.67);
        velocityX *= damping;
        velocityY *= damping;
      }
      const ease = 1 - Math.pow(0.82, delta / 16.67);
      rotationX += (targetX - rotationX) * ease;
      rotationY += (targetY - rotationY) * ease;

      const cosineY = Math.cos(rotationY);
      const sineY = Math.sin(rotationY);
      const cosineX = Math.cos(rotationX);
      const sineX = Math.sin(rotationX);
      const radius = Math.min(cloud.clientWidth, cloud.clientHeight) * 0.37;
      items.forEach((item) => {
        const x = Number(item.dataset.x);
        const y = Number(item.dataset.y);
        const z = Number(item.dataset.z);
        const yawX = x * cosineY - z * sineY;
        const yawZ = x * sineY + z * cosineY;
        const rotatedY = y * cosineX - yawZ * sineX;
        const rotatedZ = y * sineX + yawZ * cosineX;
        const depth = (rotatedZ + 1) / 2;
        const scale = 0.76 + depth * 0.34;
        item.style.transform = `translate3d(${yawX * radius}px, ${rotatedY * radius}px, 0) translate(-50%, -50%) scale(${scale})`;
        item.style.opacity = String(0.62 + depth * 0.38);
        item.style.zIndex = String(Math.round(depth * 100));
      });
      frame = window.requestAnimationFrame(render);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      isDragging = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerTime = performance.now();
      velocityX = 0;
      velocityY = 0;
      cloud.setPointerCapture(event.pointerId);
      cloud.classList.add("is-dragging");
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!isDragging) return;
      const now = performance.now();
      const elapsed = Math.max(now - pointerTime, 8);
      const deltaX = event.clientX - pointerX;
      const deltaY = event.clientY - pointerY;
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerTime = now;
      targetY -= deltaX * 0.006;
      targetX -= deltaY * 0.006;
      velocityY = Math.max(-0.014, Math.min(0.014, -deltaX * 0.006 / elapsed));
      velocityX = Math.max(-0.014, Math.min(0.014, -deltaY * 0.006 / elapsed));
    };
    const onPointerUp = () => {
      isDragging = false;
      cloud.classList.remove("is-dragging");
    };
    const onPointerEnter = () => { isHovering = true; };
    const onPointerLeave = () => { isHovering = false; };
    cloud.addEventListener("pointerdown", onPointerDown);
    cloud.addEventListener("pointermove", onPointerMove);
    cloud.addEventListener("pointerup", onPointerUp);
    cloud.addEventListener("pointercancel", onPointerUp);
    cloud.addEventListener("pointerenter", onPointerEnter);
    cloud.addEventListener("pointerleave", onPointerLeave);
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      cloud.removeEventListener("pointerdown", onPointerDown);
      cloud.removeEventListener("pointermove", onPointerMove);
      cloud.removeEventListener("pointerup", onPointerUp);
      cloud.removeEventListener("pointercancel", onPointerUp);
      cloud.removeEventListener("pointerenter", onPointerEnter);
      cloud.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div className="p-icon-cloud-wrap">
      <div className="p-icon-cloud-caption"><span>TOOLS IN MY WORK</span><span>DRAG TO EXPLORE</span></div>
      <div className="p-icon-cloud" ref={cloudRef} role="img" aria-label="Rotating cloud of technologies used across my projects">
        {nodes.map((node) => (
          <span
            className="p-icon-cloud-node"
            key={node.name}
            data-cloud-node
            data-x={node.x}
            data-y={node.y}
            data-z={node.z}
            title={node.name}
          >
            <img src={node.src} alt="" loading="lazy" draggable={false} onError={(event) => event.currentTarget.parentElement?.classList.add("has-icon-fallback")} />
            <span className="p-icon-cloud-fallback" aria-hidden="true">{node.name.slice(0, 2)}</span>
          </span>
        ))}
      </div>
      <p className="p-icon-cloud-note">A growing toolkit, shaped by building.</p>
    </div>
  );
}
