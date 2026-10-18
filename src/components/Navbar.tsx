import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Menu, X } from "lucide-react";
import { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [active, setActive] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navLinksRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  // IntersectionObserver for scrollspy
  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const best = visible.reduce((a, b) =>
            a.intersectionRatio > b.intersectionRatio ? a : b
          );
          setActive(best.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Pill position calculation
  const updatePill = useCallback(() => {
    const target = hovered ?? active;
    if (!target || !navLinksRef.current) {
      if (!active) setPillStyle((s) => ({ ...s, opacity: 0 }));
      return;
    }
    const containerRect = navLinksRef.current.getBoundingClientRect();
    const el = linkRefs.current.get(target);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPillStyle({
      left: rect.left - containerRect.left,
      width: rect.width,
      opacity: 1,
    });
  }, [hovered, active]);

  useLayoutEffect(() => {
    updatePill();
  }, [updatePill]);

  // Recalculate pill on resize
  useEffect(() => {
    const handler = () => updatePill();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [updatePill]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-4 md:gap-6"
        style={{
          maxWidth: "calc(100vw - 1.5rem)",
          width: "auto",
          boxSizing: "border-box",
        }}
      >
        <a href="#" className="font-bold text-gradient text-lg mr-1 md:mr-2 shrink-0">SD</a>

        {/* Desktop links with sliding pill */}
        <div
          ref={navLinksRef}
          className="hidden md:flex items-center gap-1 relative"
          onMouseLeave={() => setHovered(null)}
        >
          {/* Sliding pill background */}
          <span
            className="absolute inset-y-0 rounded-full pointer-events-none nav-pill-glow"
            style={{
              left: pillStyle.left,
              width: pillStyle.width,
              opacity: pillStyle.opacity,
              transition: "left 0.35s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
              willChange: "left, width",
            }}
            aria-hidden="true"
          />

          {links.map((link) => {
            const isActive = active === link.href.slice(1);
            const isHovered = hovered === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                ref={(el) => {
                  if (el) linkRefs.current.set(link.href.slice(1), el);
                }}
                onMouseEnter={() => setHovered(link.href.slice(1))}
                className="relative px-3 py-1.5 text-sm rounded-full z-10 select-none nav-link-hover"
                style={{
                  color:
                    isActive || isHovered
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted-foreground))",
                  fontWeight: isActive ? 600 : 400,
                  transition: "color 0.25s ease, font-weight 0.2s ease",
                }}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 ml-auto md:ml-2">
          <ThemeToggle />
          <a
            href="https://github.com/SanjayD11"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/sanjay-d-354776353"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} />
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center rounded-full text-foreground bg-primary/10 hover:bg-primary/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            style={{ zIndex: 60, width: 44, height: 44, minWidth: 44, minHeight: 44 }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm md:hidden"
              style={{ zIndex: 45 }}
              onClick={closeMobile}
              aria-hidden="true"
            />
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-20 left-1/2 -translate-x-1/2 md:hidden glass-strong rounded-2xl p-3 flex flex-col gap-1"
              style={{ zIndex: 55, width: "calc(100vw - 2rem)", maxWidth: 320 }}
            >
              {links.map((link) => {
                const isActive = active === link.href.slice(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className="px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98]"
                    style={{
                      color: isActive
                        ? "hsl(var(--primary))"
                        : "hsl(var(--foreground))",
                      background: isActive
                        ? "hsl(var(--primary) / 0.1)"
                        : "transparent",
                      borderLeft: isActive
                        ? "2px solid hsl(var(--primary) / 0.6)"
                        : "2px solid transparent",
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
