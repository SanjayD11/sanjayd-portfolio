import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "../App.css";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Github, Linkedin, Mail, Sun, Moon, Code2, Server, Database, PanelsTopLeft, Sparkles, Wrench, GraduationCap, type LucideIcon } from "lucide-react";
import ProjectDetailsDialog, { type ProjectDetails } from "../components/ProjectDetailsDialog";
import { ProjectIconCloud } from "../components/ProjectIconCloud";
import EngineeringNotebook from "../components/EngineeringNotebook";
import RotatingText from "../components/RotatingText";
import PixelCard from "../components/PixelCard";
import Lanyard from "../components/Lanyard";
import MobileProfileFlipCard from "../components/MobileProfileFlipCard";
import MobileCardNav from "../components/MobileCardNav";
import emailjs from "@emailjs/browser";

type Project = ProjectDetails & {
  number: string;
  kind: string;
  summary: string;
  art: string;
  mark: string;
};

const projects: Project[] = [
  { number: "01", slug: "codesentry", architectureTitle: "CodeSentry — Static Analysis and AI-Assisted Security", name: "CodeSentry", subtitle: "AI-assisted source code security analysis", categoryDetail: "Application Security · Static Analysis · Applied AI", kind: "STATIC ANALYSIS / AI-ASSISTED SECURITY", summary: "Analyze uploaded source code, identify potential vulnerabilities through static analysis, map findings to security classifications, and generate reports enriched with AI explanations.", category: "AI & tools", stack: ["Java 17", "Spring Boot", "React", "MySQL", "Spring Security", "JWT", "REST APIs", "OpenRouter", "Groq"], repository: "https://github.com/SanjayD11/codesentry", live: "https://codesentry-wheat.vercel.app", documentation: "https://github.com/SanjayD11/codesentry#readme", overview: "Analyze uploaded source files with deterministic static rules, classify findings, and add AI-generated explanations and remediation guidance. Results help guide review; they do not guarantee detection or replace a security audit.", problem: "Reviewing source code for security issues takes time and knowledge of common weaknesses. A list of matches alone is hard to prioritize, so the project pairs file-level evidence and severity with explanations and remediation guidance.", features: ["Authenticated project and scan workflows", "ZIP integrity, extension, and duplicate-file validation", "Deterministic static scans with language-specific rule engines", "Findings with severity, affected file, and evidence", "AI enrichment for explanations, remediation, and summaries", "Scan history and generated PDF reports"], architecture: "codesentry", implementation: "The React/Vite client calls a Java 17 Spring Boot REST API. Spring Security and JWT protect user routes; upload and scan services validate archives, select scanners, and persist projects, files, scan history, and vulnerabilities through Spring Data JPA to MySQL. AI enrichment runs after deterministic analysis through the configured provider chain (OpenRouter with Groq fallback); a Gemini provider is also present. PDF reports are generated from saved scan findings.", contribution: "The repository shows work across the upload and scan pipeline, language rule engines, authentication, AI-assisted finding enrichment, project and scan views, and PDF report generation. This describes the implementation areas visible in the academic project repository without assigning team roles or claiming performance results.", art: "codesentry", mark: "CS / SAST" },
  { number: "02", slug: "nourishnet", architectureTitle: "NourishNet — Community Food Sharing", name: "NourishNet", subtitle: "Community-powered food sharing", categoryDetail: "COMMUNITY / FOOD SHARING", kind: "Community food sharing", summary: "Connect food donors with people who need it through a community-focused platform designed to make food sharing easier and reduce avoidable waste.", category: "Product", stack: ["React", "TypeScript", "Supabase", "PostgreSQL", "Pollinations Vision"], repository: "https://github.com/SanjayD11/NourishNet", live: "https://nourish-net-sepia.vercel.app", documentation: "https://github.com/SanjayD11/NourishNet#readme", overview: "Connect food donors with people who need it through a community-focused platform designed to make food sharing easier and reduce avoidable waste.", problem: "Useful food can go to waste while people nearby face food insecurity. NourishNet gives donors and requesters a shared way to discover and coordinate free food.", features: ["Donor and requester account flows", "Create and browse surplus-food listings", "Request management and status tracking", "Ratings and community trust features", "Pollinations AI food-safety and health scanner", "Supabase-backed authentication and data", "Realtime updates for changing listings and requests"], architecture: "nourishnet", implementation: "The React and TypeScript client connects to Supabase Auth, PostgreSQL, Realtime, and Storage for accounts, listings, requests, and profile media. The food-safety scanner calls Pollinations AI Vision from the app and returns analysis alongside food posts. Supabase subscriptions keep post and request status current.", contribution: "The repository demonstrates end-to-end product work across the React interface, listing and request flows, Supabase integration, and realtime user experience. The case study sticks to functions documented in the repository rather than assigning unverified team responsibilities.", art: "nourish", mark: "N / N" },
  { number: "03", slug: "resumelens", architectureTitle: "ResumeLens-AI — Resume and Job Description Analysis", name: "ResumeLens-AI", subtitle: "AI-assisted resume analysis", categoryDetail: "RESUME ANALYSIS / JOB ALIGNMENT", kind: "Private resume analysis", summary: "Compare a resume with a target job description, uncover relevant skill gaps, and turn ATS-oriented insights into practical improvements for your next application.", category: "AI & tools", stack: ["Python", "Streamlit", "PyPDF2", "Groq", "LLaMA 3.3", "ReportLab", "Matplotlib"], repository: "https://github.com/SanjayD11/ResumeLens-AI", live: "https://resumelens-ai-zbmgxvbryjqi4ifytqh3kf.streamlit.app", documentation: "https://github.com/SanjayD11/ResumeLens-AI#readme", overview: "Compare a resume with a target job description, surface relevant skill gaps, and turn ATS-oriented insights into practical improvements for the next application.", problem: "Applicants often have to guess whether their resume reflects the language and requirements of a role. ResumeLens makes that comparison easier to review and gives users specific next steps.", features: ["Resume PDF upload and text extraction", "Job-description-aware skill and keyword analysis", "ATS compatibility scoring", "AI-generated explanations and improvement suggestions", "Resume rewriting and tailored interview questions", "PDF report export with visualizations"], architecture: "resumelens", implementation: "The Python Streamlit app accepts a resume PDF and job description, extracts text with PyPDF2, and combines ATS and skill-match analysis with Groq-hosted LLaMA 3.3 70B inference. Matplotlib builds report visuals and ReportLab generates downloadable PDF reports.", contribution: "The repository documents a Python application that joins document parsing, scoring logic, model prompts, and a user-facing analysis flow. The public repository also lists the deployed Streamlit app; no claims about local-only inference are made here.", art: "lens", mark: "R—L" },
  { number: "04", slug: "intellivox", architectureTitle: "IntelliVox — Context-Aware Voice Conversations", name: "IntelliVox", subtitle: "Context-aware voice intelligence", categoryDetail: "VOICE / CONTEXT / RESPONSE", kind: "AI conversation interface", summary: "Explore hands-free AI conversations with streaming responses, spoken interaction, and retained context designed to make voice-based experiences feel more natural.", category: "AI & tools", stack: ["React", "TypeScript", "Supabase", "Edge Functions", "Groq", "Pollinations", "SSE", "Web Speech API"], repository: "https://github.com/SanjayD11/IntelliVox-Context-Aware-Voice-intelligence", live: "https://intelli-vox-context-aware-voice-int.vercel.app", overview: "Explore hands-free AI conversations with streaming responses, spoken interaction, and retained context designed to make voice-based experiences feel more natural.", problem: "Voice assistants can feel slow or forgetful when replies arrive in one block or conversation history disappears. IntelliVox streams responses, remembers chat context, and falls back to another provider when needed.", features: ["Hands-free speech recognition and voice replies", "Server-Sent Events response streaming", "Groq primary provider with Pollinations fallback", "Context-aware chat with saved messages and profile settings", "Multilingual voice options and live captions"], architecture: "intellivox", implementation: "The React 18 and TypeScript client uses browser speech recognition and synthesis for voice interaction. Requests go to a Supabase Edge Function, which streams responses over SSE, tries Groq first, then Pollinations as fallback. Supabase Auth, Database, and Storage persist user profiles, settings, and chat history.", contribution: "The repository documents and implements the voice controls, live response UI, Supabase Edge Function, Groq-to-Pollinations fallback, and saved chat/profile state. The project combines frontend speech APIs with server-side AI routing and Supabase persistence.", art: "vox", mark: "listen ↗" },
  { number: "05", slug: "florentix-ai", architectureTitle: "Florentix AI — Hybrid Plant Health Insights", name: "Florentix AI", subtitle: "AI-assisted plant health insights", categoryDetail: "PLANT HEALTH / HYBRID AI", kind: "Plant health diagnostics", summary: "Combine image-based AI analysis with lightweight on-device inference to explore potential plant health issues and provide accessible diagnostic guidance.", category: "Product", stack: ["Vanilla JS", "FastAPI", "Gemma 3 Vision", "TensorFlow Lite", "Firebase"], repository: "https://github.com/SanjayD11/florentix-ai", live: "https://florentix-ai.vercel.app", documentation: "https://github.com/SanjayD11/florentix-ai#readme", overview: "Combine image-based AI analysis with lightweight on-device inference to explore potential plant health issues and provide accessible diagnostic guidance.", problem: "Plant disease symptoms can be difficult to identify early, especially without immediate access to specialist help. The app aims to make an initial plant-health review more accessible using an image and an AI-assisted explanation.", features: ["Plant image upload with client-side compression", "FastAPI inference service", "Gemma 3 vision requests through OpenRouter", "TensorFlow Lite/XNNPACK fallback path", "Firebase authentication and Firestore persistence", "Streaming AI Botanist chat"], architecture: "florentix-ai", implementation: "The vanilla JavaScript frontend is deployed on Vercel and compresses image uploads before sending them to a Dockerized FastAPI service. The backend tries OpenRouter-hosted Gemma 3 vision models, then uses the packaged TensorFlow Lite/XNNPACK classifier for configured fallback cases. Firebase Auth and Firestore handle user identity and saved results/chat; the README lists Render for the backend deployment.", contribution: "The repository shows a hybrid AI product spanning frontend upload handling, asynchronous API orchestration, cloud vision inference, local model fallback, and Firebase persistence. The diagram follows the architecture described by the project README.", art: "florentix", mark: "F / AI" },
];

