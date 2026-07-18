import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant =
  | "primary"
  | "ghost"
  | "accept"
  | "reject"
  | "waitlist"
  | "danger";

// Each variant gets a solid "edge" color beneath it (no blur, just an offset)
// so the button reads as a physical block. On press it travels down into
// its own shadow, like a real button being pushed rather than a flat tap
// target changing color.
const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-glow-500 text-hadal-950 hover:bg-glow-400 shadow-[0_5px_0_0_var(--color-glow-700)] active:shadow-[0_1px_0_0_var(--color-glow-700)] disabled:bg-glow-700 disabled:text-hadal-500 disabled:shadow-none",
  ghost:
    "bg-white/8 text-white border border-white/15 hover:bg-white/12 hover:border-glow-500/50 shadow-[0_4px_0_0_rgba(255,255,255,0.12)] active:shadow-[0_1px_0_0_rgba(255,255,255,0.12)] disabled:opacity-40 disabled:shadow-none",
  accept:
    "bg-emerald-500 text-emerald-950 hover:bg-emerald-400 shadow-[0_5px_0_0_theme(colors.emerald.700)] active:shadow-[0_1px_0_0_theme(colors.emerald.700)]",
  reject:
    "bg-rose-500 text-rose-950 hover:bg-rose-400 shadow-[0_5px_0_0_theme(colors.rose.700)] active:shadow-[0_1px_0_0_theme(colors.rose.700)]",
  waitlist:
    "bg-amber-400 text-amber-950 hover:bg-amber-300 shadow-[0_5px_0_0_theme(colors.amber.600)] active:shadow-[0_1px_0_0_theme(colors.amber.600)]",
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
          "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold tracking-wide transition-[transform,box-shadow,background-color] duration-100 cursor-pointer select-none disabled:cursor-not-allowed",
          variant !== "danger" && "active:translate-y-[4px]",
          VARIANT_CLASSES[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
