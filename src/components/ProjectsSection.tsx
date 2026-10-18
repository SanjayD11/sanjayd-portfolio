import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import SectionReveal from "./SectionReveal";
import { ExternalLink, Github, Star, Eye } from "lucide-react";
import ProjectDetailModal, { type ProjectDetail } from "./ProjectDetailModal";
import { ResumeLensDiagram, NourishNetDiagram, IntelliVoxDiagram } from "./ArchitectureDiagrams";

/* ── Project data with detail info ──────────────────────────────────────── */

const featuredDetail: ProjectDetail = {
  title: "NourishNet",
  subtitle: "Free Food Sharing Platform",
  tech: ["React", "TypeScript", "Supabase"],
  link: "https://github.com/SanjayD11/NourishNet",
  overview: "A community-driven platform connecting food donors with those in need, enabling real-time food sharing with full authentication, request management, and user ratings.",
  problem: "Food waste remains a critical issue while many people lack access to meals. NourishNet bridges this gap by providing a seamless digital platform for food redistribution.",
  features: [
    "Full authentication system with role-based access (Donor/Requester)",
    "Real-time database for food listings & requests via Supabase",
    "Request management with status tracking and notifications",
    "User rating system for trust and accountability",
    "Responsive UI built with React and TypeScript",
  ],
  challenges: [
    "Implementing real-time subscriptions for live status updates",
    "Designing role-based access control with Row Level Security",
    "Optimizing query performance for large food listing datasets",
  ],
  performance: [
    "Sub-200ms database query response times",
    "Real-time updates with zero polling overhead",
    "Lighthouse performance score > 90",
  ],
  diagram: <NourishNetDiagram />,
};

const projectDetails: ProjectDetail[] = [
  {
    title: "ResumeLens-AI",
    subtitle: "AI-Powered Resume Analyzer",
    tech: ["Python", "NLP", "Machine Learning"],
    link: "https://github.com/SanjayD11/ResumeLens-AI",
    overview: "An intelligent resume analysis tool that uses LLaMA 3 to extract skills, score ATS compatibility, and provide actionable improvement suggestions through a Streamlit interface.",
    problem: "Job seekers struggle to optimize resumes for ATS systems. ResumeLens-AI automates this process using local AI inference for privacy-first analysis.",
    features: [
      "PDF resume parsing with PyPDF2",
      "Skill extraction using NLP and LLaMA 3",
      "ATS compatibility scoring algorithm",
      "Readability analysis and content feedback",
      "PDF report generation with ReportLab",
    ],
    challenges: [
      "Running LLaMA 3 locally via Ollama for privacy and speed",
      "Accurate skill extraction across varied resume formats",
      "Generating meaningful ATS scores without proprietary ATS access",
    ],
    performance: [
      "Local AI inference — no data leaves the machine",
      "Full analysis completed in under 10 seconds",
      "Supports multi-page resume parsing",
    ],
    diagram: <ResumeLensDiagram />,
  },
  {
    title: "IntelliVox",
    subtitle: "Context-Aware Voice Intelligence",
    tech: ["React", "TypeScript", "Tailwind CSS", "Supabase", "AI APIs"],
    link: "https://github.com/SanjayD11/IntelliVox-Context-Aware-Voice-intelligence",
    overview: "A real-time AI chat platform with streaming responses, automatic API failover between Groq and Pollinations, and full conversation history persistence.",
    problem: "Existing AI chat tools lack failover mechanisms and real-time streaming. IntelliVox provides resilient, fast AI conversations with usage analytics.",
    features: [
      "Real-time chat with streaming AI responses",
      "Dual API support: Groq (primary) + Pollinations (fallback)",
      "Automatic failover for high availability",
      "Conversation history with Supabase persistence",
      "Usage analytics dashboard",
    ],
    challenges: [
      "Implementing seamless failover between AI providers",
      "Streaming response rendering without UI jank",
      "Efficient conversation storage and retrieval",
    ],
    performance: [
      "First token in < 500ms via Groq API",
      "Zero-downtime failover to backup provider",
      "Accessibility-focused responsive design",
    ],
    diagram: <IntelliVoxDiagram />,
  },
];

/* ── Card data (minimal for listing) ────────────────────────────────────── */

const featured = {
  title: "NourishNet",
  subtitle: "Free Food Sharing Platform",
  tech: ["React", "TypeScript", "Supabase"],
  link: "https://github.com/SanjayD11/NourishNet",
  points: [
    "Full authentication system with role-based access",
    "Real-time database for food listings & requests",
    "Request management with status tracking",
    "Notification system & user ratings",
  ],
};

