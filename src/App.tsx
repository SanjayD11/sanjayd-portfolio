import { useEffect } from "react";
import Lenis from "lenis";
import Index from "./pages/Index";

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      wheelMultiplier: 1,
      syncTouch: false,
      anchors: true,
      autoRaf: false,
      respectReducedMotion: true,
    });
    let rafId = 0;
    let disposed = false;
    const frame = (time: number) => {
      if (disposed || document.hidden || lenis.isStopped) {
        rafId = 0;
        return;
      }
      lenis.raf(time);
      rafId = lenis.isScrolling === "smooth" ? window.requestAnimationFrame(frame) : 0;
    };
    const wake = () => {
      if (!rafId && !disposed && !document.hidden && !lenis.isStopped) {
        // Lenis integrates elapsed frame time. Rebase its clock after idle so
        // the first frame cannot apply the entire sleep interval as one step.
        lenis.time = performance.now();
        rafId = window.requestAnimationFrame(frame);
      }
    };
    const onScroll = () => {
      (window as Window & { ScrollTrigger?: { update?: () => void } }).ScrollTrigger?.update?.();
      if (lenis.isScrolling === "smooth") wake();
    };
    const onScrollLock = (event: Event) => {
      if ((event as CustomEvent<boolean>).detail) {
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = 0;
        lenis.stop();
      } else {
        lenis.start();
      }
    };
    const onVirtualScroll = () => wake();
    const onAnchorIntent = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a[href^="#"]')) wake();
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = 0;
      } else wake();
    };
    lenis.on("scroll", onScroll);
    lenis.on("virtual-scroll", onVirtualScroll);
    window.addEventListener("portfolio:lenis-lock", onScrollLock);
    document.addEventListener("click", onAnchorIntent, true);
    document.addEventListener("visibilitychange", onVisibilityChange);
    const portfolioWindow = window as Window & { portfolioLenis?: Lenis; portfolioLenisWake?: () => void };
    portfolioWindow.portfolioLenis = lenis;
    portfolioWindow.portfolioLenisWake = wake;
    return () => {
      disposed = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("portfolio:lenis-lock", onScrollLock);
      document.removeEventListener("click", onAnchorIntent, true);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      lenis.off("scroll", onScroll);
      lenis.off("virtual-scroll", onVirtualScroll);
      lenis.destroy();
      delete portfolioWindow.portfolioLenis;
      delete portfolioWindow.portfolioLenisWake;
    };
  }, []);

  return <Index />;
};

export default App;
