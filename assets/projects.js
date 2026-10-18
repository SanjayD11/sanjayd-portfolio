(() => {
  const projects = [
    {
      number: "01", slug: "codesentry", architectureTitle: "CodeSentry — Static Analysis and AI-Assisted Security", name: "CodeSentry", category: "AI & tools", categoryDetail: "Application Security · Static Analysis · Applied AI", kind: "STATIC ANALYSIS / AI-ASSISTED SECURITY",
      subtitle: "AI-assisted source code security analysis",
      summary: "Analyze uploaded source code, identify potential vulnerabilities through static analysis, map findings to security classifications, and generate reports enriched with AI explanations.",
      stack: ["Java 17", "Spring Boot", "React", "MySQL", "Spring Security", "JWT", "REST APIs", "OpenRouter", "Groq"], art: "codesentry", mark: "CS / SAST",
      overview: "Analyze uploaded source files with deterministic static rules, classify findings, and add AI-generated explanations and remediation guidance. Results help guide review; they do not guarantee detection or replace a security audit.",
      problem: "Reviewing source code for security issues takes time and knowledge of common weaknesses. A list of matches alone is hard to prioritize, so the project pairs file-level evidence and severity with explanations and remediation guidance.",
      features: ["Authenticated project and scan workflows", "ZIP integrity, extension, and duplicate-file validation", "Deterministic static scans with language-specific rule engines", "Findings with severity, affected file, and evidence", "AI enrichment for explanations, remediation, and summaries", "Scan history and generated PDF reports"],
      implementation: "The React/Vite client calls a Java 17 Spring Boot REST API. Spring Security and JWT protect user routes; upload and scan services validate archives, select scanners, and persist projects, files, scan history, and vulnerabilities through Spring Data JPA to MySQL. AI enrichment runs after deterministic analysis through the configured provider chain (OpenRouter with Groq fallback); a Gemini provider is also present. PDF reports are generated from saved scan findings.",
      contribution: "The repository shows work across the upload and scan pipeline, language rule engines, authentication, AI-assisted finding enrichment, project and scan views, and PDF report generation. This describes the implementation areas visible in the academic project repository without assigning team roles or claiming performance results.",
      repository: "https://github.com/SanjayD11/codesentry", live: "https://codesentry-wheat.vercel.app", documentation: "https://github.com/SanjayD11/codesentry#readme"
    },
    {
      number: "02", slug: "nourishnet", architectureTitle: "NourishNet — Community Food Sharing", name: "NourishNet", category: "Product", categoryDetail: "Community food platform", kind: "COMMUNITY / FOOD SHARING",
      subtitle: "Community-powered food sharing", summary: "Connect food donors with people who need it through a community-focused platform designed to make food sharing easier and reduce avoidable waste.",
      stack: ["React", "TypeScript", "Supabase", "PostgreSQL", "Pollinations Vision"], art: "nourish", mark: "N / N",
      overview: "Connect food donors with people who need it through a community-focused platform designed to make food sharing easier and reduce avoidable waste.",
      problem: "Useful food can go to waste while people nearby face food insecurity. NourishNet gives donors and requesters a shared way to discover and coordinate free food.",
      features: ["Donor and requester account flows", "Create and browse surplus-food listings", "Request management and status tracking", "Ratings and community trust features", "Pollinations AI food-safety and health scanner", "Supabase-backed authentication and data", "Realtime updates for changing listings and requests"],
      implementation: "The React and TypeScript client connects to Supabase Auth, PostgreSQL, Realtime, and Storage for accounts, listings, requests, and profile media. The food-safety scanner calls Pollinations AI Vision from the app and returns analysis alongside food posts. Supabase subscriptions keep post and request status current.",
      contribution: "The repository demonstrates end-to-end product work across the React interface, listing and request flows, Supabase integration, and realtime user experience. This case study sticks to functions documented in the repository rather than assigning unverified team responsibilities.",
      repository: "https://github.com/SanjayD11/NourishNet", live: "https://nourish-net-sepia.vercel.app", documentation: "https://github.com/SanjayD11/NourishNet#readme"
    },
    {
      number: "03", slug: "resumelens", architectureTitle: "ResumeLens-AI — Resume and Job Description Analysis", name: "ResumeLens-AI", category: "AI & tools", categoryDetail: "RESUME ANALYSIS / JOB ALIGNMENT", kind: "Private resume analysis",
      subtitle: "AI-assisted resume analysis", summary: "Compare a resume with a target job description, uncover relevant skill gaps, and turn ATS-oriented insights into practical improvements for your next application.",
      stack: ["Python", "Streamlit", "PyPDF2", "Groq", "LLaMA 3.3", "ReportLab", "Matplotlib"], art: "lens", mark: "R—L",
      overview: "Compare a resume with a target job description, surface relevant skill gaps, and turn ATS-oriented insights into practical improvements for the next application.",
      problem: "Applicants often have to guess whether their resume reflects the language and requirements of a role. ResumeLens makes that comparison easier to review and gives users specific next steps.",
      features: ["Resume PDF upload and text extraction", "Job-description-aware skill and keyword analysis", "ATS compatibility scoring", "AI-generated explanations and improvement suggestions", "Resume rewriting and tailored interview questions", "PDF report export with visualizations"],
      implementation: "The Python Streamlit app accepts a resume PDF and job description, extracts text with PyPDF2, and combines ATS and skill-match analysis with Groq-hosted LLaMA 3.3 70B inference. Matplotlib builds report visuals and ReportLab generates downloadable PDF reports.",
      contribution: "The repository documents a Python application that joins document parsing, scoring logic, model prompts, and a user-facing analysis flow. The public repository also lists the deployed Streamlit app; no claims about local-only inference are made here.",
      repository: "https://github.com/SanjayD11/ResumeLens-AI", live: "https://resumelens-ai-zbmgxvbryjqi4ifytqh3kf.streamlit.app", documentation: "https://github.com/SanjayD11/ResumeLens-AI#readme"
    },
    {
      number: "04", slug: "intellivox", architectureTitle: "IntelliVox — Context-Aware Voice Conversations", name: "IntelliVox", category: "AI & tools", categoryDetail: "AI · Voice interface", kind: "VOICE / CONTEXT / RESPONSE",
      subtitle: "Context-aware voice intelligence", summary: "Explore hands-free AI conversations with streaming responses, spoken interaction, and retained context designed to make voice-based experiences feel more natural.",
      stack: ["React", "TypeScript", "Supabase", "Edge Functions", "Groq", "Pollinations", "SSE", "Web Speech API"], art: "vox", mark: "listen ↗",
      overview: "Explore hands-free AI conversations with streaming responses, spoken interaction, and retained context designed to make voice-based experiences feel more natural.",
      problem: "Voice assistants can feel slow or forgetful when replies arrive in one block or conversation history disappears. IntelliVox streams responses, remembers chat context, and falls back to another provider when needed.",
      features: ["Hands-free speech recognition and voice replies", "Server-Sent Events response streaming", "Groq primary provider with Pollinations fallback", "Context-aware chat with saved messages and profile settings", "Multilingual voice options and live captions"],
      implementation: "The React 18 and TypeScript client uses browser speech recognition and synthesis for voice interaction. Requests go to a Supabase Edge Function, which streams responses over SSE, tries Groq first, then Pollinations as fallback. Supabase Auth, Database, and Storage persist user profiles, settings, and chat history.",
      contribution: "The repository documents and implements the voice controls, live response UI, Supabase Edge Function, Groq-to-Pollinations fallback, and saved chat/profile state. The project combines frontend speech APIs with server-side AI routing and Supabase persistence.",
      repository: "https://github.com/SanjayD11/IntelliVox-Context-Aware-Voice-intelligence", live: "https://intelli-vox-context-aware-voice-int.vercel.app"
    },
    {
      number: "05", slug: "florentix-ai", architectureTitle: "Florentix AI — Hybrid Plant Health Insights", name: "Florentix AI", category: "Product", categoryDetail: "PLANT HEALTH / HYBRID AI", kind: "Plant health diagnostics",
      subtitle: "AI-assisted plant health insights", summary: "Combine image-based AI analysis with lightweight on-device inference to explore potential plant health issues and provide accessible diagnostic guidance.",
      stack: ["Vanilla JS", "FastAPI", "Gemma 3 Vision", "TensorFlow Lite", "Firebase"], art: "florentix", mark: "F / AI",
      overview: "Combine image-based AI analysis with lightweight on-device inference to explore potential plant health issues and provide accessible diagnostic guidance.",
      problem: "Plant disease symptoms can be difficult to identify early, especially without immediate access to specialist help. The app aims to make an initial plant-health review more accessible using an image and an AI-assisted explanation.",
      features: ["Plant image upload with client-side compression", "FastAPI inference service", "Gemma 3 vision requests through OpenRouter", "TensorFlow Lite/XNNPACK fallback path", "Firebase authentication and Firestore persistence", "Streaming AI Botanist chat"],
      implementation: "The vanilla JavaScript frontend is deployed on Vercel and compresses image uploads before sending them to a Dockerized FastAPI service. The backend tries OpenRouter-hosted Gemma 3 vision models, then uses the packaged TensorFlow Lite/XNNPACK classifier for configured fallback cases. Firebase Auth and Firestore handle user identity and saved results/chat; the README lists Render for the backend deployment.",
      contribution: "The repository shows a hybrid AI product spanning frontend upload handling, asynchronous API orchestration, cloud vision inference, local model fallback, and Firebase persistence. The diagram follows the architecture described by the project README.",
      repository: "https://github.com/SanjayD11/florentix-ai", live: "https://florentix-ai.vercel.app", documentation: "https://github.com/SanjayD11/florentix-ai#readme"
    }
  ];
  window.PORTFOLIO_PROJECTS = projects;
})();







