import { DIEError } from "phpdie";

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
      // openai key
      return process.env.OPENAI_API_KEY;
    } else {
      DIEError("unsupported key");
    }
  })();
}