const projects = [
  {
    title: "ResumeLens-AI",
    subtitle: "AI-Powered Resume Analyzer",
    tech: ["Python", "NLP", "Machine Learning"],
    icon: null,
    link: "https://github.com/SanjayD11/ResumeLens-AI",
    points: [
      "Extracts skills & keywords using NLP",
      "Provides ATS compatibility score",
      "Suggests resume improvements",
      "Real-time analysis interface",
    ],
  },
  {
    title: "IntelliVox",
    subtitle: "Context-Aware Voice Intelligence",
    tech: ["React", "TypeScript", "Tailwind CSS", "Supabase", "AI APIs"],
    icon: null,
    link: "https://github.com/SanjayD11/IntelliVox-Context-Aware-Voice-intelligence",
    points: [
      "Speech recognition & AI voice response",
      "Supabase PostgreSQL backend",
      "Accessibility-focused design",
    ],
  },
];

/* ── Component ──────────────────────────────────────────────────────────── */

const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);

  const openDetail = useCallback((title: string) => {
    if (title === "NourishNet") {
      setSelectedProject(featuredDetail);
    } else {
      const detail = projectDetails.find((d) => d.title === title);
      if (detail) setSelectedProject(detail);
    }
  }, []);

  return (
    <section id="projects" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <SectionReveal>
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Projects</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-12">
            Featured <span className="text-gradient-animated">Work</span>
          </h2>
        </SectionReveal>

        {/* Featured - NourishNet */}
        <SectionReveal delay={0.1}>
          <motion.div
            className="glass rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden border border-primary/15 group"
            whileHover={{
              y: -6,
              rotateX: 1,
              rotateY: 1,
              boxShadow: "0 30px 60px hsl(var(--primary) / 0.12)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <motion.div
              className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Star size={12} /> Featured
            </motion.div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-1 relative">{featured.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 relative">{featured.subtitle}</p>
            <div className="flex flex-wrap gap-2 mb-4 relative">
              {featured.tech.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-secondary/80 text-xs text-muted-foreground border border-border/30">
                  {t}
                </span>
              ))}
            </div>
            <ul className="space-y-2 mb-6 relative">
              {featured.points.map((p) => (
                <li key={p} className="text-muted-foreground text-sm flex items-start gap-2">
                  <span className="text-primary mt-0.5">▹</span> {p}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 relative">
              <motion.button
                onClick={() => openDetail("NourishNet")}
                className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Eye size={14} /> Explore Project
              </motion.button>
              <motion.a
                href={featured.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Github size={14} /> GitHub <ExternalLink size={12} />
              </motion.a>
            </div>
          </motion.div>
        </SectionReveal>

        {/* Other projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <SectionReveal key={project.title} delay={0.15 + i * 0.1}>
              <motion.div
                className="glass rounded-2xl p-5 sm:p-6 h-full flex flex-col border border-border/50 group hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
                whileHover={{
                  y: -6,
                  rotateX: 2,
                  rotateY: 2,
                  boxShadow: "0 30px 60px hsl(var(--primary) / 0.1)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.03] to-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="flex items-center gap-2 mb-1 relative">
                  {project.icon && <project.icon size={18} className="text-primary" />}
                  <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3 relative">{project.subtitle}</p>
                <div className="flex flex-wrap gap-2 mb-4 relative">
                  {project.tech.map((t) => (
                    <span key={t} className="px-2.5 py-0.5 rounded-full bg-secondary/80 text-[11px] text-muted-foreground border border-border/30">
                      {t}
                    </span>
                  ))}
                </div>
                <ul className="space-y-1.5 mb-6 flex-1 relative">
                  {project.points.map((p) => (
                    <li key={p} className="text-muted-foreground text-sm flex items-start gap-2">
                      <span className="text-primary mt-0.5">▹</span> {p}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-3 relative">
                  <motion.button
                    onClick={() => openDetail(project.title)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors duration-300"
                    whileHover={{ x: 4, scale: 1.02 }}
                  >
                    <Eye size={14} /> Explore
                  </motion.button>
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300"
                    whileHover={{ x: 4, scale: 1.02 }}
                  >
                    <Github size={14} /> GitHub <ExternalLink size={12} />
                  </motion.a>
                </div>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
};

export default ProjectsSection;
