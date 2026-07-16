"use client";

import { motion, type MotionProps } from "motion/react";
import type { CSSProperties, ElementType } from "react";

interface LineShadowTextProps {
  children: string;
  shadowColor?: string;
  as?: ElementType;
  className?: string;
  delay?: number;
}

export function LineShadowText({
  children,
  shadowColor = "#b497cf",
  as: Component = "span",
  className = "",
  delay = 0.5,
}: LineShadowTextProps) {
  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      initial={{ "--shadow-offset": "0px" } as unknown as MotionProps["initial"]}
      animate={{ "--shadow-offset": "0.14em" } as unknown as MotionProps["animate"]}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      data-text={children}
      className={`relative inline-block after:absolute after:left-[var(--shadow-offset)] after:top-[var(--shadow-offset)] after:content-[attr(data-text)] after:text-[var(--shadow-color)] after:-z-10 ${className}`}
      style={{ "--shadow-color": shadowColor } as CSSProperties}
    >
      {children}
    </MotionComponent>
  );
}
