import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => {
            const portfolioWindow = window as Window & {
              portfolioLenis?: {
                isStopped?: boolean;
                start?: () => void;
                reset?: () => void;
                scrollTo: (target: number, options?: { duration?: number; easing?: (progress: number) => number }) => void;
              };
              portfolioLenisWake?: () => void;
            };
            const lenis = portfolioWindow.portfolioLenis;
            if (lenis) {
              if (lenis.isStopped) lenis.start?.();
              else lenis.reset?.();
              lenis.scrollTo(0, {
                duration: 2.1,
                easing: (progress) => progress * progress * progress * (progress * (progress * 6 - 15) + 10),
              });
              portfolioWindow.portfolioLenisWake?.();
            }
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full glass border border-primary/20 text-primary hover:shadow-lg hover:shadow-primary/20 transition-shadow duration-300"
          whileHover={{ scale: 1.1, boxShadow: "0 0 25px hsl(var(--primary) / 0.3)" }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
