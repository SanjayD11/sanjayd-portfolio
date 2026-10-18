import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, FileText, X } from "lucide-react";

type NotebookNote = {
  title: string;
  eyebrow: string;
  summary: string;
  mark: string;
  content: ReactNode;
};

const notes: NotebookNote[] = [
  {
    title: "Engineering Principles",
    eyebrow: "01 / Foundations",
    summary: "Make the next change easier to understand.",
    mark: "01",
    content: <>
      <p className="p-notebook-lede">The projects here document a consistent focus on readable structure, clear boundaries, and changes that remain understandable.</p>
      <h3>Layered responsibilities</h3>
      <p>CodeSentry separates its React client, Java Spring Boot REST API, scan services, and JPA-backed persistence. This gives interface, application, and data work distinct responsibilities within the documented flow.</p>
      <div className="p-notebook-diagram" role="img" aria-label="A project flow from interface to application logic to persistence"><span>Interface</span><i>→</i><span>Application logic</span><i>→</i><span>Persistence</span></div>
      <h3>Maintainability in practice</h3>
      <p>Validation and persistence live with the backend flow that owns them, while the client focuses on user interaction. The separation keeps the main system path easier to follow as features are added.</p>
      <p className="p-notebook-callout">A clear boundary makes the purpose of each layer easier to explain, review, and extend.</p>
    </>,
  },
  {
    title: "Security by Design",
    eyebrow: "02 / Trust boundaries",
    summary: "Validate inputs before they become trusted data.",
    mark: "02",
    content: <>
      <p className="p-notebook-lede">Security checks are part of the request flow, beginning where external data enters the application.</p>
      <h3>Input validation at the boundary</h3>
      <p>CodeSentry checks archive integrity, file extensions, and duplicate files before scanning. Its authenticated routes use Spring Security and JWT, with authorization enforced by the server.</p>
      <pre className="p-notebook-code"><code>{`// Illustrative Spring validation pattern\nrecord ScanRequest(\n  @NotBlank String projectId,\n  @NotEmpty List<@Valid SourceFile> files\n) {}\n\n@PostMapping("/scans")\nScanResult scan(@Valid @RequestBody ScanRequest request) {\n  return scanService.start(request);\n}`}</code></pre>
      <h3>Scope and review</h3>
      <p>Static rules provide repeatable signals that can be reviewed alongside file evidence. AI-generated explanations add context, but neither the analysis nor its guidance guarantees detection or replaces a security audit. Spring Security is an area of practical, foundational experience.</p>
    </>,
  },
  {
    title: "Problem Solving",
    eyebrow: "03 / Method",
    summary: "Turn a vague problem into testable steps.",
    mark: "03",
    content: <>
      <p className="p-notebook-lede">Problem-solving practice turns larger tasks into a sequence of clear, verifiable steps.</p>
      <ol className="p-notebook-steps"><li><b>Clarify</b><span>Record the input, expected result, and constraints.</span></li><li><b>Break down</b><span>Separate the main path from validation and failure cases.</span></li><li><b>Trace</b><span>Work through a small example and its boundary cases.</span></li><li><b>Debug</b><span>Use evidence to isolate a cause, then verify the change.</span></li></ol>
      <h3>Java and DSA practice</h3>
      <p>Java is the primary language for coding practice across LeetCode and SkillRack. That work reinforces data structures, algorithms, logical tracing, and attention to empty input, invalid states, duplicates, and limits.</p>
      <p className="p-notebook-callout">A reduced example often makes the failing assumption or boundary easier to identify.</p>
    </>,
  },
  {
    title: "Backend Engineering",
    eyebrow: "04 / APIs & data",
    summary: "Design endpoints around clear contracts and useful failures.",
    mark: "04",
    content: <>
      <p className="p-notebook-lede">The CodeSentry backend connects REST endpoints, application services, persistence, authentication, and reporting in a Java-based workflow.</p>
      <div className="p-notebook-diagram" role="img" aria-label="Request flows through validation, service logic, database, and response"><span>Request</span><i>→</i><span>Validate</span><i>→</i><span>Service</span><i>→</i><span>Database</span><i>→</i><span>Response</span></div>
      <h3>Persistence and API behavior</h3>
      <p>Spring Data JPA and MySQL store the project, scan, file, and finding data described in the project architecture. Postman supports request and response checks while developing API behavior.</p>
      <h3>Error handling</h3>
      <p>Request validation and clear failure responses help callers understand rejected input without exposing implementation details. These practices support a predictable REST contract as the backend grows.</p>
      <p className="p-notebook-tags"><span>Java</span><span>Spring Boot</span><span>REST</span><span>JPA</span><span>MySQL</span></p>
    </>,
  },
  {
    title: "Learnings & Trade-offs",
    eyebrow: "05 / Reflection",
    summary: "Every useful design has a scope and a cost.",
    mark: "05",
    content: <>
      <p className="p-notebook-lede">The project work captures decisions made within real constraints—and the lessons those choices leave behind.</p>
      <h3>Repeatability with useful context</h3>
      <p>CodeSentry runs deterministic checks before adding AI-assisted explanations. The rules provide repeatable findings; generated guidance adds context but still needs review and remains limited by rule coverage.</p>
      <h3>Resilience and added complexity</h3>
      <p>IntelliVox routes to a fallback provider when its primary route is unavailable. Florentix AI also documents a fallback inference path. These alternatives improve continuity while adding configuration and additional failure cases to manage.</p>
      <h3>Learning in progress</h3>
      <p>Current development is focused on deeper Java backend practice, database design, testing, and independent frontend fluency. Reviewing alternatives and refining earlier decisions remain part of that ongoing learning.</p>
      <p className="p-notebook-callout">That balance keeps trade-offs visible and leaves room to adjust as requirements become clearer.</p>
    </>,
  },
];

