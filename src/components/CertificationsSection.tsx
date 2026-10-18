import { motion } from "framer-motion";
import SectionReveal from "./SectionReveal";
import { Award, ExternalLink, ShieldCheck } from "lucide-react";

const certs = [
  { title: "Joy of Computing using Python", org: "NPTEL", badge: "Elite", tags: ["Python", "Problem Solving"], link: "https://drive.google.com/file/d/1zj1VYgL0aPff7k78cWB6ha1hNckHnC0U/view", linkLabel: "View Certificate" },
  { title: "Python for Data Science", org: "NPTEL", badge: "Elite", tags: ["Python", "Data Science"], link: "https://drive.google.com/file/d/1WQ_OmbBvRALA7t1nCLfmdnMsXBAMOBpM/view", linkLabel: "View Certificate" },
  { title: "Machine Learning Foundation Certification", org: "Infosys", badge: "", tags: ["Machine Learning", "AI"], link: "https://drive.google.com/file/d/1HbJQ-ouqfcahr3oBLlBdj5IMkJRSRjQ9/view", linkLabel: "View Certificate" },
  { title: "MySQL Bootcamp", org: "Udemy", badge: "", tags: ["MySQL", "Database"], link: "https://www.udemy.com/certificate/UC-62fc0443-8f1a-4dcd-8ecd-55b84cebad32/", linkLabel: "View Certificate" },
  { title: "Build a Free Website with WordPress", org: "Coursera", badge: "", tags: ["WordPress", "Web Development"], link: "https://www.coursera.org/account/accomplishments/verify/X8YTXCGBELEQ", linkLabel: "View Certificate" },
  { title: "AWS Academy Graduate – Cloud Foundations", org: "AWS Academy", badge: "", tags: ["AWS", "Cloud"], link: "https://www.credly.com/badges/a8080ee5-de87-4c53-b04e-174bf00b6aaa/public_url", linkLabel: "Verify Badge" },
  { title: "AWS Academy Graduate – Cloud Architecting", org: "AWS Academy", badge: "", tags: ["AWS", "Cloud Architecture"], link: "https://www.credly.com/badges/5c7710ea-fe28-4f03-b979-a32760531885/public_url", linkLabel: "Verify Badge" },
  { title: "CCNA – Switching & Routing", org: "Cisco", badge: "", tags: ["Networking", "CCNA"], link: "https://www.credly.com/badges/d3f1ffaa-fc4f-4083-a8d4-7a7242e80903/public_url", linkLabel: "Verify Badge" },
  { title: "C Advanced", org: "Cisco Networking Academy", badge: "", tags: ["C", "Programming"], link: "https://www.credly.com/badges/c3581ee4-e51b-4c31-8a89-24ffe1566be7/public_url", linkLabel: "Verify Badge" },
];

const CertificationsSection = () => {
  return (
    <section id="certifications" className="section-padding">
      <div className="max-w-3xl mx-auto">
        <SectionReveal>
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Certifications</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-12">
            <span className="text-gradient-animated">Achievements</span>
          </h2>
        </SectionReveal>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-accent/30 to-transparent" />

          <div className="space-y-5">
            {certs.map((cert, i) => (
              <SectionReveal key={cert.title} delay={i * 0.06}>
                <motion.div
                  className="flex items-start gap-6 pl-12 relative group cursor-default"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {/* Timeline dot */}
                  <motion.div
                    className="absolute left-3 top-2 w-4 h-4 rounded-full border-2 border-primary bg-background group-hover:bg-primary/20 transition-colors duration-300"
                    whileInView={{ scale: [0, 1.3, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, type: "spring" }}
                  />

                  {/* Card */}
                  <motion.div
                    className="glass rounded-xl p-5 flex-1 border border-border/50 group-hover:border-primary/20 transition-all duration-500"
                    whileHover={{
                      rotateX: 2,
                      rotateY: 1,
                      boxShadow: "0 20px 40px hsl(var(--primary) / 0.08)",
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Award size={14} className="text-primary shrink-0" />
                      <span className="text-xs text-muted-foreground">{cert.org}</span>
                      {cert.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-semibold">
                          {cert.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-2">{cert.title}</h3>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {cert.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-secondary text-[10px] text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <motion.a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {cert.linkLabel === "Verify Badge" ? <ShieldCheck size={12} /> : <ExternalLink size={12} />}
                      {cert.linkLabel}
                    </motion.a>
                  </motion.div>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
