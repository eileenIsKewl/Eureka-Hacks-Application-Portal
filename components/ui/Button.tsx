import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant =
  | "primary"
  | "ghost"
  | "accept"
  | "reject"
  | "waitlist"
  | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-glow-500 text-hadal-950 hover:bg-glow-400 shadow-glow-teal hover:shadow-[0_0_34px_-4px_var(--color-glow-400)] disabled:bg-glow-700 disabled:text-hadal-500 disabled:shadow-none",
  ghost:
    "bg-white/5 text-white border border-white/15 hover:bg-white/10 hover:border-glow-500/50 disabled:opacity-40",
  accept:
    "bg-emerald-500 text-emerald-950 hover:bg-emerald-400 shadow-[0_0_26px_-6px_theme(colors.emerald.400)] hover:shadow-[0_0_34px_-4px_theme(colors.emerald.300)]",
  reject:
    "bg-rose-500 text-rose-950 hover:bg-rose-400 shadow-[0_0_26px_-6px_theme(colors.rose.400)] hover:shadow-[0_0_34px_-4px_theme(colors.rose.300)]",
  waitlist:
    "bg-amber-400 text-amber-950 hover:bg-amber-300 shadow-[0_0_26px_-6px_theme(colors.amber.400)] hover:shadow-[0_0_34px_-4px_theme(colors.amber.300)]",
  danger:
    "bg-transparent text-rose-400 border border-rose-500/40 hover:bg-rose-500/10",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-medium tracking-wide transition-all duration-200 cursor-pointer disabled:cursor-not-allowed active:scale-[0.98]",
          VARIANT_CLASSES[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
