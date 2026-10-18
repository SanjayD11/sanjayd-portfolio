import { useEffect, useRef } from "react";
import { ArrowUpRight, ExternalLink, Github, X } from "lucide-react";

export type ProjectDetails = {
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  categoryDetail: string;
  architectureTitle: string;
  stack: string[];
  overview: string;
  problem: string;
  features: string[];
  architecture: string;
  implementation: string;
  contribution: string;
  repository: string;
  live?: string;
  documentation?: string;
};

type Props = { project: ProjectDetails | null; onClose: () => void };

const ProjectDetailsDialog = ({ project, onClose }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const closeButton = closeRef.current;
    if (!dialog || !closeButton || !project) return;
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    const previousBodyPaddingRight = document.body.style.paddingRight;
    let closing = false;
    const finishClose = () => {
      if (!dialog.open) return;
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
      dialog.classList.remove("is-closing");
      dialog.close();
    };
    const requestClose = () => {
      if (!dialog.open || closing) return;
      closing = true;
      dialog.classList.add("is-closing");
      closeTimerRef.current = window.setTimeout(finishClose, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 420);
    };
    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.target === dialog && event.animationName === "p-detail-dialog-out") finishClose();
    };
    const onBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog) requestClose();
    };
    const onCancel = (event: Event) => {
      event.preventDefault();
      requestClose();
    };
    dialog.classList.remove("is-closing");
    const scrollbarGap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    if (scrollbarGap > 0) {
      const currentPaddingRight = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPaddingRight + scrollbarGap}px`;
    }
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("portfolio:lenis-lock", { detail: true }));
    dialog.showModal();
    closeRef.current?.focus();
    closeButton.addEventListener("click", requestClose);
    dialog.addEventListener("click", onBackdropClick);
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("animationend", onAnimationEnd);
    return () => {
      closeButton.removeEventListener("click", requestClose);
      dialog.removeEventListener("click", onBackdropClick);
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("animationend", onAnimationEnd);
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
      dialog.classList.remove("is-closing");
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;
      document.documentElement.style.overflow = previousRootOverflow;
      window.dispatchEvent(new CustomEvent("portfolio:lenis-lock", { detail: false }));
      returnFocusRef.current?.focus();
    };
  }, [project]);

  if (!project) return null;

  const imagePath = `/assets/architecture/${project.slug}.png`;
  const projectLogos: Record<string, { src: string; alt: string }> = {
    codesentry: { src: "/assets/logos/codesentry.png", alt: "CodeSentry shield and wordmark" },
    nourishnet: { src: "/assets/logos/nourishnet.png", alt: "NourishNet leaf mark and wordmark" },
    resumelens: { src: "/assets/logos/resumelens.png", alt: "ResumeLens AI document and wordmark" },
    intellivox: { src: "/assets/logos/intellivox.png", alt: "IntelliVox voice mark and wordmark" },
    "florentix-ai": { src: "/assets/logos/florentix-ai.png", alt: "Florentix AI leaf mark and wordmark" },
  };
  const projectLogo = projectLogos[project.slug];
  return (
    <dialog
      ref={dialogRef}
      id="project-details"
      className="p-detail-dialog"
      data-project={project.slug}
      aria-labelledby="project-dialog-title"
      onClose={onClose}
    >
      <div className="p-cursor p-cursor-modal" aria-hidden="true"><svg className="p-cursor-plane" viewBox="0 0 16 16" focusable="false"><path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" /></svg><svg className="p-cursor-hand" viewBox="0 0 22 24" focusable="false"><path d="M8 12V4.8a1.35 1.35 0 0 1 2.7 0v4.7-1a1.3 1.3 0 0 1 2.6 0v1.1-.35a1.25 1.25 0 0 1 2.5 0v1.3-.05a1.25 1.25 0 0 1 2.5 0v4.1a6 6 0 0 1-6 6h-.7a5.2 5.2 0 0 1-4.1-2l-3.5-4.2a1.4 1.4 0 0 1 2.2-1.8L8 15z" /></svg></div>
      <article className="p-detail-shell" data-lenis-prevent>
        <header className="p-detail-header">
          <div className="p-detail-heading-content">
            <div className={`p-detail-branding${projectLogo ? " has-logo" : ""}`}>
              {projectLogo && <div className="p-detail-logo"><img src={projectLogo.src} alt={projectLogo.alt} /></div>}
              <div className="p-detail-brand-copy">
                <span className="p-detail-eyebrow">Project case study / {project.categoryDetail}</span>
                <h2 id="project-dialog-title">{project.name}</h2>
                <p>{project.subtitle}</p>
              </div>
            </div>
            <div className="p-detail-badges">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
          </div>
          <button ref={closeRef} className="p-detail-close" type="button" aria-label={`Close ${project.name} details`}><X size={19} /></button>
        </header>

        <div className="p-detail-content">
          <section className="p-detail-section">
            <span className="p-detail-index">01 / Overview</span>
            <p>{project.overview}</p>
          </section>
          <section className="p-detail-section">
            <span className="p-detail-index">02 / Problem</span>
            <p>{project.problem}</p>
          </section>
          <section className="p-detail-section">
            <span className="p-detail-index">03 / What it does</span>
            <ul className="p-detail-features">{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          </section>

          <section className="p-detail-architecture">
            <div className="p-detail-architecture-heading">
              <div><span className="p-detail-index">04 / System architecture</span><h3>{project.architectureTitle}</h3></div>
              <a href={imagePath} target="_blank" rel="noopener noreferrer">Open full image <ExternalLink size={14} /></a>
            </div>
            <a className="p-detail-architecture-image" href={imagePath} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size ${project.name} architecture diagram`}>
              <img src={imagePath} alt={`${project.name} system architecture diagram`} loading="lazy" />
            </a>
          </section>

          <section className="p-detail-section">
            <span className="p-detail-index">05 / Implementation</span>
            <p>{project.implementation}</p>
          </section>
          <section className="p-detail-section">
            <span className="p-detail-index">06 / Development focus</span>
            <p>{project.contribution}</p>
          </section>
        </div>

        <footer className="p-detail-actions">
          <a href={project.repository} target="_blank" rel="noreferrer"><Github size={16} /> Repository <ArrowUpRight size={14} /></a>
          {project.live && <a href={project.live} target="_blank" rel="noreferrer"><ArrowUpRight size={15} /> Live project</a>}
          {project.documentation && <a href={project.documentation} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Documentation</a>}
        </footer>
      </article>
    </dialog>
  );
};

export default ProjectDetailsDialog;
