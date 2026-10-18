import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./RotatingText.css";

type RotatingTextProps = { texts: string[]; interval?: number; className?: string };

export default function RotatingText({ texts, interval = 2600, className = "" }: RotatingTextProps) {
  const [index, setIndex] = useState(0);
  const [phraseWidth, setPhraseWidth] = useState<number>();
  const measureRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const active = texts.length ? texts[index % texts.length] : "";

  useEffect(() => {
    if (reduced || texts.length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % texts.length), interval);
    return () => window.clearInterval(timer);
  }, [interval, reduced, texts.length]);

  useLayoutEffect(() => {
    const measure = () => {
      const width = measureRef.current?.getBoundingClientRect().width;
      if (width) setPhraseWidth((previous) => previous === width ? previous : width);
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <MotionConfig reducedMotion="user">
      <span className={`p-rotating-text ${className}`} style={phraseWidth ? { width: `${phraseWidth}px` } : undefined} aria-live="polite">
        <span className="p-rotating-text-label">{active}</span>
        <span className="p-rotating-text-measure" ref={measureRef} aria-hidden="true">{active}</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={index}
            className="p-rotating-text-value"
            aria-hidden="true"
            initial={reduced ? { opacity: 1 } : { y: "65%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { y: "-65%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {Array.from(active).map((character, characterIndex) => (
              <motion.span
                className="p-rotating-text-character"
                key={`${index}-${characterIndex}`}
                initial={reduced ? false : { y: "70%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 300, delay: reduced ? 0 : characterIndex * 0.014 }}
              >
                {character === " " ? "\u00a0" : character}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </span>
    </MotionConfig>
  );
}
