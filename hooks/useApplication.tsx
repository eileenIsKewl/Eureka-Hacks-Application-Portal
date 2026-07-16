"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ZONES, getZone, type FieldConfig } from "@/lib/zones";
import type { ApplicantRecord, ZoneId } from "@/lib/data/types";

const STORAGE_KEY = "eurekahacks:application";

const ALL_FIELDS: FieldConfig[] = ZONES.flatMap((z) => z.fields);
const FIELD_NAMES = ALL_FIELDS.map((f) => f.name);

type FieldValues = Record<string, string>;
type SaveStatus = "idle" | "saving" | "saved" | "error";

interface StoredShape {
  id: string;
  values: FieldValues;
  currentZone: ZoneId;
}

function emptyValues(): FieldValues {
  const v: FieldValues = {};
  for (const name of FIELD_NAMES) v[name] = "";
  return v;
}

function readLocalStorage(): StoredShape | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredShape;
  } catch {
    return null;
  }
}

function writeLocalStorage(data: StoredShape) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable, autosave to server still applies
  }
}

function recordToValues(record: ApplicantRecord): FieldValues {
  const v = emptyValues();
  for (const name of FIELD_NAMES) {
    const raw = (record as unknown as Record<string, unknown>)[name];
    if (typeof raw === "string") v[name] = raw;
  }
  return v;
}

interface ApplicationContextValue {
  loading: boolean;
  applicantId: string | null;
  values: FieldValues;
  currentZoneId: ZoneId;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  saveStatus: SaveStatus;
  submitted: boolean;
  hasResume: boolean;
  resumeFileName: string | null;
  setField: (name: string, value: string) => void;
  touchField: (name: string) => void;
  isZoneValid: (zoneId: ZoneId) => boolean;
  touchZone: (zoneId: ZoneId) => void;
  goToZone: (zoneId: ZoneId) => Promise<void>;
  goNext: () => Promise<void>;
  goBack: () => Promise<void>;
  submitApplication: () => Promise<{ ok: boolean; missing?: string[] }>;
  markResumeUploaded: (fileName: string) => void;
}