const EngineeringNotebook = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [folderOpen, setFolderOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const lastPointerTypeRef = useRef("");
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const previousOverflowRef = useRef<{ body: string; root: string; bodyPaddingRight: string } | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      root.dataset.visible = "true";
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      root.dataset.visible = "true";
      observer.disconnect();
    }, { threshold: 0.18 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (activeIndex !== null) {
      if (!dialog.open) {
        returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        previousOverflowRef.current = {
          body: document.body.style.overflow,
          root: document.documentElement.style.overflow,
          bodyPaddingRight: document.body.style.paddingRight,
        };
        const scrollbarGap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
        if (scrollbarGap > 0) {
          const currentPaddingRight = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
          document.body.style.paddingRight = `${currentPaddingRight + scrollbarGap}px`;
        }
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        window.dispatchEvent(new CustomEvent("portfolio:lenis-lock", { detail: true }));
        dialog.showModal();
      }
      wasOpenRef.current = true;
      closeRef.current?.focus();
    } else if (wasOpenRef.current) {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflowRef.current?.body ?? "";
      document.body.style.paddingRight = previousOverflowRef.current?.bodyPaddingRight ?? "";
      document.documentElement.style.overflow = previousOverflowRef.current?.root ?? "";
      window.dispatchEvent(new CustomEvent("portfolio:lenis-lock", { detail: false }));
      wasOpenRef.current = false;
      returnFocusRef.current?.focus();
    }
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex !== null && contentRef.current) contentRef.current.scrollTop = 0;
  }, [activeIndex]);

  useEffect(() => () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    if (!wasOpenRef.current) return;
    document.body.style.overflow = previousOverflowRef.current?.body ?? "";
    document.body.style.paddingRight = previousOverflowRef.current?.bodyPaddingRight ?? "";
    document.documentElement.style.overflow = previousOverflowRef.current?.root ?? "";
    window.dispatchEvent(new CustomEvent("portfolio:lenis-lock", { detail: false }));
  }, []);

  const close = () => {
    setFolderOpen(false);
    if (!dialogRef.current?.open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsClosing(false);
      setActiveIndex(null);
      return;
    }
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setIsClosing(false);
      setActiveIndex(null);
    }, 420);
  };
  const toggleFolder = (detail: number) => {
    if (detail > 0 && lastPointerTypeRef.current === "mouse") setFolderOpen(true);
    else setFolderOpen((open) => !open);
  };
  const changeNote = (direction: number) => setActiveIndex((current) => current === null ? 0 : (current + direction + notes.length) % notes.length);

  return <>
    <section className="p-section p-engineering-section" id="engineering" aria-labelledby="engineering-title">
      <div className="p-section-heading p-reveal"><div><span className="p-kicker">02 / Engineering notebook</span><h2 id="engineering-title">The Engineering<br /><em>Notebook.</em></h2></div><p className="p-section-intro">I maintain this notebook with care, keeping each page clear, considered, and grounded in the work.</p></div>
      <div className="p-notebook" ref={rootRef} data-visible="false">
        <div className="p-notebook-caption"><span><BookOpen size={15} /> FIELD NOTES / 2026</span><span>SELECT A PAGE TO EXPLORE <ArrowDownRightIcon /></span></div>
        <div className={`p-folder-stage${folderOpen ? " is-open" : ""}`} role="group" aria-label="Five engineering notebook documents" onPointerEnter={(event) => { lastPointerTypeRef.current = event.pointerType; if (event.pointerType === "mouse") setFolderOpen(true); }} onPointerMove={(event) => { if (event.pointerType !== "mouse") return; const rect = event.currentTarget.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width - .5; const y = (event.clientY - rect.top) / rect.height - .5; event.currentTarget.style.setProperty("--notebook-tilt-x", `${x * 3.2}deg`); event.currentTarget.style.setProperty("--notebook-tilt-y", `${y * -2.4}deg`); }} onPointerLeave={(event) => { lastPointerTypeRef.current = event.pointerType; event.currentTarget.style.setProperty("--notebook-tilt-x", "0deg"); event.currentTarget.style.setProperty("--notebook-tilt-y", "0deg"); if (event.pointerType === "mouse" && activeIndex === null) setFolderOpen(false); }} onFocusCapture={() => setFolderOpen(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null) && activeIndex === null) setFolderOpen(false); }}>
          <button className="p-folder-toggle" type="button" onPointerDown={(event) => { lastPointerTypeRef.current = event.pointerType; }} onClick={(event) => toggleFolder(event.detail)} aria-expanded={folderOpen} aria-label={folderOpen ? "Close engineering notebook folder" : "Open engineering notebook folder"} />
          <div className="p-folder-back" aria-hidden="true"><span className="p-folder-tab">ENGINEERING NOTES</span></div>
          {notes.map((note, index) => <button
            key={note.mark}
            className={`p-notebook-sheet${activeIndex === index ? " is-selected" : ""}`}
            style={{ "--sheet-index": index, "--open-offset": `${index * 14}%`, "--mobile-open-offset": `${index * 12.5}%`, "--closed-offset": `${(index - 2) * 2.2}%`, "--closed-rise": `${(index - 2) * 4}px`, "--sheet-delay": `${index * 55}ms`, "--sheet-turn": `${(index - 2) * 1.5}deg` } as CSSProperties}
            type="button"
            tabIndex={folderOpen ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            aria-haspopup="dialog"
            aria-label={`Open note ${note.mark}: ${note.title}`}
          ><span className="p-notebook-sheet-top"><span>{note.eyebrow}</span><FileText size={15} aria-hidden="true" /></span><strong>{note.title}</strong><span className="p-notebook-sheet-summary">{note.summary}</span><span className="p-notebook-sheet-lines" aria-hidden="true"><i /><i /><i /></span><span className="p-notebook-sheet-sketch" aria-hidden="true" /><span className="p-notebook-sheet-open">OPEN NOTE <ArrowUpRight size={12} /></span></button>)}
          <div className="p-folder-front" aria-hidden="true"><div className="p-folder-front-meta"><b>The Engineering Notebook</b><span className="p-folder-count">05 PAGES</span></div></div>
        </div>
        <div className="p-notebook-footer"><span>MAINTAINABILITY · TRUST · CURIOSITY</span><span>MADE FROM PROJECTS, PRACTICE & CONTINUOUS LEARNING</span></div>
      </div>
    </section>
    <dialog className={`p-notebook-dialog${isClosing ? " is-closing" : ""}`} ref={dialogRef} aria-labelledby="p-notebook-dialog-title" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="p-cursor p-cursor-modal" aria-hidden="true"><svg className="p-cursor-plane" viewBox="0 0 16 16" focusable="false"><path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" /></svg><svg className="p-cursor-hand" viewBox="0 0 22 24" focusable="false"><path d="M8 12V4.8a1.35 1.35 0 0 1 2.7 0v4.7-1a1.3 1.3 0 0 1 2.6 0v1.1-.35a1.25 1.25 0 0 1 2.5 0v1.3-.05a1.25 1.25 0 0 1 2.5 0v4.1a6 6 0 0 1-6 6h-.7a5.2 5.2 0 0 1-4.1-2l-3.5-4.2a1.4 1.4 0 0 1 2.2-1.8L8 15z" /></svg></div>
      {activeIndex !== null && <article className="p-notebook-dialog-shell" data-lenis-prevent>
        <header className="p-notebook-dialog-header"><div><span className="p-kicker">{notes[activeIndex].eyebrow} · FIELD NOTES</span><h2 id="p-notebook-dialog-title">{notes[activeIndex].title}</h2><p>{notes[activeIndex].summary}</p></div><button ref={closeRef} className="p-notebook-close" type="button" onClick={close} aria-label="Close engineering note"><X size={19} /></button></header>
        <div className="p-notebook-dialog-content" ref={contentRef}>{notes[activeIndex].content}</div>
        <footer className="p-notebook-dialog-footer"><button type="button" onClick={() => changeNote(-1)}><ArrowLeft size={15} /> Previous</button><span>{String(activeIndex + 1).padStart(2, "0")} / {String(notes.length).padStart(2, "0")}</span><button type="button" onClick={() => changeNote(1)}>Next <ArrowRight size={15} /></button></footer>
      </article>}
    </dialog>
  </>;
};

const ArrowDownRightIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 3l10 10M5 13h8V5" stroke="currentColor" strokeWidth="1.3" /></svg>;

export default EngineeringNotebook;
