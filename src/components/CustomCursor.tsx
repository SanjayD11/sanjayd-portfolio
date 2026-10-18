import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on non-touch devices
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setVisible(true);

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select, [data-hoverable]")) {
        setIsHovering(true);
      }
    };

    const handleOut = () => setIsHovering(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-screen"
        animate={{
          x: pos.x - (isHovering ? 24 : 18),
          y: pos.y - (isHovering ? 24 : 18),
          width: isHovering ? 48 : 36,
          height: isHovering ? 48 : 36,
          opacity: isHovering ? 0.6 : 0.3,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.5 }}
        style={{
          borderRadius: "50%",
          background: `radial-gradient(circle, hsl(var(--primary) / 0.5) 0%, hsl(var(--accent) / 0.2) 50%, transparent 70%)`,
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        animate={{
          x: pos.x - 3,
          y: pos.y - 3,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "hsl(var(--primary))",
          boxShadow: "0 0 10px hsl(var(--primary) / 0.5)",
        }}
      />
    </>
  );
};

export default CustomCursor;
