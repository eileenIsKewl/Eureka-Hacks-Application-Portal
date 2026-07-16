const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\d][\d\s().-]{6,}$/;
const URL_RE = /^https?:\/\/[^\s]+\.[^\s]+/i;

export function validateRequired(value: string | null | undefined): string | null {
  if (!value || !value.trim()) return "The tide needs this before you can go deeper.";
  return null;
}

export function validateEmail(value: string | null | undefined): string | null {
  const req = validateRequired(value);
  if (req) return req;
  if (!EMAIL_RE.test(value!.trim())) return "That doesn't look like a real email.";
  return null;
}

export function validatePhone(value: string | null | undefined): string | null {
  const req = validateRequired(value);
  if (req) return req;
  if (!PHONE_RE.test(value!.trim())) return "Enter a valid phone number.";
  return null;
}

export function validateYear(value: string | null | undefined): string | null {
  const req = validateRequired(value);
  if (req) return req;
  const year = Number(value);
  const now = new Date().getFullYear();
  if (!Number.isInteger(year) || year < now - 1 || year > now + 8) {
    return `Enter a graduation year between ${now - 1} and ${now + 8}.`;
  }
  return null;
}

export function validateOptionalUrl(value: string | null | undefined): string | null {
  if (!value || !value.trim()) return null;
  if (!URL_RE.test(value.trim())) return "Enter a full link, starting with https://";
  return null;
}

export function minLength(min: number) {
  return (value: string | null | undefined): string | null => {
    const req = validateRequired(value);
    if (req) return req;
    if (value!.trim().length < min) {
      return `Give it a bit more depth, at least ${min} characters.`;
    }
    return null;
  };
}
