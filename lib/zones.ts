import type { ZoneId } from "./data/types";
import {
  minLength,
  validateEmail,
  validateOptionalUrl,
  validatePhone,
  validateRequired,
  validateYear,
} from "./validation";

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "select"
  | "textarea"
  | "url";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  helper?: string;
  options?: { value: string; label: string }[];
  required: boolean;
  maxLength?: number;
  minWords?: number;
  validate?: (value: string | null | undefined) => string | null;
}

export interface ZoneTheme {
  bg: string;
  bgSoft: string;
  text: string;
  accent: string;
  border: string;
  glow: string;
}

export interface ZoneConfig {
  id: ZoneId;
  order: number;
  name: string;
  depthLabel: string;
  depthMeters: number;
  tagline: string;
  description: string;
  ctaLabel: string;
  theme: ZoneTheme;
  fields: FieldConfig[];
}

export const ZONES: ZoneConfig[] = [
  {
    id: "sunlight",
    order: 0,
    name: "Sunlight Zone",
    depthLabel: "0-200m · Surface Light",
    depthMeters: 0,
    tagline: "Warm water, clear light. Tell us who's diving in.",
    description:
      "Every descent starts here, where the sun still reaches. Basic info only, the deeper stuff comes later.",
    ctaLabel: "Begin the descent",
    theme: {
      bg: "from-sunlight-300 via-sunlight-400 to-sunlight-600",
      bgSoft: "bg-sunlight-500",
      text: "text-sunlight-950",
      accent: "text-sunlight-700",
      border: "border-sunlight-400/50",
      glow: "shadow-glow-sunlight",
    },
    fields: [
      {
        name: "fullName",
        label: "Full name",
        type: "text",
        placeholder: "Ada Lovelace",
        required: true,
        validate: validateRequired,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "you@example.com",
        required: true,
        validate: validateEmail,
      },
      {
        name: "pronouns",
        label: "Pronouns",
        type: "text",
        placeholder: "she/her, he/him, they/them...",
        required: false,
      },
      {
        name: "phone",
        label: "Phone number",
        type: "tel",
        placeholder: "(555) 123-4567",
        required: true,
        validate: validatePhone,
      },
    ],
  },
  {
    id: "twilight",
    order: 1,
    name: "Twilight Zone",
    depthLabel: "200-1,000m · Fading Light",
    depthMeters: 200,
    tagline: "The light is dimming. Time to talk about where you've been learning.",
    description:
      "The twilight zone is where dim shapes start to matter more than color. Tell us about your education.",
    ctaLabel: "Sink deeper",
    theme: {
      bg: "from-twilight-400 via-twilight-600 to-twilight-800",
      bgSoft: "bg-twilight-600",
      text: "text-twilight-50",
      accent: "text-glow-400",
      border: "border-twilight-500/50",
      glow: "shadow-glow-twilight",
    },
    fields: [
      {
        name: "school",
        label: "School",
        type: "text",
        placeholder: "University of the Deep",
        required: true,
        validate: validateRequired,
      },
      {
        name: "educationLevel",
        label: "Education level",
        type: "select",
        required: true,
        validate: validateRequired,
        options: [
          { value: "high-school", label: "High School" },
          { value: "undergraduate", label: "Undergraduate" },
          { value: "graduate", label: "Graduate" },
          { value: "bootcamp", label: "Bootcamp" },
          { value: "self-taught", label: "Self-taught" },
          { value: "other", label: "Other" },
        ],
      },
      {
        name: "gradYear",
        label: "Expected graduation year",
        type: "text",
        placeholder: "2027",
        required: true,
        validate: validateYear,
      },
      {
        name: "fieldOfStudy",
        label: "Field of study",
        type: "text",
        placeholder: "Computer Science, Marine Biology, Undecided...",
        required: true,
        validate: validateRequired,
      },
    ],
  },
  {
    id: "midnight",
    order: 2,
    name: "Midnight Zone",
    depthLabel: "1,000-4,000m · No Sunlight",
    depthMeters: 1000,
    tagline: "Total darkness now. Only the things you've built give off light.",
    description:
      "Nothing grows here without making its own light. Show us the skills and experience you carry with you.",
    ctaLabel: "Descend further",
    theme: {
      bg: "from-midnight-500 via-midnight-700 to-midnight-900",
      bgSoft: "bg-midnight-700",
      text: "text-midnight-50",
      accent: "text-glow-400",
      border: "border-midnight-600/50",
      glow: "shadow-glow-midnight",
    },
    fields: [
      {
        name: "hackathonsAttended",
        label: "Hackathons attended",
        type: "select",
        required: true,
        validate: validateRequired,
        options: [
          { value: "0", label: "This is my first one!" },
          { value: "1-2", label: "1-2" },
          { value: "3-5", label: "3-5" },
          { value: "6+", label: "6 or more" },
        ],
      },
      {
        name: "technicalSkills",
        label: "Technical skills",
        type: "textarea",
        placeholder: "Languages, frameworks, tools, hardware...",
        required: true,
        maxLength: 400,
        validate: validateRequired,
      },
      {
        name: "portfolioUrl",
        label: "GitHub or portfolio link",
        type: "url",
        placeholder: "https://github.com/yourname",
        required: false,
        validate: validateOptionalUrl,
      },
      {
        name: "dietaryRestrictions",
        label: "Dietary restrictions",
        type: "text",
        placeholder: "None, vegetarian, allergies...",
        required: false,
      },
    ],
  },
  {
    id: "abyssal",
    order: 3,
    name: "Abyssal Zone",
    depthLabel: "4,000-6,000m · Crushing Dark",
    depthMeters: 4000,
    tagline: "This is the deep dark. Only the bioluminescent things survive here, like real motivation.",
    description:
      "Near-freezing, near-black, and honest. Tell us why you're really here.",
    ctaLabel: "Drop into the trench",
    theme: {
      bg: "from-abyssal-500 via-abyssal-700 to-abyssal-900",
      bgSoft: "bg-abyssal-700",
      text: "text-abyssal-50",
      accent: "text-glow-400",
      border: "border-abyssal-600/50",
      glow: "shadow-glow-abyssal",
    },
    fields: [
      {
        name: "essayWhy",
        label: "Why do you want to attend EurekaHacks?",
        type: "textarea",
        placeholder: "Tell us honestly...",
        required: true,
        maxLength: 600,
        validate: minLength(40),
      },
      {
        name: "essayLearn",
        label: "What do you want to learn?",
        type: "textarea",
        placeholder: "A skill, a tool, a way of thinking...",
        required: true,
        maxLength: 600,
        validate: minLength(30),
      },
      {
        name: "essayProject",
        label: "Tell us about a project you're proud of",
        type: "textarea",
        placeholder: "What did you build, and why does it matter to you?",
        required: true,
        maxLength: 800,
        validate: minLength(40),
      },
    ],
  },
  {
    id: "hadal",
    order: 4,
    name: "Hadal Zone",
    depthLabel: "6,000-11,000m · The Trench",
    depthMeters: 6000,
    tagline: "The deepest point on Earth. One last thing, then send it down.",
    description:
      "Almost nothing survives this deep. You're about to be the exception. Upload your resume, look back over everything, and release it into the dark.",
    ctaLabel: "Send it down",
    theme: {
      bg: "from-hadal-700 via-hadal-800 to-hadal-950",
      bgSoft: "bg-hadal-900",
      text: "text-hadal-50",
      accent: "text-glow-400",
      border: "border-hadal-700/50",
      glow: "shadow-glow-hadal",
    },
    fields: [],
  },
];

export function getZone(id: ZoneId): ZoneConfig {
  const zone = ZONES.find((z) => z.id === id);
  if (!zone) throw new Error(`Unknown zone: ${id}`);
  return zone;
}

export function zoneIndex(id: ZoneId): number {
  return ZONES.findIndex((z) => z.id === id);
}

export function zonesRemaining(id: ZoneId): number {
  return ZONES.length - 1 - zoneIndex(id);
}

export function formatFieldValue(
  field: FieldConfig,
  value: string | null | undefined
): string {
  if (!value) return "N/A";
  if (field.options) {
    return field.options.find((o) => o.value === value)?.label ?? value;
  }
  return value;
}
