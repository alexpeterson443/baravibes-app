import { useEffect, useRef, useCallback } from "react";

const PAWS = ["🐾"];
const TRAIL_INTERVAL = 150; // ms between paw prints

export default function CursorTrail() {
  const lastTime = useRef(0);

  const createPaw = useCallback((x: number, y: number) => {
    const el = document.createElement("div");
    el.textContent = PAWS[0];
    el.style.cssText = `
      position: fixed;
      left: ${x - 10}px;
      top: ${y - 10}px;
      font-size: 16px;
      pointer-events: none;
      z-index: 9999;
      animation: trailFade 0.8s ease forwards;
      opacity: 0.6;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }, []);

  useEffect(() => {
    // Only show on desktop (no touch)
    const isMobile = "ontouchstart" in window;
    if (isMobile) return;

    const handleMove = (e: MouseEvent) => {
      // Check if cursor trail is disabled via user preferences
      const trailSetting = document.documentElement.dataset.cursorTrail;
      if (trailSetting === "off") return;

      const now = Date.now();
      if (now - lastTime.current < TRAIL_INTERVAL) return;
      lastTime.current = now;
      createPaw(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [createPaw]);

  return null;
}