type SkillGroup = { number: string; title: string; Icon: LucideIcon; description: string; clusters: { label: string; items: string[] }[]; points: string[]; projects?: { slug: string; label: string }[] };
const skillGroups: SkillGroup[] = [
  { number: "02", title: "Core programming", Icon: Code2, description: "Java is my primary language. Practice in Python, C, JavaScript, and SQL helps me keep strengthening the fundamentals through regular problem-solving.", clusters: [
    { label: "PRIMARY", items: ["Java"] },
    { label: "PRACTICAL EXPERIENCE", items: ["Python", "C", "JavaScript", "SQL"] },
  ], points: ["Object-oriented programming", "Collections and exception handling", "Problem-solving and algorithm practice"] },
  { number: "03", title: "Databases & data", Icon: Database, description: "Working with relational databases, SQL queries, and persistence layers that keep application data structured, accessible, and consistent.", clusters: [
    { label: "PROJECT EXPERIENCE", items: ["MySQL · CodeSentry", "PostgreSQL · Supabase", "CRUD & persistence"] },
    { label: "FOUNDATIONS & LEARNING", items: ["Relational design", "Queries & joins", "Oracle SQL · learning"] },
  ], points: ["Data management foundations", "Database-backed application flows", "PostgreSQL through Supabase projects"], projects: [{ slug: "codesentry", label: "CodeSentry · MySQL" }, { slug: "nourishnet", label: "NourishNet · PostgreSQL" }] },
  { number: "04", title: "Frontend development", Icon: PanelsTopLeft, description: "I build responsive interfaces using web fundamentals and have delivered component-based project interfaces with AI-assisted development tools while continuing to improve my independent frontend skills.", clusters: [
    { label: "WEB FUNDAMENTALS", items: ["HTML", "CSS", "JavaScript"] },
    { label: "AI-ASSISTED PROJECT EXPERIENCE", items: ["React", "TypeScript"] },
    { label: "UI & STYLING TOOLS", items: ["Tailwind CSS", "Bootstrap", "shadcn/ui"] },
  ], points: ["Responsive screens and API-connected interfaces", "Reusable components and UI composition", "Independent frontend fluency in progress"], projects: [{ slug: "nourishnet", label: "NourishNet" }, { slug: "intellivox", label: "IntelliVox" }] },
  { number: "05", title: "AI integration & automation", Icon: Sparkles, description: "I focus on putting AI capabilities to practical use — integrating model APIs, structuring responses, connecting services, and building useful AI-powered workflows.", clusters: [
    { label: "PROJECT EXPERIENCE", items: ["Groq API", "LLM API integration", "Structured AI responses"] },
    { label: "APPLICATION AREAS", items: ["Resume analysis", "Code explanations", "Voice & vision APIs"] },
    { label: "EXPLORING", items: ["n8n automation", "Prompt design", "NLP / AI-ML foundations"] },
  ], points: ["Service orchestration and provider fallbacks", "AI-assisted recommendations and explanations", "Practical API integration"], projects: [{ slug: "resumelens", label: "ResumeLens-AI" }, { slug: "codesentry", label: "CodeSentry" }, { slug: "intellivox", label: "IntelliVox" }, { slug: "florentix-ai", label: "Florentix AI" }] },
  { number: "06", title: "Development tools & environment", Icon: Wrench, description: "The everyday tools behind building, testing, versioning, and deploying my projects.", clusters: [
    { label: "IDEs & EDITORS", items: ["IntelliJ IDEA", "Visual Studio Code", "Eclipse"] },
    { label: "API TESTING & VERSION CONTROL", items: ["Postman", "Git", "GitHub"] },
    { label: "CONTAINERS & DEPLOYMENT", items: ["Docker · fundamentals", "Vercel · deployments"] },
    { label: "CLOUD & BACKEND SERVICES", items: ["Supabase", "Firebase", "AWS Academy · coursework"] },
  ], points: ["Containerization at a foundational level", "Cloud Foundations and Cloud Architecting learning", "Project deployments on Vercel where applicable"], projects: [{ slug: "codesentry", label: "GitHub · CodeSentry" }, { slug: "nourishnet", label: "Supabase · NourishNet" }, { slug: "nourishnet", label: "Vercel · NourishNet" }, { slug: "florentix-ai", label: "Firebase · Florentix AI" }, { slug: "florentix-ai", label: "Docker · Florentix AI" }] },
  { number: "07", title: "Computer science foundations", Icon: GraduationCap, description: "Strong software engineering begins with fundamentals. I apply these concepts through Java problem-solving, database-backed applications, and project architecture.", clusters: [
    { label: "PRACTICED & APPLIED", items: ["Object-oriented programming", "Data structures & algorithms", "Java problem-solving", "DBMS", "Operating systems"] },
    { label: "DEVELOPMENT FOUNDATIONS", items: ["SDLC", "Clean code & modular design", "Software architecture", "Application security basics"] },
  ], points: ["OOP through Java fundamentals", "Problem-solving practice reflected in LeetCode and SkillRack snapshots", "Architecture concepts applied across project case studies"], projects: [{ slug: "codesentry", label: "CodeSentry · security & architecture" }] },
];

