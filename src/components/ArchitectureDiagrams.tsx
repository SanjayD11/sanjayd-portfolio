/**
 * Pure SVG architecture diagrams — responsive, theme-aware, lightweight.
 * Uses inline HSL vars for SVG compatibility.
 */

const boxW = 260;
const boxRad = 10;

const colors = {
  fill: "hsl(var(--card) / 0.6)",
  stroke: "hsl(var(--border))",
  strokeAccent: "hsl(var(--accent) / 0.5)",
  text: "hsl(var(--foreground))",
  textMuted: "hsl(var(--muted-foreground))",
  connector: "hsl(var(--primary) / 0.35)",
  arrowHead: "hsl(var(--primary) / 0.5)",
};

function renderBox(
  x: number, y: number, w: number, h: number,
  title: string, items: string[], accent = false
) {
  return (
    <g key={`box-${title}-${y}`}>
      <rect
        x={x} y={y} width={w} height={h} rx={boxRad}
        fill={colors.fill}
        stroke={accent ? colors.strokeAccent : colors.stroke}
        strokeWidth={1.2}
      />
      <text
        x={x + w / 2} y={y + 22}
        textAnchor="middle" fontSize={13} fontWeight={600}
        fill={colors.text}
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {title}
      </text>
      {items.map((item, i) => (
        <text
          key={i}
          x={x + 14} y={y + 42 + i * 17}
          fontSize={10.5}
          fill={colors.textMuted}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          • {item}
        </text>
      ))}
    </g>
  );
}

function renderArrow(x1: number, y1: number, x2: number, y2: number, key: string) {
  return (
    <line
      key={key}
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={colors.connector}
      strokeWidth={1.2}
      markerEnd="url(#diag-arrowhead)"
    />
  );
}

const DiagramWrapper = ({ children, viewBox, title }: { children: React.ReactNode; viewBox: string; title: string }) => (
  <div className="w-full animate-fade-in">
    <p className="text-xs text-muted-foreground mb-2 font-mono tracking-wider uppercase">{title}</p>
    <svg
      viewBox={viewBox}
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      style={{ maxHeight: 520, overflow: "visible" }}
    >
      <defs>
        <marker id="diag-arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="none" stroke={colors.arrowHead} strokeWidth="1" />
        </marker>
      </defs>
      {children}
    </svg>
  </div>
);

/* ── ResumeLens-AI ───────────────────────────────────────────────────────── */

export const ResumeLensDiagram = () => {
  const cx = 150, mid = cx + boxW / 2;
  return (
    <DiagramWrapper viewBox="0 0 560 470" title="ResumeLens-AI Architecture">
      {renderBox(cx, 10, boxW, 55, "User Layer", ["Student / Job Seeker"])}
      {renderArrow(mid, 65, mid, 90, "a1")}
      {renderBox(cx, 90, boxW, 125, "Streamlit UI", [
        "PDF Upload", "Trigger Analysis", "ATS Score / Skill Match %",
        "Readability Score", "Improvement Suggestions",
      ])}
      {renderArrow(mid, 215, mid, 240, "a2")}
      {renderBox(cx, 240, boxW, 55, "Resume Parser", ["PyPDF2 extraction"])}
      {renderArrow(mid, 295, mid, 320, "a3")}
      {renderBox(cx, 320, boxW, 80, "LLaMA 3 via Ollama", [
        "Skill Extraction / ATS Logic", "Readability Analysis", "Content Feedback",
      ], true)}
      {renderArrow(mid, 400, mid, 425, "a4")}
      {renderBox(cx, 425, boxW, 38, "Report (ReportLab)", [])}
    </DiagramWrapper>
  );
};

/* ── NourishNet ──────────────────────────────────────────────────────────── */

export const NourishNetDiagram = () => {
  const cx = 150, mid = cx + boxW / 2;
  return (
    <DiagramWrapper viewBox="0 0 560 530" title="NourishNet System Architecture">
      {renderBox(cx, 10, boxW, 55, "Users", ["Donor / Requester"])}
      {renderArrow(mid, 65, mid, 90, "a1")}
      {renderBox(cx, 90, boxW, 90, "Frontend (React + TS)", [
        "Share Food / Browse & Request", "Ratings / Notifications", "Vite Build",
      ])}
      {renderArrow(mid, 180, mid, 210, "a2")}
      {renderBox(cx, 210, boxW, 55, "Auth (Supabase)", ["Email/Password / JWT Session"])}
      {renderArrow(mid, 265, mid, 295, "a3")}
      {renderBox(cx, 295, boxW, 100, "PostgreSQL Database", [
        "Users / Food Posts", "Requests / Ratings", "Status Tracking",
      ], true)}
      {renderArrow(mid, 395, mid, 420, "a4")}
      {renderBox(cx, 420, boxW, 45, "Realtime", ["Subscriptions / Live Updates"])}
      {renderArrow(mid, 465, mid, 490, "a5")}
      {renderBox(cx, 490, boxW, 35, "Deployment", ["Vercel"])}
    </DiagramWrapper>
  );
};

/* ── IntelliVox ──────────────────────────────────────────────────────────── */

export const IntelliVoxDiagram = () => {
  const cx = 150, mid = cx + boxW / 2;
  return (
    <DiagramWrapper viewBox="0 0 560 480" title="IntelliVox AI Architecture">
      {renderBox(cx, 10, boxW, 40, "User", [])}
      {renderArrow(mid, 50, mid, 75, "a1")}
      {renderBox(cx, 75, boxW, 90, "Web App (React + TS)", [
        "Real-time Chat", "Streaming Responses", "Conversation History", "Usage Analytics",
      ])}
      {renderArrow(mid, 165, mid, 195, "a2")}
      {renderBox(cx, 195, boxW, 75, "AI Request Manager", [
        "Primary: Groq API", "Fallback: Pollinations API", "Automatic Failover",
      ], true)}
      {renderArrow(mid, 270, mid, 300, "a3")}
      {renderBox(cx, 300, boxW, 55, "Auth (Supabase)", ["JWT Sessions / Role-Based Auth"])}
      {renderArrow(mid, 355, mid, 380, "a4")}
      {renderBox(cx, 380, boxW, 90, "Database + Realtime", [
        "Users / Conversations", "Message Logs / Usage Metrics", "Live Chat Sync / Streaming UI",
      ])}
    </DiagramWrapper>
  );
};
