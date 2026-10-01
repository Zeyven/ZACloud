export type ContactInput = {
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
  consent: true;
  website: string;
};
export function validateContact(value: unknown): ContactInput | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  for (const k of ["name", "email", "message"])
    if (typeof v[k] !== "string" || !(v[k] as string).trim()) return null;
  if (
    (v.name as string).length > 100 ||
    (v.email as string).length > 254 ||
    (v.message as string).length > 5000
  )
    return null;
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email as string) ||
    v.consent !== true
  )
    return null;
  if (
    !["General", "Product", "Studio", "Partnership", "Press"].includes(
      v.topic as string,
    )
  )
    return null;
  if (
    v.company !== undefined &&
    (typeof v.company !== "string" || v.company.length > 150)
  )
    return null;
  if (v.website !== undefined && typeof v.website !== "string") return null;
  return {
    name: (v.name as string).trim(),
    email: (v.email as string).trim(),
    message: (v.message as string).trim(),
    company: (v.company as string) || "",
    topic: v.topic as string,
    consent: true,
    website: (v.website as string) || "",
  };
}
// Preview-wide bounded bucket. Replace with an approved durable provider before public delivery.
export function createRateLimiter(limit = 10, windowMs = 60_000) {
  let count = 0;
  let resetsAt = 0;
  return (now = Date.now()) => {
    if (now >= resetsAt) {
      count = 0;
      resetsAt = now + windowMs;
    }
    return ++count <= limit;
  };
}
