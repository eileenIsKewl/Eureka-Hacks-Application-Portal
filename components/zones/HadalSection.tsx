"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { getZone, ZONES } from "@/lib/zones";
import { zoneSectionId, scrollToZone } from "@/lib/scrollToZone";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BubbleField } from "@/components/ui/BubbleField";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { FishSchool } from "@/components/creatures/FishSchool";
import { useApplication } from "@/hooks/useApplication";
import { ReviewSummary } from "./ReviewSummary";

const zone = getZone("hadal");

export function HadalSection({ onSubmitted }: { onSubmitted: () => void }) {
  const {
    applicantId,
    values,
    hasResume,
    resumeFileName,
    markResumeUploaded,
    submitApplication,
    isZoneValid,
    touchZone,
  } = useApplication();

  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reviewableZones = ZONES.filter((z) => z.fields.length > 0);
  const allZonesValid = reviewableZones.every((z) => isZoneValid(z.id));
  const readyToSubmit = allZonesValid && hasResume;

  async function handleFile(file: File) {
    if (!applicantId) return;
    setUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const res = await fetch(`/api/applicants/${applicantId}/resume`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setUploadError(body?.error ?? "That file didn't survive the pressure. Try again.");
      } else {
        markResumeUploaded(file.name);
      }
    } catch {
      setUploadError("Couldn't reach the trench floor. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    setSubmitError(null);

    if (!readyToSubmit) {
      reviewableZones.forEach((z) => touchZone(z.id));
      setSubmitError(
        hasResume
          ? "A few answers above still need finishing before this can go down for good."
          : "Add your resume and finish every answer above before this can go down for good."
      );
      return;
    }

    setSubmitting(true);
    const result = await submitApplication();
    setSubmitting(false);
    if (result.ok) {
      onSubmitted();
    } else if (result.missing && result.missing.length > 0) {
      setSubmitError(
        `A few things are still missing before this can go down for good. Add ${result.missing.join(", ")} and try again.`
      );
    } else {
      setSubmitError("Something is still missing before this can go down for good. Double check every zone above.");
    }
  }

  return (
    <section className="relative flex min-h-[170vh] w-full items-center overflow-hidden px-6 py-32">
      <ParallaxLayer className="pointer-events-none absolute inset-0">
        <BubbleField count={20} />
      </ParallaxLayer>
      <FishSchool zoneId="hadal" />

      <motion.div
        id={zoneSectionId("hadal")}
        initial={{ opacity: 0, y: 70, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-2xl scroll-mt-24 pt-12"
      >
        <h1 className="mb-1 font-display text-3xl text-glow-300 sm:text-4xl">
          {zone.name}
        </h1>
        <p className="mb-4 text-xs uppercase tracking-wide text-white/40">
          {zone.depthLabel}
        </p>
        <p className="mb-8 max-w-lg text-white/70">{zone.description}</p>

        <Card className={`mb-8 ${zone.theme.glow}`}>
          <h2 className="mb-3 font-display text-lg text-glow-300">
            Resume <span className="text-sm text-glow-400">*</span>
          </h2>
          <p className="mb-4 text-sm text-white/60">
            One last artifact to carry into the dark.
          </p>
          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Sending it down…" : hasResume ? "Replace file" : "Choose file"}
            </Button>
            {hasResume && resumeFileName && (
              <span className="text-sm text-glow-400">✓ {resumeFileName}</span>
            )}
          </div>
          {uploadError && (
            <p role="alert" className="mt-3 text-xs text-rose-400">
              {uploadError}
            </p>
          )}
        </Card>

        <ReviewSummary values={values} onEditZone={scrollToZone} />

        {submitError && (
          <p role="alert" className="mt-6 text-center text-sm text-rose-400">
            {submitError}
          </p>
        )}
        {!submitError && !readyToSubmit && (
          <p className="mt-6 text-center text-sm text-white/40">
            {hasResume
              ? "Finish every answer above to send this down."
              : "Finish every answer above and add your resume to send this down."}
          </p>
        )}

        <div className="mt-8 flex items-center justify-end gap-4">
          <Button
            variant="primary"
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !readyToSubmit}
          >
            {submitting ? "Releasing into the deep…" : zone.ctaLabel}
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
