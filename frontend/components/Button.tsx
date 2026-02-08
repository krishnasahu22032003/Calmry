import { forwardRef } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "relative inline-flex items-center justify-center cursor-pointer",
          "h-12 px-8 sm:px-10",
          "rounded-2xl text-sm font-medium",
          "transition-all duration-700",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-core)]",
          "active:scale-[0.98]",
          variant === "primary" && [
            "glass",
            "breathe",
            "text-foreground",
            "hover:-translate-y-[1px]",
            "hover:bg-surface-soft/30",
            "hover:shadow-[0_0_140px_rgba(47,63,168,0.22)]",
          ],
          variant === "secondary" && [
            "border border-border/80",
            "text-foreground/85",
            "bg-surface-soft/40",
            "hover:text-foreground",
            "hover:bg-surface-soft",
          ],
          className
        )}
        {...props}
      >
     <span className="relative z-10 inline-flex items-center gap-2 whitespace-nowrap">
  {children}
</span>

        {variant === "primary" && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-700 hover:opacity-100"
            style={{
              background:
                "radial-gradient(400px 120px at 50% 0%, rgba(47,63,168,0.18), transparent 70%)",
            }}
          />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
