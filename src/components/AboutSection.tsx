import { motion } from "framer-motion";
import SectionReveal from "./SectionReveal";
import { Award, BookOpen, Briefcase, GraduationCap } from "lucide-react";

const stats = [
  { icon: GraduationCap, label: "CGPA", value: "8.91" },
  { icon: Briefcase, label: "Major Projects", value: "4+" },
  { icon: Award, label: "Certifications", value: "9+" },
  { icon: BookOpen, label: "Full Stack", value: "Trainee" },
];

const AboutSection = () => {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <SectionReveal>
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">About Me</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            Crafting <span className="text-gradient-animated">Digital Excellence</span>
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-12">
            Passionate B.Tech CSE student building scalable, automation-driven and AI-powered solutions.
            Strong foundation in Java, SQL and full-stack development with a deep focus on clean
            architecture and performance.
          </p>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <SectionReveal key={stat.label} delay={0.15 + i * 0.1}>
                <motion.div
                className="glass glow-border rounded-2xl p-6 text-center border border-border/50 group hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Glass hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-accent/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <stat.icon className="mx-auto mb-3 text-primary group-hover:scale-110 transition-transform duration-300 relative" size={24} />
                <div className="text-2xl md:text-3xl font-bold text-gradient-animated mb-1 relative">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider relative">{stat.label}</div>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
