"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    {/* Track */}
    <SliderPrimitive.Track
      className="
        relative h-2 w-full overflow-hidden rounded-full
        bg-[rgba(255,255,255,0.08)]
        backdrop-blur-sm
      "
    >
      {/* Active Range */}
      <SliderPrimitive.Range
        className="
          absolute h-full rounded-full
          bg-gradient-to-r
          from-[var(--accent-core)]
          via-[var(--accent-calm)]
          to-[var(--accent-core)]
          shadow-[0_0_28px_var(--glow-calm)]
          transition-all duration-500
        "
      />
    </SliderPrimitive.Track>

    {/* Thumb */}
    <SliderPrimitive.Thumb
      className="
        relative block h-6 w-6 rounded-full
        bg-[var(--surface)]
        border border-[var(--border-subtle)]
        shadow-[0_0_0_6px_rgba(47,63,168,0.22)]
        transition-all duration-500
        hover:shadow-[0_0_0_10px_rgba(22,106,94,0.32)]
        active:scale-110
        focus:outline-none
        focus-visible:ring-1
        focus-visible:ring-[var(--accent-calm)]
        cursor-pointer
      "
    >
      {/* Inner soft highlight */}
      <span
        className="
          absolute inset-1 rounded-full
          bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.22),transparent_60%)]
        "
      />
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));

Slider.displayName = "Slider";

export { Slider };
