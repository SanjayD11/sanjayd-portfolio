import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Theme = "light" | "dark" | "system";

const icons = { light: Sun, dark: Moon, system: Monitor };
const order: Theme[] = ["light", "dark", "system"];

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("theme") as Theme) || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
      localStorage.setItem("theme", "system");

      const handler = (e: MediaQueryListEvent) => root.classList.toggle("dark", e.matches);
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else {
      root.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const cycle = () => {
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
  };

  const Icon = icons[theme];

  return (
    <motion.button
      onClick={cycle}
      className="p-2 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={`Theme: ${theme}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Icon size={16} />
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
