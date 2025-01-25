import { DIEError } from "phpdie";
import process from "process";

export async function parseOpenAI_apiKey(req: Request) {
  return (function parseApiKey() {
    const rawKey =
      req.headers.get("Authorization") ||
      DIEError("Missing header.Authorization");
    const key = rawKey.replace(/^Bearer /, "");
    if (key.startsWith("sk-")) {
      // openai key
      return key;
    } else if (key.startsWith("snolab-")) {
      if (key === process.env.SNOLAB_TOKEN) {
        // openai key
        return process.env.OPENAI_API_KEY;
      }
      DIEError("snolab-key mismatch");
    } else {
      DIEError("unsupported key");
    }
  })();
}
