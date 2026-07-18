"use client";

import type { FieldConfig } from "@/lib/zones";
import { cn, SELECT_OPTION_STYLE } from "@/lib/cn";

interface FormFieldProps {
  config: FieldConfig;
  value: string;
  error?: string | null;
  touched?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
  /** "light" gives frosted-glass inputs for bright zone backgrounds (Sunlight); default suits dark zones. */
  tone?: "dark" | "light";
}

const TONE_CLASSES: Record<"dark" | "light", string> = {
  dark: "bg-black/25 text-white placeholder:text-white/35 focus:border-glow-500 focus:shadow-glow-teal",
  light:
    "bg-white/35 text-sunlight-950 placeholder:text-sunlight-950/40 backdrop-blur-sm focus:border-sunlight-800 focus:bg-white/50",
};

const baseControlClasses =
  "w-full rounded-xl border px-4 py-3 outline-none transition-colors duration-150";

export function FormField({
  config,
  value,
  error,
  touched,
  onChange,
  onBlur,
  tone = "dark",
}: FormFieldProps) {
  const showError = touched && !!error;
  const borderClass = showError
    ? "border-rose-500/70"
    : tone === "light"
    ? "border-white/50"
    : "border-white/15";

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={config.name}
        className={cn(
          "flex items-baseline justify-between text-sm font-medium",
          tone === "light" ? "text-sunlight-950/85" : "text-white/80"
        )}
      >
        <span>
          {config.label}
          {config.required && (
            <span className={tone === "light" ? "ml-1 text-sunlight-800" : "ml-1 text-glow-400"}>
              *
            </span>
          )}
        </span>
        {config.maxLength && (
          <span
            className={cn(
              "text-xs font-normal",
              tone === "light" ? "text-sunlight-950/40" : "text-white/35"
            )}
          >
            {value.length}/{config.maxLength}
          </span>
        )}
      </label>

      {config.type === "textarea" ? (
        <textarea
          id={config.name}
          name={config.name}
          value={value}
          placeholder={config.placeholder}
          maxLength={config.maxLength}
          rows={4}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(baseControlClasses, TONE_CLASSES[tone], borderClass, "resize-none")}
        />
      ) : config.type === "select" ? (
        <select
          id={config.name}
          name={config.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(
            baseControlClasses,
            TONE_CLASSES[tone],
            borderClass,
            !value && (tone === "light" ? "text-sunlight-950/40" : "text-white/35")
          )}
        >
          <option value="" disabled style={SELECT_OPTION_STYLE}>
            Choose one...
          </option>
          {config.options?.map((opt) => (
            <option key={opt.value} value={opt.value} style={SELECT_OPTION_STYLE}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={config.name}
          name={config.name}
          type={config.type === "url" ? "text" : config.type}
          value={value}
          placeholder={config.placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(baseControlClasses, TONE_CLASSES[tone], borderClass)}
        />
      )}

      {config.helper && !showError && (
        <p className="text-xs text-white/40">{config.helper}</p>
      )}
      {showError && (
        <p role="alert" className="text-xs text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
}