const ApplicationContext = createContext<ApplicationContextValue | null>(null);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [values, setValues] = useState<FieldValues>(emptyValues());
  const [currentZoneId, setCurrentZoneId] = useState<ZoneId>("sunlight");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [submitted, setSubmitted] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingFields = useRef<FieldValues>({});

  // ---- initial hydration: localStorage first (instant), then reconcile with server ----
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const local = readLocalStorage();
      if (local) {
        setApplicantId(local.id);
        setValues((v) => ({ ...v, ...local.values }));
        setCurrentZoneId(local.currentZone);
      }

      try {
        if (local?.id) {
          const res = await fetch(`/api/applicants/${local.id}`);
          if (res.ok) {
            const record: ApplicantRecord = await res.json();
            if (cancelled) return;
            const serverValues = recordToValues(record);
            // Prefer server values, but keep any local edit the server hasn't seen yet.
            const merged: FieldValues = { ...serverValues };
            for (const name of FIELD_NAMES) {
              if (!serverValues[name] && local.values[name]) {
                merged[name] = local.values[name];
              }
            }
            setValues(merged);
            setCurrentZoneId(record.currentZone);
            setSubmitted(record.submitted);
            setHasResume(record.hasResume);
            setResumeFileName(record.resumeFileName);
            writeLocalStorage({
              id: record.id,
              values: merged,
              currentZone: record.currentZone,
            });
          } else {
            // The server has no memory of this id (fresh db), recreate from local cache.
            await createDraft(local.values, local.currentZone);
          }
        } else {
          await createDraft(emptyValues(), "sunlight");
        }
      } catch {
        // Offline or server unreachable, local cache still lets the applicant keep working.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function createDraft(initialValues: FieldValues, zone: ZoneId) {
      const res = await fetch("/api/applicants", { method: "POST" });
      if (!res.ok) return;
      const record: ApplicantRecord = await res.json();
      if (cancelled) return;
      setApplicantId(record.id);
      setValues((v) => ({ ...v, ...initialValues }));
      setCurrentZoneId(zone);
      writeLocalStorage({ id: record.id, values: initialValues, currentZone: zone });
      if (Object.values(initialValues).some(Boolean) || zone !== "sunlight") {
        await fetch(`/api/applicants/${record.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...initialValues, currentZone: zone }),
        });
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(
    (nextValues: FieldValues, zone: ZoneId) => {
      if (!applicantId) return;
      writeLocalStorage({ id: applicantId, values: nextValues, currentZone: zone });
    },
    [applicantId]
  );

  const flushServerSave = useCallback(async () => {
    if (!applicantId) return;
    const payload = pendingFields.current;
    pendingFields.current = {};
    if (Object.keys(payload).length === 0) return;
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/applicants/${applicantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSaveStatus(res.ok ? "saved" : "error");
    } catch {
      setSaveStatus("error");
    }
  }, [applicantId]);

  const scheduleSave = useCallback(
    (fields: FieldValues) => {
      pendingFields.current = { ...pendingFields.current, ...fields };
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        flushServerSave();
      }, 600);
    },
    [flushServerSave]
  );

  const setField = useCallback(
    (name: string, value: string) => {
      setValues((prev) => {
        const next = { ...prev, [name]: value };
        persist(next, currentZoneId);
        return next;
      });
      scheduleSave({ [name]: value });
    },
    [currentZoneId, persist, scheduleSave]
  );

  const touchField = useCallback((name: string) => {
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  }, []);

  const fieldError = useCallback(
    (config: FieldConfig, value: string): string | null => {
      if (config.validate) return config.validate(value);
      if (config.required && !value.trim())
        return "The tide needs this before you can go deeper.";
      return null;
    },
    []
  );

  const errors = useMemo(() => {
    const e: Record<string, string | null> = {};
    for (const field of ALL_FIELDS) {
      e[field.name] = fieldError(field, values[field.name] ?? "");
    }
    return e;
  }, [values, fieldError]);

  const isZoneValid = useCallback(
    (zoneId: ZoneId) => {
      const zone = getZone(zoneId);
      return zone.fields.every((f) => !fieldError(f, values[f.name] ?? ""));
    },
    [values, fieldError]
  );

  const touchZone = useCallback((zoneId: ZoneId) => {
    const zone = getZone(zoneId);
    setTouched((prev) => {
      const next = { ...prev };
      for (const f of zone.fields) next[f.name] = true;
      return next;
    });
  }, []);

  const goToZone = useCallback(
    async (zoneId: ZoneId) => {
      setCurrentZoneId(zoneId);
      persist(values, zoneId);
      if (applicantId) {
        setSaveStatus("saving");
        try {
          const res = await fetch(`/api/applicants/${applicantId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentZone: zoneId }),
          });
          setSaveStatus(res.ok ? "saved" : "error");
        } catch {
          setSaveStatus("error");
        }
      }
    },
    [applicantId, persist, values]
  );

  const goNext = useCallback(async () => {
    const idx = ZONES.findIndex((z) => z.id === currentZoneId);
    if (idx < ZONES.length - 1) {
      await goToZone(ZONES[idx + 1].id);
    }
  }, [currentZoneId, goToZone]);

  const goBack = useCallback(async () => {
    const idx = ZONES.findIndex((z) => z.id === currentZoneId);
    if (idx > 0) {
      await goToZone(ZONES[idx - 1].id);
    }
  }, [currentZoneId, goToZone]);

  const submitApplication = useCallback(async (): Promise<{
    ok: boolean;
    missing?: string[];
  }> => {
    if (!applicantId) return { ok: false };
    await flushServerSave();
    try {
      const res = await fetch(`/api/applicants/${applicantId}/submit`, {
        method: "POST",
      });
      if (res.ok) {
        setSubmitted(true);
        return { ok: true };
      }
      const body = await res.json().catch(() => null);
      return { ok: false, missing: body?.missing };
    } catch {
      return { ok: false };
    }
  }, [applicantId, flushServerSave]);

  const markResumeUploaded = useCallback((fileName: string) => {
    setHasResume(true);
    setResumeFileName(fileName);
  }, []);

  const value: ApplicationContextValue = {
    loading,
    applicantId,
    values,
    currentZoneId,
    errors,
    touched,
    saveStatus,
    submitted,
    hasResume,
    resumeFileName,
    setField,
    touchField,
    isZoneValid,
    touchZone,
    goToZone,
    goNext,
    goBack,
    submitApplication,
    markResumeUploaded,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const ctx = useContext(ApplicationContext);
  if (!ctx) {
    throw new Error("useApplication must be used within an ApplicationProvider");
  }
  return ctx;
}
