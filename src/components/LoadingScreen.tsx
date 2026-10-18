import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  const clampedProgress = Math.min(progress, 100);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Ambient glow */}
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-[120px]" style={{ background: "hsl(var(--primary))" }} />

      {/* Name animation */}
      <motion.div className="relative z-10 mb-12">
        <motion.h1
          className="text-5xl sm:text-7xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span
            className="text-gradient inline-block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Sanjay
          </motion.span>{" "}
          <motion.span
            className="text-foreground inline-block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            D
          </motion.span>
        </motion.h1>
        <motion.p
          className="text-sm text-muted-foreground tracking-[0.3em] uppercase text-center mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Portfolio Loading
        </motion.p>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="relative z-10 w-64 sm:w-80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="h-1 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${clampedProgress}%`,
              background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
            }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground font-mono">{Math.round(clampedProgress)}%</span>
          <motion.span
            className="text-xs text-primary font-mono"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            loading...
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
