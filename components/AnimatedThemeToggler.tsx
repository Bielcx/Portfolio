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

    // Marca o <html> enquanto a transição roda. O fundo fica congelado em duas
    // fotos estáticas por ~400ms, mas o canvas do RippleGrid continua ao vivo e
    // troca de cor na hora — daria a cor nova do grid sobre o fundo antigo
    // (preto sobre creme no sentido claro→escuro, bem visível). A regra em
    // globals.css esconde o grid enquanto esta classe existe.
    document.documentElement.classList.add("theme-transitioning");

    const transition = document.startViewTransition(() => {
      flushSync(applyTheme);
    });

    transition.finished.finally(() => {
      document.documentElement.classList.remove("theme-transitioning");
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
        "text-ink-muted hover:text-ink transition-colors cursor-pointer",
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
