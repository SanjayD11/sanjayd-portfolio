import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Download, Mail, Sparkles } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import heroCoderImg from "@/assets/hero-coder.gif";

const roles = ["Logic-Driven Coder", "Java Developer", "Automation Builder", "AI Enthusiast"];
const techBadges = ["Java", "Python", "React", "SQL", "n8n", "AI"];

const floatingCode = [
  { code: "class Solution {", top: "12%", left: "5%", delay: 0, speed: 8 },
  { code: "public static void main()", top: "22%", right: "6%", delay: 1, speed: 10 },
  { code: "SELECT * FROM skills", bottom: "35%", left: "3%", delay: 2, speed: 7 },
  { code: "import React from 'react'", bottom: "18%", right: "4%", delay: 3, speed: 9 },
  { code: "def automate():", top: "55%", left: "7%", delay: 1.5, speed: 11 },
  { code: "const ai = await train()", top: "40%", right: "10%", delay: 2.5, speed: 8 },
  { code: "git push origin main", bottom: "45%", right: "15%", delay: 0.5, speed: 12 },
];

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const current = roles[roleIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayed(current.slice(0, displayed.length + 1));
          if (displayed.length === current.length) {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          setDisplayed(current.slice(0, displayed.length - 1));
          if (displayed.length === 0) {
            setIsDeleting(false);
            setRoleIndex((prev) => (prev + 1) % roles.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, roleIndex]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center section-padding overflow-hidden"
    >
      {/* Parallax floating code snippets */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {floatingCode.map((item, i) => (
          <motion.span
            key={i}
            className="absolute font-mono text-[11px] text-primary/10 select-none hidden lg:block"
            style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0], y: [0, -15, 0] }}
            transition={{
              delay: item.delay,
              duration: item.speed,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {item.code}
          </motion.span>
        ))}
      </motion.div>

      {/* Ambient glow orbs */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full opacity-[0.08] blur-[80px]"
        style={{ background: "hsl(var(--primary))", top: "20%", left: "20%", y: bgY }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-[250px] h-[250px] rounded-full opacity-[0.06] blur-[80px]"
        style={{ background: "hsl(var(--accent))", bottom: "20%", right: "20%", y: bgY }}
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div className="max-w-5xl mx-auto z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12" style={{ y: contentY, opacity }}>
        {/* Text content */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          {/* Greeting */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={14} className="text-primary" />
            <span className="text-xs md:text-sm tracking-widest uppercase text-muted-foreground">
              Hello, I'm
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            className="text-5xl sm:text-7xl md:text-8xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.3 }}
          >
            <span className="text-gradient-animated">Sanjay</span>{" "}
            <span className="text-foreground">Dharmarajou</span>
          </motion.h1>

          {/* Typing role */}
          <motion.div
            className="h-8 md:h-10 mb-8 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="text-lg md:text-xl text-muted-foreground font-mono">
              {"< "}
              {displayed}
              <motion.span
                className="text-primary"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                |
              </motion.span>
              {" />"}
            </span>
          </motion.div>

          {/* Tech badges */}
          <motion.div
            className="flex flex-wrap justify-center lg:justify-start gap-3 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {techBadges.map((badge, i) => (
              <motion.span
                key={badge}
                className="px-4 py-1.5 rounded-full glass text-xs font-mono text-primary border border-primary/20 cursor-default"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1, type: "spring" }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 20px hsl(var(--primary) / 0.2)",
                }}
              >
                {badge}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-wrap justify-center lg:justify-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <motion.a
              href="#projects"
              className="btn-shine px-8 py-3 rounded-full font-semibold text-sm text-primary-foreground"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                boxShadow: "0 4px 20px hsl(var(--primary) / 0.25)",
              }}
              whileHover={{ y: -2, boxShadow: "0 8px 30px hsl(var(--primary) / 0.35)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                View Projects <ArrowDown size={14} />
              </span>
            </motion.a>
            <motion.a
              href="/Sanjay_D_Resume.pdf"
              download="Sanjay_D_Resume.pdf"
              className="btn-shine px-8 py-3 rounded-full glass text-foreground font-semibold text-sm border border-border/50 hover:border-primary/40 transition-colors duration-300"
              whileHover={{ y: -2, boxShadow: "0 8px 25px hsl(var(--primary) / 0.1)" }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Download size={14} /> Download Resume
              </span>
            </motion.a>
            <motion.a
              href="#contact"
              className="btn-shine px-8 py-3 rounded-full glass text-foreground font-semibold text-sm border border-border/50 hover:border-primary/40 transition-colors duration-300"
              whileHover={{ y: -2, boxShadow: "0 8px 25px hsl(var(--primary) / 0.1)" }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Mail size={14} /> Contact Me
              </span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Hero illustration */}
        <motion.div
          className="flex-shrink-0 hidden lg:block"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.5 }}
        >
          <motion.img
            src={heroCoderImg}
            alt="Developer coding illustration"
            className="w-[340px] xl:w-[400px] drop-shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        style={{ opacity }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50">Scroll</span>
          <ArrowDown size={16} className="text-muted-foreground/40" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
