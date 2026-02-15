"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const easeOrganic = [0.22, 1, 0.36, 1] as const

type CardProps = React.ComponentPropsWithoutRef<typeof motion.div>

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeOrganic }}
        whileHover={{ y: -6 }}
        className={cn(
          `
          relative overflow-hidden
          rounded-2xl
          bg-surface
          border border-border
          backdrop-blur-xl
          shadow-[0_30px_80px_rgba(0,0,0,0.65)]
          transition-all duration-500
          group
          `,
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 px-8 pt-8",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"


const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      `
      font-accent
      text-[1.05rem]
      text-foreground
      tracking-tight
      leading-snug
      `,
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"


const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      `
      text-[13.5px]
      text-muted
      leading-relaxed
      tracking-wide
      `,
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"


const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-8 py-6",
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"


const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      `
      flex items-center justify-between
      px-8 pb-8
      text-sm text-muted
      `,
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
}