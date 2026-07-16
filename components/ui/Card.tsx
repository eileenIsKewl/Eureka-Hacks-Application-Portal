import { cn } from "@/lib/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 shadow-[0_0_40px_-20px_rgba(0,0,0,0.6)]",
        className
      )}
      {...props}
    />
  );
}
