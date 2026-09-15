import { config } from '@/config';

/**
 * Minimal client for the Gemini Interactions API (POST /v1beta/interactions).
 * Raw fetch keeps the bundle small and avoids Node-only SDK dependencies in React Native.
 *
 * Response shape: { status, steps: [{ type: 'thought' }, { type: 'model_output', content: [{ type: 'text', text } | { type: 'image', data, mime_type }] }] }
 */

type InputBlock =
  | { type: 'text'; text: string }
  | { type: 'image'; mime_type: string; data: string }
  | { type: 'audio'; mime_type: string; data: string };

interface ContentBlock {
  type: string;
  text?: string;
  data?: string;
  mime_type?: string;
}

interface InteractionResponse {
  status?: string;
  steps?: { type: string; content?: ContentBlock[]; error?: { message?: string } }[];
  error?: { message?: string; code?: string };
}

export interface InteractionRequest {
  model: string;
  input: InputBlock[];
  system_instruction?: string;
  response_format?: Record<string, unknown>;
  generation_config?: { thinking_level?: 'minimal' | 'low' | 'medium' | 'high' };
}

export class GeminiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    /** The key's plan has no quota for this model (e.g. image models on the free tier). */
    readonly needsBilling: boolean
  ) {
    super(message);
  }

  get retryable() {
    return !this.needsBilling && (this.status === 429 || this.status >= 500 || this.status === 0);
  }
}

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';

async function send(request: InteractionRequest, timeoutMs: number): Promise<InteractionResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response: Response;
    try {
      response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'x-goog-api-key': config.geminiApiKey, 'Content-Type': 'application/json' },
        // store: false — we don't need the interaction kept server-side.
        body: JSON.stringify({ ...request, store: false }),
        signal: controller.signal,
      });
    } catch (reason) {
      throw new GeminiError(reason instanceof Error ? reason.message : 'Network error', 0, false);
    }
    const json = (await response.json().catch(() => ({}))) as InteractionResponse;
    if (!response.ok) {
      const message = json.error?.message ?? `Gemini request failed (${response.status})`;
      const needsBilling = response.status === 429 && /free_tier[^\n]*limit: 0/.test(message);
      throw new GeminiError(message, response.status, needsBilling);
    }
    if (json.status && json.status !== 'completed') {
      const stepError = json.steps?.find((s) => s.error)?.error?.message;
      throw new GeminiError(stepError ?? `Gemini returned status "${json.status}"`, 500, false);
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Sends the request, retrying overload/rate-limit errors with backoff and then
 * trying each fallback model in order.
 */
export async function createInteraction(
  request: InteractionRequest,
  { timeoutMs = 120_000, fallbackModels = [] as string[] } = {}
): Promise<InteractionResponse> {
  if (!config.geminiApiKey) throw new GeminiError('Gemini API key is not configured.', 401, false);

  const models = [request.model, ...fallbackModels.filter((m) => m && m !== request.model)];
  let lastError: unknown;
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await send({ ...request, model }, timeoutMs);
      } catch (error) {
        lastError = error;
        if (!(error instanceof GeminiError) || !error.retryable) throw error;
        if (attempt === 0) await wait(1500);
      }
    }
  }
  throw lastError;
}

function outputBlocks(response: InteractionResponse): ContentBlock[] {
  return (response.steps ?? []).filter((s) => s.type === 'model_output').flatMap((s) => s.content ?? []);
}

export function outputText(response: InteractionResponse): string {
  return outputBlocks(response)
    .filter((b) => b.type === 'text')
    .map((b) => b.text ?? '')
    .join('')
    .trim();
}

export function outputImage(response: InteractionResponse): { data: string; mimeType: string } | null {
  const image = [...outputBlocks(response)].reverse().find((b) => b.type === 'image' && b.data);
  return image?.data ? { data: image.data, mimeType: image.mime_type ?? 'image/jpeg' } : null;
}
