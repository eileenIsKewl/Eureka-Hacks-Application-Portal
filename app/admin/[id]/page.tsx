import type { Metadata } from "next";
import { ApplicantDetail } from "@/components/admin/ApplicantDetail";

export const metadata: Metadata = {
  title: "Applicant file — EurekaHacks Control Room",
};

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ApplicantDetail id={id} />;
}