const credentials = [
  { title: "Joy of Computing using Python", issuer: "NPTEL · Elite", href: "https://drive.google.com/file/d/1zj1VYgL0aPff7k78cWB6ha1hNckHnC0U/view" },
  { title: "Python for Data Science", issuer: "NPTEL · Elite", href: "https://drive.google.com/file/d/1WQ_OmbBvRALA7t1nCLfmdnMsXBAMOBpM/view" },
  { title: "Machine Learning Foundation", issuer: "Infosys", href: "https://drive.google.com/file/d/1HbJQ-ouqfcahr3oBLlBdj5IMkJRSRjQ9/view" },
  { title: "AWS Academy Graduate — Cloud Foundations", issuer: "AWS Academy", href: "https://www.credly.com/badges/a8080ee5-de87-4c53-b04e-174bf00b6aaa/public_url" },
  { title: "AWS Academy Graduate — Cloud Architecting", issuer: "AWS Academy", href: "https://www.credly.com/badges/5c7710ea-fe28-4f03-b979-a32760531885/public_url" },
  { title: "CCNA — Switching & Routing", issuer: "Cisco", href: "https://www.credly.com/badges/d3f1ffaa-fc4f-4083-a8d4-7a7242e80903/public_url" },
  { title: "C Advanced", issuer: "Cisco Networking Academy", href: "https://www.credly.com/badges/c3581ee4-e51b-4c31-8a89-24ffe1566be7/public_url" },
  { title: "MySQL Bootcamp", issuer: "Udemy", href: "https://www.udemy.com/certificate/UC-62fc0443-8f1a-4dcd-8ecd-55b84cebad32/" },
  { title: "Build a Free Website with WordPress", issuer: "Coursera", href: "https://www.coursera.org/account/accomplishments/verify/X8YTXCGBELEQ" },
];

const profilePixelPalettes = {
  leetcode: { light: ["#f8cc91", "#f0a43b", "#bd6818"], dark: ["#ffe0b2", "#f5b552", "#d87b20"] },
  skillrack: { light: ["#c7bcff", "#8068e8", "#5941bd"], dark: ["#dbd2ff", "#9b86ff", "#765ce0"] },
  gfg: { light: ["#a7ddbf", "#45a977", "#187448"], dark: ["#b9efd0", "#63cb91", "#2b9b62"] },
};

