import { memo } from "react";

const codeSnippets = [
  { code: "public class Portfolio {}",             x: "4%",  y: "8%",  dur: "22s", delay: "0s"   },
  { code: 'System.out.println("Build > Talk");',   x: "70%", y: "14%", dur: "25s", delay: "3s"   },
  { code: "@RestController",                        x: "5%",  y: "44%", dur: "18s", delay: "6s"   },
  { code: "SELECT * FROM projects;",               x: "7%",  y: "70%", dur: "23s", delay: "1.5s" },
  { code: "const ai = new Model();",               x: "67%", y: "54%", dur: "20s", delay: "4.5s" },
  { code: "git commit -m 'ship it'",               x: "14%", y: "30%", dur: "17s", delay: "7s"   },
  { code: "import React from 'react';",            x: "60%", y: "83%", dur: "24s", delay: "0.5s" },
  { code: "CREATE TABLE skills;",                  x: "78%", y: "70%", dur: "21s", delay: "9s"   },
];

const AnimatedBackground = memo(() => {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, overflow: "hidden" }}
      aria-hidden="true"
    >
      {/* ── Animated diagonal background gradient ─────────────────────────── */}
      <div className="absolute inset-0 page-bg-gradient" />

      {/* ── Soft light bloom 1 — primary ────────────────────────────────── */}
      <div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          background: "hsl(var(--primary))",
          opacity: 0.07,
          filter: "blur(120px)",
          top: "5%",
          left: "10%",
          animation: "bloom-drift-1 25s ease-in-out infinite",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />
      {/* ── Soft light bloom 2 — accent ─────────────────────────────────── */}
      <div
        className="absolute rounded-full"
        style={{
          width: 450,
          height: 450,
          background: "hsl(var(--accent))",
          opacity: 0.06,
          filter: "blur(100px)",
          bottom: "10%",
          right: "8%",
          animation: "bloom-drift-2 30s ease-in-out infinite",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />

      {/* ── Subtle grid pattern — untouched ──────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.035) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--primary) / 0.035) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Floating code snippets ────────────────────────────────────────── */}
      {codeSnippets.map((s, i) => (
        <span
          key={i}
          className="absolute font-mono text-[10px] select-none pointer-events-none hidden md:inline"
          style={{
            left: s.x,
            top: s.y,
            color: "hsl(var(--primary))",
            opacity: 0,
            filter: "blur(0.5px)",
            animation: `bg-snippet-anim ${s.dur} ease-in-out ${s.delay} infinite`,
            willChange: "transform, opacity",
            transform: "translateZ(0)",
          }}
        >
          {s.code}
        </span>
      ))}
    </div>
  );
});

AnimatedBackground.displayName = "AnimatedBackground";
export default AnimatedBackground;
