"use client";

import React, { ComponentPropsWithoutRef } from "react";
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
}: RippleProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none",
        "z-1",    
        className
      )}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 90;
        const opacity = Math.max(mainCircleOpacity - i * 0.06, 0.14);

        return (
          <div
            key={i}
            className="absolute rounded-full animate-ripple"
            style={{
              width: size,
              height: size,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity,
              border: "1px solid rgba(255,255,255,0.22)",
              background:
                "radial-gradient(circle, rgba(47,63,168,0.32), transparent 70%)",
              boxShadow: "0 0 240px rgba(47,63,168,0.45)",

              animationDelay: `${i * 0.9}s`,
            }}
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = "Ripple";
