"use client";

import type { FieldConfig } from "@/lib/zones";
import { cn } from "@/lib/cn";

interface FormFieldProps {
  config: FieldConfig;
  value: string;
  error?: string | null;
  touched?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const baseControlClasses =
  "w-full rounded-xl border bg-black/25 px-4 py-3 text-white placeholder:text-white/35 outline-none transition-colors duration-150 focus:border-glow-500 focus:shadow-glow-teal";

export function FormField({
  config,
  value,
  error,
  touched,
  onChange,
  onBlur,
}: FormFieldProps) {
  const showError = touched && !!error;
  const borderClass = showError
    ? "border-rose-500/70"
    : "border-white/15";

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={config.name}
        className="flex items-baseline justify-between text-sm font-medium text-white/80"
      >
        <span>
          {config.label}
          {config.required && <span className="ml-1 text-glow-400">*</span>}
        </span>
        {config.maxLength && (
          <span className="text-xs font-normal text-white/35">
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
          className={cn(baseControlClasses, borderClass, "resize-none")}
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
            borderClass,
            !value && "text-white/35"
          )}
        >
          <option value="" disabled>
            Choose one...
          </option>
          {config.options?.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-black">
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
          className={cn(baseControlClasses, borderClass)}
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
