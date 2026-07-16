import type { Metadata } from "next";
import { ApplyFlow } from "./ApplyFlow";

export const metadata: Metadata = {
  title: "Apply — EurekaHacks",
  description: "Begin your descent and apply to EurekaHacks.",
};

export default function ApplyPage() {
  return <ApplyFlow />;
}