const Index = () => {
  const [showCredentials, setShowCredentials] = useState(false);
  const [dark, setDark] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [contactStatus, setContactStatus] = useState("");
  const [contactSending, setContactSending] = useState(false);
  const [loaderPercent, setLoaderPercent] = useState(0);
  const [loaderLeaving, setLoaderLeaving] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [loaderMessage, setLoaderMessage] = useState("Warming up the workspace");
  const navRef = useRef<HTMLElement | null>(null);
  const [showMobileProfileCard, setShowMobileProfileCard] = useState(() => window.matchMedia("(max-width: 850px)").matches);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 850px)");
    const sync = () => setShowMobileProfileCard(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".p-capabilities");
    const cards = Array.from(section?.querySelectorAll<HTMLElement>(".p-skill-feature, .p-expertise-card") ?? []).slice(0, 7);
    if (!section || !cards.length) return;
    const stage = section.querySelector<HTMLElement>(".p-expertise");
    if (!stage) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactView = window.matchMedia("(max-width: 850px)");
    let scanIndex = 0;
    let direction = 1;
    let engagedIndex: number | null = null;
    let timer = 0;
    let viewportFrame = 0;

    cards.forEach((card) => {
      card.classList.add("p-focus-card");
    });
    const frame = document.createElement("span");
    frame.className = "p-focus-scan-frame";
    frame.setAttribute("aria-hidden", "true");
    frame.innerHTML = "<i></i><i></i><i></i><i></i>";
    stage.append(frame);

    const paint = () => {
      const activeIndex = engagedIndex ?? scanIndex;
      cards.forEach((card, index) => {
        card.classList.toggle("is-focus-active", index === activeIndex);
        card.classList.toggle("is-focus-muted", index !== activeIndex);
      });
      const cardRect = cards[activeIndex].getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const gap = Number.parseFloat(getComputedStyle(stage).getPropertyValue("--focus-frame-gap")) || 8;
      frame.style.width = `${cardRect.width + gap * 2}px`;
      frame.style.height = `${cardRect.height + gap * 2}px`;
      frame.style.transform = `translate3d(${cardRect.left - stageRect.left - gap}px, ${cardRect.top - stageRect.top - gap}px, 0)`;
    };
    const advance = () => {
      if (engagedIndex !== null || cards.length < 2) return;
      scanIndex += direction;
      if (scanIndex >= cards.length - 1 || scanIndex <= 0) direction *= -1;
      paint();
    };
    const engage = (index: number) => { engagedIndex = index; paint(); };
    const disengage = (index: number) => {
      if (engagedIndex !== index) return;
      engagedIndex = null;
      paint();
    };
    const syncViewportFocus = () => {
      viewportFrame = 0;
      if (!compactView.matches) return;
      const viewportCenter = window.innerHeight / 2;
      let nearestIndex = -1;
      let nearestDistance = Number.POSITIVE_INFINITY;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
        const distance = viewportCenter < rect.top ? rect.top - viewportCenter : viewportCenter > rect.bottom ? viewportCenter - rect.bottom : Math.abs((rect.top + rect.bottom) / 2 - viewportCenter) / 100;
        if (distance < nearestDistance) { nearestDistance = distance; nearestIndex = index; }
      });
      if (nearestIndex >= 0) { engagedIndex = nearestIndex; paint(); }
    };
    const scheduleViewportFocus = () => {
      if (!compactView.matches || viewportFrame) return;
      viewportFrame = window.requestAnimationFrame(syncViewportFocus);
    };

    cards.forEach((card, index) => {
      const onEnter = () => engage(index);
      const onLeave = () => { if (!card.matches(":focus-within")) disengage(index); };
      const onFocus = () => engage(index);
      const onBlur = (event: FocusEvent) => {
        if (!card.contains(event.relatedTarget as Node | null)) disengage(index);
      };
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);
      card.addEventListener("focusin", onFocus);
      card.addEventListener("focusout", onBlur);
      (card as HTMLElement & { __focusScanCleanup?: () => void }).__focusScanCleanup = () => {
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointerleave", onLeave);
        card.removeEventListener("focusin", onFocus);
        card.removeEventListener("focusout", onBlur);
      };
    });

    paint();
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(paint) : null;
    resizeObserver?.observe(stage);
    cards.forEach((card) => resizeObserver?.observe(card));
    const syncScanMode = () => {
      window.clearInterval(timer);
      timer = 0;
      if (compactView.matches) scheduleViewportFocus();
      else {
        engagedIndex = null;
        paint();
        if (!reducedMotion.matches) timer = window.setInterval(advance, 1900);
      }
    };
    if (compactView.matches) syncViewportFocus();
    else if (!reducedMotion.matches) timer = window.setInterval(advance, 1900);
    const onViewportChange = () => syncScanMode();
    window.addEventListener("scroll", scheduleViewportFocus, { passive: true });
    window.addEventListener("resize", scheduleViewportFocus, { passive: true });
    compactView.addEventListener("change", onViewportChange);
    const onMotionChange = (event: MediaQueryListEvent) => {
      window.clearInterval(timer);
      timer = event.matches || compactView.matches ? 0 : window.setInterval(advance, 1900);
      if (compactView.matches) scheduleViewportFocus();
      else paint();
    };
    reducedMotion.addEventListener("change", onMotionChange);
    return () => {
      window.clearInterval(timer);
      window.cancelAnimationFrame(viewportFrame);
      window.removeEventListener("scroll", scheduleViewportFocus);
      window.removeEventListener("resize", scheduleViewportFocus);
      compactView.removeEventListener("change", onViewportChange);
      reducedMotion.removeEventListener("change", onMotionChange);
      cards.forEach((card) => {
        (card as HTMLElement & { __focusScanCleanup?: () => void }).__focusScanCleanup?.();
        delete (card as HTMLElement & { __focusScanCleanup?: () => void }).__focusScanCleanup;
        card.classList.remove("p-focus-card", "is-focus-active", "is-focus-muted");
      });
      frame.remove();
    };
  }, []);

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!window.location.hash) {
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      window.requestAnimationFrame(() => { root.style.scrollBehavior = previousBehavior; });
    }
    const loader = document.querySelector<HTMLElement>(".p-loader");
    const pairs = [
      [".p-loader-editorial > .p-overline", ".p-hero-copy > .p-overline"],
      [".p-loader-editorial > h1", ".p-hero-copy > h1"],
    ] as const;
    if (!loader) return;
    const alignIdentity = () => {
      for (const [loaderSelector, heroSelector] of pairs) {
        const source = loader.querySelector<HTMLElement>(loaderSelector);
        const target = document.querySelector<HTMLElement>(heroSelector);
        if (!source || !target) continue;
        const rect = target.getBoundingClientRect();
        source.style.left = `${rect.left}px`;
        source.style.top = `${rect.top}px`;
        source.style.width = `${rect.width}px`;
      }
      loader.classList.add("handoff-ready");
    };
    alignIdentity();
    const animationFrame = window.requestAnimationFrame(alignIdentity);
    window.addEventListener("resize", alignIdentity);
    window.addEventListener("pageshow", alignIdentity);
    document.fonts?.ready.then(alignIdentity);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", alignIdentity);
      window.removeEventListener("pageshow", alignIdentity);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("portfolio-dark", dark);
    return () => document.documentElement.classList.remove("portfolio-dark");
  }, [dark]);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pointerRoot = document.querySelector<HTMLElement>(".portfolio");
    const pageCursor = pointerRoot?.querySelector<HTMLElement>(":scope > .p-cursor");
    const loader = document.querySelector<HTMLElement>(".p-loader");
    const loaderCursor = loader && pageCursor ? pageCursor.cloneNode(true) as HTMLElement : null;
    if (loaderCursor && loader) { loaderCursor.classList.add("p-cursor-loader"); loader.append(loaderCursor); }
    let frame = 0;
    let latestX = 0, latestY = 0;
    let latestClientX = 0, latestClientY = 0;
    let hasPointerPosition = false;
    let lastSavedAt = 0;
    try {
      const saved = JSON.parse(window.sessionStorage.getItem("portfolio:pointer-position") || "null");
      if (saved?.path === window.location.pathname && Date.now() - saved.at < 600_000 && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
        latestClientX = saved.x;
        latestClientY = saved.y;
        hasPointerPosition = true;
      }
    } catch { /* Storage can be unavailable in restricted browsing contexts. */ }
    const move = (event: Pick<PointerEvent, "target" | "clientX" | "clientY">) => {
      const target = event.target instanceof Element ? event.target : null;
      const dialog = target?.closest(".p-detail-dialog[open], .p-notebook-dialog[open]") ?? document.querySelector<HTMLElement>(".p-detail-dialog[open], .p-notebook-dialog[open]");
      const onLoader = target?.closest<HTMLElement>(".p-loader");
      const inPortfolio = !!target?.closest(".portfolio");
      const cursor = dialog?.querySelector<HTMLElement>(".p-cursor") ?? (onLoader ? loaderCursor : pageCursor);
      if (!cursor || (!dialog && !onLoader && !inPortfolio)) {
        pointerRoot?.classList.remove("has-custom-cursor");
        document.querySelector<HTMLElement>(".p-loader")?.classList.remove("has-custom-cursor");
        document.querySelectorAll<HTMLElement>(".p-cursor").forEach((node) => node.classList.remove("is-active", "is-hand", "is-text"));
        return;
      }
      const dialogElement = dialog instanceof HTMLDialogElement ? dialog : null;
      const dialogRect = dialogElement?.getBoundingClientRect();
      latestClientX = event.clientX;
      latestClientY = event.clientY;
      hasPointerPosition = true;
      if (lastSavedAt === 0 || performance.now() - lastSavedAt > 250) {
        lastSavedAt = performance.now();
        try { window.sessionStorage.setItem("portfolio:pointer-position", JSON.stringify({ x: latestClientX, y: latestClientY, path: window.location.pathname, at: Date.now() })); } catch { /* Storage is only a recovery hint. */ }
      }
      latestX = event.clientX - (dialogRect ? dialogRect.left + (dialogElement?.clientLeft ?? 0) : 0);
      latestY = event.clientY - (dialogRect ? dialogRect.top + (dialogElement?.clientTop ?? 0) : 0);
      if (!cursor.classList.contains("is-active")) {
        [".p-cursor-plane", ".p-cursor-hand"].forEach((selector) => {
          const icon = cursor.querySelector<HTMLElement>(selector);
          icon?.style.setProperty("--pointer-x", `${latestX}px`);
          icon?.style.setProperty("--pointer-y", `${latestY}px`);
        });
      }
      pointerRoot?.classList.add("has-custom-cursor");
      loader?.classList.toggle("has-custom-cursor", cursor === loaderCursor);
      const projectCard = target?.closest<HTMLElement>(".p-project");
      const pointerInsideDialog = !dialog || !!target?.closest(".p-detail-dialog[open], .p-notebook-dialog[open]");
      const actionable = pointerInsideDialog && (!!projectCard || !!target?.closest("a, button, [role='button'], input[type='submit'], input[type='button']"));
      const accentSource = dialogElement ?? projectCard;
      const accentProperty = dialogElement ? (dialogElement.classList.contains("p-detail-dialog") ? "--detail-accent" : "--accent") : "--project-accent";
      const projectAccent = accentSource ? getComputedStyle(accentSource).getPropertyValue(accentProperty).trim() : "";
      document.querySelectorAll<HTMLElement>(".p-cursor").forEach((node) => {
        node.classList.toggle("is-active", node === cursor);
        node.classList.toggle("is-hand", node === cursor && actionable);
        if (node === cursor && projectAccent) node.style.setProperty("--cursor-accent", projectAccent);
        else if (node === cursor) node.style.removeProperty("--cursor-accent");
      });
      if (!frame) frame = window.requestAnimationFrame(() => {
        cursor.querySelector<HTMLElement>(".p-cursor-plane")?.style.setProperty("--pointer-x", `${latestX}px`);
        cursor.querySelector<HTMLElement>(".p-cursor-plane")?.style.setProperty("--pointer-y", `${latestY}px`);
        cursor.querySelector<HTMLElement>(".p-cursor-hand")?.style.setProperty("--pointer-x", `${latestX}px`);
        cursor.querySelector<HTMLElement>(".p-cursor-hand")?.style.setProperty("--pointer-y", `${latestY}px`);
        frame = 0;
      });
    };
    const leave = () => {
      pointerRoot?.classList.remove("has-custom-cursor");
      loader?.classList.remove("has-custom-cursor");
      document.querySelectorAll<HTMLElement>(".p-cursor").forEach((node) => node.classList.remove("is-active", "is-hand"));
    };
    const out = (event: PointerEvent) => { if (event.relatedTarget === null) leave(); };
    const restore = () => {
      if (!hasPointerPosition || document.visibilityState !== "visible") return;
      const target = document.elementFromPoint(latestClientX, latestClientY);
      if (target) move({ target, clientX: latestClientX, clientY: latestClientY });
    };
    const onVisibilityChange = () => { if (document.visibilityState === "visible") restore(); else leave(); };
    let restoreFrame = 0;
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerover", move);
    document.addEventListener("pointerout", out);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", leave);
    window.addEventListener("focus", restore);
    window.addEventListener("pageshow", restore);
    if (hasPointerPosition) restoreFrame = window.requestAnimationFrame(() => { restoreFrame = window.requestAnimationFrame(restore); });
    return () => {
      pointerRoot?.classList.remove("has-custom-cursor");
      loader?.classList.remove("has-custom-cursor");
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", move);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", leave);
      window.removeEventListener("focus", restore);
      window.removeEventListener("pageshow", restore);
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(restoreFrame);
    };
  }, []);

  useEffect(() => {
    let value = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let beginExit = 0;
    let removeLoader = 0;
    const progress = window.setInterval(() => {
      value = Math.min(94, value + 3);
      setLoaderPercent(value);
      setLoaderMessage(value < 38 ? "Warming up the workspace" : value < 76 ? "Gathering selected work" : "Polishing the details");
    }, reduced ? 50 : 65);
    const finish = window.setTimeout(() => {
      window.clearInterval(progress);
      setLoaderPercent(100);
      setLoaderMessage("Ready to explore");
      beginExit = window.setTimeout(() => setLoaderLeaving(true), 170);
      removeLoader = window.setTimeout(() => setLoaderVisible(false), reduced ? 280 : 620);
    }, reduced ? 420 : 1850);
    return () => { window.clearInterval(progress); window.clearTimeout(finish); window.clearTimeout(beginExit); window.clearTimeout(removeLoader); };
  }, []);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (loaderVisible || !nav || !window.matchMedia("(max-width: 850px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intro = nav.animate(
      [
        { clipPath: "inset(0 50% round 999px)", opacity: 0.72 },
        { clipPath: "inset(0 0 round 999px)", opacity: 1 },
      ],
      { duration: 820, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" },
    );
    const details = Array.from(nav.children).filter((child) => !child.classList.contains("p-links"));
    const detailAnimations = details.map((child, index) =>
      child.animate(
        [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 560, delay: 220 + index * 70, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" },
      ),
    );

    return () => {
      intro.cancel();
      detailAnimations.forEach((animation) => animation.cancel());
    };
  }, [loaderVisible]);

  const skipLoader = () => {
    setLoaderPercent(100);
    setLoaderMessage("Ready to explore");
    setLoaderLeaving(true);
    window.setTimeout(() => setLoaderVisible(false), 500);
  };

  useEffect(() => {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;
    const update = () => { const max = document.documentElement.scrollHeight - window.innerHeight; bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")"; };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll(".p-reveal:not(.is-visible)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) { targets.forEach((target) => target.classList.add("is-visible")); return; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const sendContactMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || contactSending) return;
    const values = new FormData(form);
    if (values.get("company_website")) return;
    const name = String(values.get("name") ?? "").trim();
    const email = String(values.get("email") ?? "").trim();
    const message = String(values.get("message") ?? "").trim();
    setContactSending(true);
    setContactStatus("Sending your note…");
    try {
      await emailjs.send("service_l7jr9q4", "template_o7b9vu7", { name, email, message, from_name: name, from_email: email, reply_to: email }, { publicKey: "fHveuQYI0JLBzpeYl" });
      form.reset();
      setContactStatus("Thanks — your message is on its way. I’ll get back to you soon.");
    } catch {
      setContactStatus("Your message couldn’t be sent just now. Please email sanjayraju5164@gmail.com instead.");
    } finally {
      setContactSending(false);
    }
  };

  return (
    <>
      {loaderVisible && <div className={"p-loader" + (loaderLeaving ? " is-leaving" : "")} role="status" aria-live="off" aria-label="Loading Sanjay’s portfolio"><button className="p-loader-skip" type="button" onClick={skipLoader}>Skip intro <span aria-hidden="true">↗</span></button><div className="p-loader-center"><header className="p-loader-rail"><span className="p-loader-wordmark">SD<span>.</span></span><div><span>INDEPENDENT DEVELOPER</span><span>PORTFOLIO / 2026</span></div></header><div className="p-loader-editorial"><p className="p-overline">Building software with purpose.</p><h1><span>Sanjay</span><br /><em>Dharmarajou</em><b>.</b></h1></div><footer className="p-loader-footer"><div className="p-loader-readout"><span>{loaderMessage}</span><strong>{String(loaderPercent).padStart(2, "0")}%</strong></div><div className="p-loader-track"><i style={{ transform: "scaleX(" + loaderPercent / 100 + ")" }} /></div><div className="p-loader-footnote"><span>WORK IN PROGRESS</span><span>GOOD THINGS TAKE A LITTLE CURIOSITY.</span></div></footer></div><img className="p-loader-gif" src="/assets/hero-coder.gif" alt="" aria-hidden="true" /></div>}
      <div className="p-scroll-progress" id="scroll-progress" aria-hidden="true" />
      <div className="portfolio" id="top">
        <div className="p-cursor" aria-hidden="true"><svg className="p-cursor-plane" viewBox="0 0 16 16" focusable="false"><path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" /></svg><svg className="p-cursor-hand" viewBox="0 0 22 24" focusable="false"><path d="M8 12V4.8a1.35 1.35 0 0 1 2.7 0v4.7-1a1.3 1.3 0 0 1 2.6 0v1.1-.35a1.25 1.25 0 0 1 2.5 0v1.3-.05a1.25 1.25 0 0 1 2.5 0v4.1a6 6 0 0 1-6 6h-.7a5.2 5.2 0 0 1-4.1-2l-3.5-4.2a1.4 1.4 0 0 1 2.2-1.8L8 15z" /></svg></div>
      <header className="p-nav" ref={navRef}>
        <a className="p-wordmark" href="#top" aria-label="Sanjay Dharmarajou, home">SD<span>.</span></a>
        <span className="p-nav-note">Developer / builder</span>
        <nav className="p-links" aria-label="Main navigation">
          {[ ["Work", "#work"], ["About", "#about"], ["Elsewhere", "#elsewhere"], ["Contact", "#contact"] ].map(([label, href]) => <a key={href} href={href}><span className="p-link-face">{label}</span><span className="p-link-face-alt" aria-hidden="true">{label}</span></a>)}
        </nav>
        <div className="p-nav-actions">
          <button className="p-icon-button p-theme-toggle" onClick={() => setDark(!dark)} aria-label={dark ? "Use light color scheme" : "Use dark color scheme"}>{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
          <MobileCardNav />
        </div>
      </header>

      <main>
        <section className="p-hero">
          <div className="p-hero-top"><span className="p-kicker"><i /> Computer science student · 2024–2028</span></div>
          {!showMobileProfileCard && <Lanyard className="p-hero-lanyard" frontImage="/images/profile-photo.png?v=refreshed-studio-20261017" backImage="" imagePosition={{ x: 0.5, y: 0.2 }} imageFit="cover" cardColor="#f8f7ff" strapColor="#7052e8" strapLength={0.44} strapWidth={0.58} size={0.34} anchor="elsewhere" damping={0.62} elasticity={0.52} breeze={0} intro={false} />}
          <div className="p-hero-main">
            <div className="p-hero-copy">
              <p className="p-overline">Building software with purpose.</p>
              <h1><span className="p-name-accent">Sanjay</span><br /><em>Dharmarajou</em><b className="p-period">.</b></h1>
              <div className="p-hero-bottom"><p>B.Tech CSE student focused on <RotatingText texts={["Java development.", "useful automation.", "practical AI integration."]} /><br />Thoughtful products, built to keep learning.</p><a className="p-round-link" href="#work" aria-label="Explore selected work"><ArrowDownRight size={22} /></a></div>
            </div>
            <div className="p-hero-art">
              <div className="p-art-caption">A LITTLE ABOUT ME <span>Ideas in motion.</span></div>
              <div className="p-art-grid" aria-hidden="true" />
              <img className="p-hero-gif" src="/assets/hero-coder.gif" alt="Animated illustration of a developer coding at a desk" fetchPriority="high" />
              <span className="p-gif-caption" aria-hidden="true">BUILD / LEARN / REPEAT</span>
              {showMobileProfileCard && <MobileProfileFlipCard />}
            </div>
          </div>
          <div className="p-hero-meta"><span>CURIOUS BY NATURE · BUILDER BY PRACTICE</span><span>SCROLL TO EXPLORE <ArrowDownRight size={13} /></span></div>
        </section>

        <div className="p-ticker" aria-label="Areas of interest"><div className="p-ticker-topline"><span>01 / WHAT I CARE ABOUT</span><span>TURNING IDEAS INTO WORKING SOFTWARE <i>↗</i></span></div><div className="p-ticker-lane p-ticker-primary"><div className="p-ticker-track"><div className="p-ticker-set"><span className="p-ticker-item"><small>01</small>Software with <em>purpose</em></span><span className="p-ticker-star">✳</span><span className="p-ticker-item">Automation with <em>intent</em></span><span className="p-ticker-star">✳</span><span className="p-ticker-item">Intelligence in <em>practice</em></span><span className="p-ticker-star">✳</span><span className="p-ticker-item">Systems built to <em>last</em></span><span className="p-ticker-star">✳</span></div><div className="p-ticker-set" aria-hidden="true"><span className="p-ticker-item"><small>01</small>Software with <em>purpose</em></span><span className="p-ticker-star">✳</span><span className="p-ticker-item">Automation with <em>intent</em></span><span className="p-ticker-star">✳</span><span className="p-ticker-item">Intelligence in <em>practice</em></span><span className="p-ticker-star">✳</span><span className="p-ticker-item">Systems built to <em>last</em></span><span className="p-ticker-star">✳</span></div></div></div><div className="p-ticker-lane p-ticker-secondary"><div className="p-ticker-track"><div className="p-ticker-set"><span>BACKEND ENGINEERING</span><i>／</i><span>PRODUCT THINKING</span><i>／</i><span>PRACTICAL AI</span><i>／</i><span>CONTINUOUS LEARNING</span><i>／</i></div><div className="p-ticker-set" aria-hidden="true"><span>BACKEND ENGINEERING</span><i>／</i><span>PRODUCT THINKING</span><i>／</i><span>PRACTICAL AI</span><i>／</i><span>CONTINUOUS LEARNING</span><i>／</i></div></div></div><div className="p-ticker-bottom"><span>PRACTICAL AI</span><span><i /> CONTINUOUS LEARNING</span></div></div>

        <section className="p-section p-work" id="work">
          <div className="p-section-heading p-reveal"><div><span className="p-kicker">01 / Selected work</span><h2>Built to solve.<br /><em>Made to learn.</em></h2></div><p className="p-section-intro">A collection of projects where backend systems, useful interfaces, and applied AI meet real-world problems.</p></div>
          <div className="p-project-grid">{projects.map((project) => <article className={`p-project ${project.art} p-card-${project.art} p-reveal`} key={project.name}>
            <button className={`p-project-visual p-card-${project.art}`} type="button" onClick={() => setSelectedProject(project)} aria-haspopup="dialog">
              <div className="p-project-visual-top"><span>{project.number} / 05</span><span>{project.category}</span></div>
              {project.art === "codesentry" && <div className="p-code-art"><span>STATIC ANALYSIS / AI-ASSISTED SECURITY</span><b><span>FIND THE</span><i>WEAK POINTS.</i></b><div className="p-code-flow"><i>ZIP</i><i>RULES</i><i>REPORT</i></div></div>}
              {project.art === "nourish" && <div className="p-nourish-art"><div className="p-nourish-stamp"><span>GOOD FOOD.</span><i>SHARED<br />BETTER.</i></div><div className="p-nourish-arc" /><span>COMMUNITY / FOOD SHARING</span></div>}
              {project.art === "lens" && <div className="p-lens-art"><div className="p-lens-sheet"><span>RESUME / JOB ALIGNMENT</span><svg className="p-lens-scan" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path d="M5 13V5h8M27 35h8v-8" /></svg><b><span>MAKE EXPERIENCE</span><i>COUNT.</i></b><div className="p-lens-lines"><i /><i /><i /><i /></div><span className="p-lens-score">SKILL MATCH <b>AI</b></span></div></div>}
              {project.art === "vox" && <div className="p-vox-art"><span>VOICE / CONTEXT / RESPONSE</span><div className="p-wave">{Array.from({ length: 37 }, (_, i) => <i key={i} style={{ height: `${18 + Math.abs(Math.sin(i * 1.73)) * (i % 4 === 0 ? 65 : 38)}%` }} />)}</div><b><span>CONVERSATIONS</span><em>THAT CONTINUE.</em></b><small>STREAM · FAILOVER · REMEMBER</small></div>}
              {project.art === "florentix" && <div className="p-florentix-art"><span>PLANT HEALTH / HYBRID AI</span><b><span>HELP PLANTS</span><i>THRIVE.</i></b><svg className="p-leaf-orbit" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle className="p-leaf-frame" cx="50" cy="50" r="48.5" /><g className="p-leaf-lines"><path className="p-leaf-stem" d="M50 79 L50 63 M50 61 L50 45 M50 43 L50 22" /><path className="p-leaf-shape" d="M50 62 C44 50 35 45 27 49 C28 59 37 65 50 62 Z" /><path className="p-leaf-vein" d="M50 62 Q39 54 27 49" /><path className="p-leaf-shape" d="M50 62 C56 50 65 45 73 49 C72 59 63 65 50 62 Z" /><path className="p-leaf-vein" d="M50 62 Q61 54 73 49" /><path className="p-leaf-shape" d="M50 44 C44 32 35 27 27 31 C28 41 37 47 50 44 Z" /><path className="p-leaf-vein" d="M50 44 Q39 36 27 31" /><path className="p-leaf-shape" d="M50 44 C56 32 65 27 73 31 C72 41 63 47 50 44 Z" /><path className="p-leaf-vein" d="M50 44 Q61 36 73 31" /></g></svg></div>}
              <span className="p-project-mark">{project.mark}</span><span className="p-visual-open"><ArrowUpRight size={19} /></span>
            </button>
            <div className="p-project-info"><div><div className="p-project-title"><h3>{project.name}</h3></div><p className="p-project-kind">{project.kind}</p><p className="p-project-summary">{project.summary}</p><div className="p-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></div><button className="p-project-link" type="button" onClick={() => setSelectedProject(project)} aria-label={`View ${project.name} details`}><ArrowRight size={16} /></button></div>
          </article>)}</div>
        </section>

        <EngineeringNotebook />
        <section className="p-about" id="about"><div className="p-about-label p-reveal"><span className="p-kicker">03 / About</span><div className="p-about-card"><div className="p-about-orbit" aria-hidden="true"><i /><b></b></div><span className="p-about-card-index">FIELD NOTES / 01</span><strong>Curious<br /><em>to build.</em></strong><span className="p-about-card-foot"><i /> Ideas into useful things</span></div><span className="p-about-line">Curious by nature. Builder by practice.</span></div><div className="p-about-content p-reveal"><h2>Curious by nature.<br />Driven to build.</h2><p>I’m a B.Tech Computer Science and Engineering student at Sri Manakula Vinayagar Engineering College, with a growing focus on Java backend development, application architecture, and practical AI integration.</p><p>I enjoy understanding how systems work beneath the interface — how APIs connect, how data moves, how applications stay organized, and how small engineering decisions shape the final product.</p><p>My approach is simple: learn the fundamentals, build something tangible, test what works, and improve what doesn’t. I’m still growing as an engineer, and every project is an opportunity to get better.</p><div className="p-education"><span className="p-kicker">Currently studying</span><div><b>B.Tech · Computer Science & Engineering</b><span>Sri Manakula Vinayagar Engineering College <i>2024–2028</i></span></div><strong>8.91 <small>CGPA / 10</small></strong></div></div></section>

        <section className="p-capabilities" id="elsewhere"><div className="p-section-heading p-cap-heading p-reveal"><div><span className="p-kicker">04 / Tools &amp; engineering</span><h2>Tools are useful.<br /><em>Understanding matters.</em></h2></div><p className="p-section-intro">The technologies I use, the fundamentals I practice, and the engineering skills I’m actively developing.</p></div><div className="p-expertise p-reveal"><article className="p-skill-feature p-java-feature"><div className="p-skill-feature-head"><span className="p-skill-icon"><Server size={20} /></span><div><span className="p-kicker">01 / Career focus</span><h3>Java Backend <em>Development</em></h3></div><span className="p-skill-primary">PRIMARY FOCUS</span></div><p className="p-skill-feature-copy">Developing Java-based backend applications using the Spring ecosystem, REST APIs, database persistence, authentication, and API testing. Familiar with Spring Security fundamentals and continuing to strengthen backend engineering skills.</p><div className="p-java-groups"><section className="p-java-group p-java-core"><span className="p-skill-label">CORE BACKEND</span><div className="p-java-emphasis"><b>Java</b><b>Spring Boot</b></div><div className="p-tech-list"><span className="p-tech-chip">Spring Framework</span><span className="p-tech-chip">Spring MVC</span></div></section><section className="p-java-group"><span className="p-skill-label">DATA PERSISTENCE</span><div className="p-tech-list"><span className="p-tech-chip">Spring Data JPA</span><span className="p-tech-chip">Hibernate / JPA</span><span className="p-tech-chip">MySQL</span></div></section><section className="p-java-group"><span className="p-skill-label">API DEVELOPMENT &amp; TESTING</span><div className="p-tech-list"><span className="p-tech-chip">REST APIs</span><span className="p-tech-chip">Postman</span><span className="p-tech-chip">Request / response debugging</span></div></section><section className="p-java-group"><span className="p-skill-label">AUTHENTICATION &amp; SECURITY</span><div className="p-tech-list"><span className="p-tech-chip">JWT authentication</span><span className="p-tech-chip">Spring Security · basic knowledge</span></div></section></div><div className="p-skill-proof"><span>PROJECT EVIDENCE</span><span>Java + Spring Boot REST API · CodeSentry</span><button onClick={() => { const project = projects.find((item) => item.slug === "codesentry"); if (project) setSelectedProject(project); }} type="button">View CodeSentry <ArrowUpRight size={14} /></button></div></article><div className="p-expertise-grid">{skillGroups.map((group) => { const Icon = group.Icon; return <article className="p-expertise-card" key={group.number}><div className="p-expertise-head"><span className="p-skill-icon"><Icon size={18} /></span><div><span className="p-kicker">{group.number} / Expertise</span><h3>{group.title}</h3></div></div><p className="p-expertise-description">{group.description}</p>{group.clusters.map((cluster) => <div className="p-skill-cluster" key={cluster.label}><span className="p-skill-label">{cluster.label}</span><div className="p-tech-list">{cluster.items.map((item) => <span className="p-tech-chip" key={item}>{item}</span>)}</div></div>)}<ul className="p-expertise-points">{group.points.map((point) => <li key={point}>{point}</li>)}</ul>{group.projects && <div className="p-skill-projects"><span>APPLIED IN</span>{group.projects.map((project) => <button key={project.slug + project.label} type="button" onClick={() => { const match = projects.find((item) => item.slug === project.slug); if (match) setSelectedProject(match); }} aria-label={`Open ${project.label} project case study`}>{project.label}<ArrowUpRight size={12} /></button>)}</div>}</article>; })}</div><section className="p-profile-section" aria-labelledby="coding-profiles-title"><div className="p-profile-heading"><div><span className="p-kicker">Practice beyond projects</span><h3 id="coding-profiles-title">Thinking in code.</h3></div><p>Consistent problem-solving practice helps me strengthen Java fundamentals, sharpen logical thinking, and approach unfamiliar problems methodically.</p></div><div className="p-profile-grid"><PixelCard as="a" href="https://leetcode.com/u/sanjayd11/" target="_blank" rel="noopener noreferrer" className="p-profile-card p-profile-leetcode" colors={dark ? profilePixelPalettes.leetcode.dark : profilePixelPalettes.leetcode.light} glowColor="#f0a43b" theme={dark ? "dark" : "light"} origin="pointer" trigger="hover" gap={8} speed={25} pixelSize={2.5} revealDuration={560} spotlight={0.62} glow={0.24} fade={0.3} opacity={0.82} introDelay={0}><span className="p-profile-mark" aria-hidden="true">LC</span><span className="p-profile-name">LeetCode <ArrowUpRight size={16} /></span><strong className="p-profile-stat">400<span>+</span></strong><span className="p-profile-detail">problems solved using Java</span><span className="p-profile-cta">View LeetCode profile ↗</span></PixelCard><PixelCard as="a" href="https://www.skillrack.com/faces/resume.xhtml?id=523028&amp;key=fbae23e9830a0b142676603d778abe1f44f9939e" target="_blank" rel="noopener noreferrer" className="p-profile-card p-profile-skillrack" colors={dark ? profilePixelPalettes.skillrack.dark : profilePixelPalettes.skillrack.light} glowColor="#8068e8" theme={dark ? "dark" : "light"} origin="pointer" trigger="hover" gap={8} speed={25} pixelSize={2.5} revealDuration={560} spotlight={0.62} glow={0.24} fade={0.3} opacity={0.82} introDelay={110}><span className="p-profile-mark" aria-hidden="true">SR</span><span className="p-profile-name">SkillRack <ArrowUpRight size={16} /></span><strong className="p-profile-stat p-profile-score">856</strong><span className="p-profile-detail">overall score</span><span className="p-profile-scores"><i>C <b>567</b></i><i>Python 3 <b>224</b></i><i>Java <b>37</b></i><i>SQL <b>28</b></i></span><span className="p-profile-cta">View SkillRack profile ↗</span></PixelCard><PixelCard as="a" href="https://www.geeksforgeeks.org/profile/sanjayd11" target="_blank" rel="noopener noreferrer" className="p-profile-card p-profile-gfg" colors={dark ? profilePixelPalettes.gfg.dark : profilePixelPalettes.gfg.light} glowColor="#45a977" theme={dark ? "dark" : "light"} origin="pointer" trigger="hover" gap={8} speed={25} pixelSize={2.5} revealDuration={560} spotlight={0.62} glow={0.24} fade={0.3} opacity={0.82} introDelay={220}><span className="p-profile-mark" aria-hidden="true">GfG</span><span className="p-profile-name">GeeksforGeeks <ArrowUpRight size={16} /></span><strong className="p-profile-gfg-title">Code. Learn. Repeat.</strong><span className="p-profile-detail">Another space for coding practice and learning</span><span className="p-profile-cta">View GeeksforGeeks profile ↗</span></PixelCard></div></section></div></section>

        <section className="p-credentials"><div className="p-credentials-heading p-reveal"><div><span className="p-kicker">05 / Continuous learning</span><h2>Learning,<br /><em>put into practice.</em></h2></div><p>Courses, certifications, and technical foundations gathered while exploring programming, data science, AI, cloud computing, and networking.</p></div><div className="p-credential-list">{credentials.slice(0, showCredentials ? credentials.length : 3).map((credential, index) => <a key={credential.title} className="p-credential" href={credential.href} target="_blank" rel="noreferrer"><span className="p-credential-num">0{index + 1}</span><span className="p-credential-name">{credential.title}</span><span className="p-credential-issuer">{credential.issuer}</span><ArrowUpRight size={15} /></a>)}</div><button className="p-show-more" onClick={() => setShowCredentials(!showCredentials)}>{showCredentials ? "Show fewer" : "Show all 9 credentials"}<ArrowRight size={15} /></button></section>

        <section className="p-contact p-reveal" id="contact"><div className="p-contact-main"><div className="p-contact-top"><span className="p-kicker">06 / Let’s connect</span><span className="p-contact-aside">Have an idea, a collaboration in mind, or an interesting engineering problem? I’d love to hear about it.</span></div><h2>Let’s build<br /><em>something useful.</em></h2><a className="p-email" href="mailto:sanjayraju5164@gmail.com">sanjayraju5164@gmail.com <ArrowUpRight size={20} /></a>
          <form className="p-contact-form" onSubmit={sendContactMessage}>
            <div className="p-contact-form-heading"><span className="p-kicker">For project discussions, opportunities, and collaborations.</span><span>HAVE A PROJECT IN MIND?</span></div>
            <div className="p-form-grid"><label>YOUR NAME<input name="name" type="text" autoComplete="name" placeholder="How should I address you?" minLength={2} maxLength={100} required /></label><label>YOUR EMAIL<input name="email" type="email" autoComplete="email" placeholder="Where can I reach you?" maxLength={160} required /></label></div>
            <label>YOUR MESSAGE<textarea name="message" placeholder="Tell me a little about your idea..." minLength={10} maxLength={4000} rows={5} required /></label>
            <label className="p-form-trap" aria-hidden="true">Leave this field empty<input name="company_website" type="text" tabIndex={-1} autoComplete="off" /></label>
            <div className="p-form-submit-row"><button className="p-form-submit" type="submit" disabled={contactSending}><span className="p-submit-label">{contactSending ? "Sending…" : "Send your message"}</span><ArrowUpRight size={18} /></button><p className={`p-form-status ${contactStatus.startsWith("Thanks") ? "is-success" : contactStatus.startsWith("Your message couldn’t") ? "is-error" : ""}`} role="status" aria-live="polite">{contactStatus}</p></div>
          </form>
          <div className="p-contact-bottom"><span>ALWAYS LEARNING. ALWAYS BUILDING.</span></div></div><ProjectIconCloud /></section>
      </main>
      <ProjectDetailsDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
      <footer className="p-footer"><a className="p-wordmark" href="#top">SD<span>.</span></a><nav className="p-footer-dock" aria-label="Social links"><a href="https://github.com/SanjayD11" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" title="GitHub"><Github size={15} /><span data-label="GitHub">GitHub</span></a><a href="https://www.linkedin.com/in/sanjay-d-354776353" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" title="LinkedIn"><Linkedin size={15} /><span data-label="LinkedIn">LinkedIn</span></a><a href="mailto:sanjayraju5164@gmail.com" aria-label="Email Sanjay" title="Email"><Mail size={15} /><span data-label="Email">Email</span></a></nav><span className="p-footer-note">Made with care. Built to keep improving.</span><a className="p-footer-top" href="#top">Back to top ↑</a><span className="p-footer-copyright">© {new Date().getFullYear()} Sanjay Dharmarajou</span></footer>
      </div>
    </>
  );
};

export default Index;




