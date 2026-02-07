"use client";

import React, { ComponentPropsWithoutRef, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
}

export const Ripple = React.memo(function Ripple({
  mainCircleSize = 260,
  mainCircleOpacity = 0.38,
  numCircles = 4,
  className,
  ...props
}: RippleProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none",
        // softer mask — don’t kill visibility
        "[mask-image:linear-gradient(to_bottom,white_65%,transparent)]",
        className
      )}
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 90;
        const opacity = Math.max(mainCircleOpacity - i * 0.08, 0.08);
        const animationDelay = `${i * 0.8}s`;

        return (
          <div
            key={i}
            className={cn(
              "absolute rounded-full animate-ripple",
              "border",
              // stronger, softer glow
              "shadow-[0_0_220px_var(--glow-core)]"
            )}
            style={
              {
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgba(255,255,255,0.16)",
                background:
                  i === 0
                    ? "radial-gradient(circle, rgba(47,63,168,0.22), transparent 70%)"
                    : "radial-gradient(circle, rgba(22,106,94,0.18), transparent 70%)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = "Ripple";
