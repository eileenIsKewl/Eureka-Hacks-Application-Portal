"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { getZone } from "@/lib/zones";
import { DepthGauge } from "@/components/DepthGauge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useApplication } from "@/hooks/useApplication";
import { ReviewSummary } from "./ReviewSummary";

const zone = getZone("hadal");

export function HadalZone({ onSubmitted }: { onSubmitted: () => void }) {
  const {
    applicantId,
    values,
    goBack,
    goToZone,
    hasResume,
    resumeFileName,
    markResumeUploaded,
    submitApplication,
  } = useApplication();

  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    setSubmitting(true);
    const ok = await submitApplication();
    setSubmitting(false);
    if (ok) {
      onSubmitted();
    } else {
      setSubmitError(
        "Something is still missing before this can go down for good — double check every zone above."
      );
    }
  }

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-6 py-16">
      <div className="mb-8">
        <DepthGauge currentZone="hadal" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 36, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <h1 className="mb-3 font-display text-3xl text-glow-300 sm:text-4xl">
          {zone.name}
        </h1>
        <p className="mb-8 max-w-lg text-white/70">{zone.description}</p>

        <Card className={`mb-8 ${zone.theme.glow}`}>
          <h2 className="mb-3 font-display text-lg text-glow-300">Resume</h2>
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

        <ReviewSummary values={values} onEditZone={goToZone} />

        {submitError && (
          <p role="alert" className="mt-6 text-center text-sm text-rose-400">
            {submitError}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          <Button variant="ghost" type="button" onClick={goBack}>
            ← Back up
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Releasing into the deep…" : zone.ctaLabel}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
