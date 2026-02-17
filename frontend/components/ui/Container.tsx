"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        `
        relative
        w-full
        max-w-425
        mx-auto
        px-6
        md:px-16
        xl:px-24
        2xl:px-32
        `,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
