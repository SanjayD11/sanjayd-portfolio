import { motion } from "framer-motion";
import SectionReveal from "./SectionReveal";
import { Bot, Cpu, Workflow, Zap } from "lucide-react";

const items = [
  { icon: Workflow, title: "n8n Workflow Automation", desc: "Building complex automated workflows for data processing and integration" },
  { icon: Zap, title: "API Integrations", desc: "Connecting services and building seamless data pipelines" },
  { icon: Cpu, title: "AI Systems", desc: "Experimenting with NLP, ML models and intelligent analysis tools" },
  { icon: Bot, title: "ResumeLens-AI", desc: "Built an AI-powered resume analyzer with NLP and ATS scoring" },
];

const AISection = () => {
  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <SectionReveal>
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">AI & Automation</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-12">
            Building the <span className="text-gradient-animated">Future</span>
          </h2>
        </SectionReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <SectionReveal key={item.title} delay={i * 0.08}>
              <motion.div
                className="glass rounded-2xl p-6 flex gap-4 items-start border border-border/50 group hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
                whileHover={{
                  y: -5,
                  rotateX: 2,
                  rotateY: 1,
                  boxShadow: "0 25px 50px hsl(var(--primary) / 0.1)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <motion.div
                  className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 group-hover:bg-primary/20 transition-all duration-300 relative"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                >
                  <item.icon size={22} />
                </motion.div>
                <div className="relative">
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AISection;
