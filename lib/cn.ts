import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CSSProperties } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Native <option> elements mostly ignore Tailwind classes in the browser's
 * own dropdown popup and fall back to a light system background, which
 * paired with our white select text reads as white-on-white. Setting these
 * two properties inline is what actually reaches the popup rendering.
 */
export const SELECT_OPTION_STYLE: CSSProperties = {
  backgroundColor: "#12131c",
  color: "#ffffff",
};
