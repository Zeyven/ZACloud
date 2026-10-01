export class BodyReadError extends Error {
  constructor(public code: "PAYLOAD_TOO_LARGE" | "REQUEST_TIMEOUT") {
    super(code);
  }
}
export async function readBoundedBody(
  request: Request,
  maxBytes = 16_384,
  timeoutMs = 3000,
): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) return "";
  let timer: ReturnType<typeof setTimeout> | undefined;
  let length = 0;
  const chunks: Uint8Array[] = [];
  try {
    return await Promise.race([
      (async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          length += value.byteLength;
          if (length > maxBytes) throw new BodyReadError("PAYLOAD_TOO_LARGE");
          chunks.push(value);
        }
        const all = new Uint8Array(length);
        let offset = 0;
        for (const chunk of chunks) {
          all.set(chunk, offset);
          offset += chunk.length;
        }
        return new TextDecoder("utf-8", { fatal: true }).decode(all);
      })(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new BodyReadError("REQUEST_TIMEOUT")),
          timeoutMs,
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
    await reader.cancel().catch(() => {});
  }
}
