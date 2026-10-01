import { contactEmail } from "./site";
export function contactMailto(fields: {
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
}) {
  const body = [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Company: ${fields.company || "—"}`,
    `Topic: ${fields.topic}`,
    "",
    fields.message,
  ].join("\n");
  return `mailto:${contactEmail}?subject=${encodeURIComponent(`ZAITHE / ${fields.topic}`)}&body=${encodeURIComponent(body)}`;
}
