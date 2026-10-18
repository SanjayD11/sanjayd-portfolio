import { Code2, Database, Globe, Layers3, Server, Sparkles, Wrench } from "lucide-react";

const groups = [
  { title: "Core programming", Icon: Code2, items: ["Java · primary language", "Python", "C", "JavaScript", "SQL"] },
  { title: "Java backend", Icon: Server, items: ["Spring Boot · CodeSentry", "REST APIs", "Spring Security · JWT", "MySQL"] },
  { title: "Databases & data", Icon: Database, items: ["MySQL", "PostgreSQL · Supabase", "Oracle SQL · learning", "Queries · joins · CRUD"] },
  { title: "Frontend", Icon: Globe, items: ["HTML · CSS · JavaScript", "React · AI-assisted project experience", "TypeScript · AI-assisted project experience", "Tailwind CSS · Bootstrap · shadcn/ui"] },
  { title: "AI integration", Icon: Sparkles, items: ["LLM APIs", "Groq", "Applied AI in projects", "n8n · exploring"] },
  { title: "Tools & environment", Icon: Wrench, items: ["IntelliJ · VS Code · Eclipse", "Postman · Git · GitHub", "Docker · fundamentals", "Vercel · Supabase · Firebase · AWS Academy"] },
  { title: "Computer science foundations", Icon: Layers3, items: ["OOP", "Data structures & algorithms", "DBMS · operating systems", "SDLC · modular design · architecture"] },
];

const SkillsSection = () => (
  <section id="skills" className="section-padding">
    <div className="max-w-5xl mx-auto">
      <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Technical expertise</p>
      <h2 className="text-3xl md:text-5xl font-bold mb-8">How I <span className="text-gradient-animated">build.</span></h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map(({ title, Icon, items }) => (
          <article key={title} className="rounded-xl border border-border/60 bg-card/70 p-5">
            <div className="mb-4 flex items-center gap-3 text-primary"><Icon size={19} aria-hidden="true" /><h3 className="text-base font-semibold text-foreground">{title}</h3></div>
            <ul className="flex flex-wrap gap-2">{items.map((item) => <li key={item} className="rounded-md border border-border/70 px-2.5 py-1.5 text-xs text-muted-foreground">{item}</li>)}</ul>
          </article>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">React and TypeScript reflect AI-assisted project implementation, not a claim of independent mastery. Skill levels are described in context instead of percentage scores.</p>
    </div>
  </section>
);

export default SkillsSection;