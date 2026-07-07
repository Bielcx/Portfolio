"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function AnimatedThemeToggler({
  className,
  duration = 400,
}: {
  className?: string;
  duration?: number;
}) {
  const [isLight, setIsLight] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const light = localStorage.getItem("theme") === "light";
    document.documentElement.classList.toggle("light", light);
    setIsLight(light);
  }, []);

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const applyTheme = () => {
      const next = !isLight;
      document.documentElement.classList.toggle("light", next);
      setIsLight(next);
      localStorage.setItem("theme", next ? "light" : "dark");
    };

    if (typeof document.startViewTransition !== "function") {
      applyTheme();
      return;
    }

    const { top, left, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => {
      flushSync(applyTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }, [isLight, duration]);

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "text-[#948F85] hover:text-[#F3E6C4] light:text-neutral-500 light:hover:text-neutral-900 transition-colors cursor-pointer",
        className,
      )}
    >
      {isLight ? (
        <Moon size={18} weight="bold" />
      ) : (
        <Sun size={18} weight="bold" />
      )}
    </button>
  );
}
