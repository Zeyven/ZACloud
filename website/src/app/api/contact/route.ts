import { readBoundedBody, BodyReadError } from "@/lib/read-body";
import { createRateLimiter, validateContact } from "@/lib/contact";
const permitted = createRateLimiter();
export async function POST(request: Request) {
  if (!permitted())
    return Response.json(
      { error: "RATE_LIMITED", retry: "Wait one minute before retrying." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return Response.json({ error: "JSON_REQUIRED" }, { status: 415 });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json({ error: "ORIGIN_REJECTED" }, { status: 403 });
  if (Number(request.headers.get("content-length")) > 16_384)
    return Response.json({ error: "PAYLOAD_TOO_LARGE" }, { status: 413 });
  try {
    const body = await readBoundedBody(request);
    const input = validateContact(JSON.parse(body));
    if (!input)
      return Response.json({ error: "INVALID_FIELDS" }, { status: 400 });
    if (input.website)
      return Response.json({ error: "REQUEST_REJECTED" }, { status: 400 });
    return Response.json(
      {
        error: "CONTACT_NOT_CONFIGURED",
        message:
          "No message was sent or stored. The verified contact channel is not connected. Please return after the channel is announced.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const code =
      error instanceof BodyReadError ? error.code : "INVALID_REQUEST";
    return Response.json(
      { error: code },
      {
        status:
          code === "PAYLOAD_TOO_LARGE"
            ? 413
            : code === "REQUEST_TIMEOUT"
              ? 408
              : 400,
      },
    );
  }
}
