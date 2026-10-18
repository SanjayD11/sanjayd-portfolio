import { motion } from "framer-motion";
import SectionReveal from "./SectionReveal";
import { GraduationCap } from "lucide-react";

const education = [
  { title: "B.Tech CSE", institution: "Sri Manakula Vinayagar Engineering College", period: "2024–2028", score: "CGPA: 8.91" },
  { title: "12th Standard", institution: "Higher Secondary", period: "", score: "95%" },
  { title: "10th Standard", institution: "Secondary School", period: "", score: "93.2%" },
];

const EducationSection = () => {
  return (
    <section className="section-padding">
      <div className="max-w-3xl mx-auto">
        <SectionReveal>
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Education</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-12">
            Academic <span className="text-gradient-animated">Journey</span>
          </h2>
        </SectionReveal>

        <div className="space-y-4">
          {education.map((edu, i) => (
            <SectionReveal key={edu.title} delay={i * 0.1}>
              <motion.div
                className="glass rounded-2xl p-6 border border-border/50 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <GraduationCap size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{edu.title}</h3>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    {edu.period && <p className="text-xs text-muted-foreground mt-1">{edu.period}</p>}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gradient">{edu.score}</span>
                  </div>
                </div>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
