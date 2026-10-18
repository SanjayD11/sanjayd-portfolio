import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const items = [
  {
    label: "Explore",
    description: "Selected work, and the thinking behind it.",
    links: [
      { label: "Selected work", href: "#work" },
      { label: "About me", href: "#about" },
    ],
  },
  {
    label: "Engineering",
    description: "Tools, principles, and field notes.",
    links: [
      { label: "Toolbox", href: "#elsewhere" },
      { label: "Notebook", href: "#engineering" },
    ],
  },
  {
    label: "Connect",
    description: "Open to thoughtful projects and conversations.",
    links: [
      { label: "Contact", href: "#contact" },
      { label: "Email", href: "mailto:sanjayraju5164@gmail.com" },
    ],
  },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const easeOut = (value: number) => 1 - (1 - value) ** 3;

export default function MobileCardNav() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const openRef = useRef(open);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const engineRef = useRef<{ wake: () => void; refresh: () => void } | null>(null);
  openRef.current = open;

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel || !content) return;
    const media = window.matchMedia("(max-width: 620px)");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = { progress: 0, velocity: 0, height: 0 };
    let raf = 0;
    let last = 0;
    let alive = true;

    const measure = () => {
      const style = getComputedStyle(panel);
      const borders = (Number.parseFloat(style.borderTopWidth) || 0) + (Number.parseFloat(style.borderBottomWidth) || 0);
      state.height = content.getBoundingClientRect().height + borders;
      wake();
    };

    const render = () => {
      const progress = Math.max(0, state.progress);
      panel.style.height = `${progress * state.height}px`;
      panel.style.opacity = `${clamp(progress * 1.65, 0, 1)}`;
      panel.style.visibility = openRef.current || progress > 0.002 ? "visible" : "hidden";
      panel.style.pointerEvents = openRef.current ? "auto" : "none";

      const cards = cardRefs.current.filter((card): card is HTMLElement => Boolean(card));
      const lag = cards.length > 1 ? Math.min(0.12, 0.7 / (cards.length - 1)) : 0;
      const span = 1 - lag * (cards.length - 1);
      cards.forEach((card, index) => {
        const local = clamp((state.progress - index * lag) / Math.max(span, 0.05), 0, 1);
        const eased = easeOut(local);
        card.style.opacity = `${clamp(local * 1.8, 0, 1)}`;
        card.style.transform = `translateY(${(1 - eased) * 17}px) scale(${0.985 + eased * 0.015})`;
      });
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const target = openRef.current ? 1 : 0;
      if (reducedMotion) {
        state.progress = target;
        state.velocity = 0;
      } else {
        const stiffness = 160;
        const dampingRatio = openRef.current ? 0.84 : 1;
        const steps = Math.ceil(dt / (1 / 240));
        const step = dt / steps;
        for (let index = 0; index < steps; index += 1) {
          state.velocity += (-stiffness * (state.progress - target) - 2 * dampingRatio * Math.sqrt(stiffness) * state.velocity) * step;
          state.progress += state.velocity * step;
        }
      }

      const done = Math.abs(state.progress - target) < 0.0005 && Math.abs(state.velocity) < 0.002;
      if (done) {
        state.progress = target;
        state.velocity = 0;
      }
      render();
      if (!done && alive) raf = requestAnimationFrame(tick);
    };

    function wake() {
      if (!raf && alive) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    }

    engineRef.current = { wake, refresh: measure };
    measure();
    render();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    const onBreakpointChange = (event: MediaQueryListEvent) => {
      if (!event.matches) setOpen(false);
    };
    media.addEventListener("change", onBreakpointChange);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      media.removeEventListener("change", onBreakpointChange);
      engineRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    engineRef.current?.wake();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && (panelRef.current?.contains(event.target) || buttonRef.current?.contains(event.target))) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`p-icon-button p-menu-button${open ? " is-open" : ""}`}
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls={id}
      >
        <span className={`p-menu-glyph${open ? " is-open" : ""}`} aria-hidden="true"><i /><i /></span>
      </button>
      <nav
        ref={panelRef}
        id={id}
        className={`p-mobile-cardnav-panel${open ? " is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        <div ref={contentRef} className="p-mobile-cardnav-content">
          {items.map((item, index) => (
            <article
              key={item.label}
              ref={(element) => { cardRefs.current[index] = element; }}
              className="p-mobile-cardnav-card"
            >
              <div className="p-mobile-cardnav-card-head">
                <span className="p-mobile-cardnav-label">{item.label}</span>
                <p className="p-mobile-cardnav-description">{item.description}</p>
              </div>
              <div className="p-mobile-cardnav-links">
                {item.links.map((link) => (
                  <a key={link.href} href={link.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
                    <span>{link.label}</span><ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </article>
          ))}
          <div ref={(element) => { cardRefs.current[items.length] = element; }} className="p-mobile-cardnav-cta-wrap">
            <a className="p-mobile-cardnav-cta" href="#contact" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
              Let’s connect <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
