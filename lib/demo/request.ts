// lib/demo/request.ts
// Checks the JSON body that useChat sends, so the demo API routes never act on
// malformed or oversized input. (Plain checks instead of a schema library:
// the body is small and only a few fields are read.)

const MAX_BODY_BYTES = 200_000;
const MAX_MESSAGES = 200;
const MAX_CONTENT = 20_000;
const ROLES = new Set(["user", "assistant", "system", "data"]);

export type ChatMessage = {
  id?: string;
  role: "user" | "assistant" | "system" | "data";
  content: string;
  [key: string]: unknown;
};

export type ChatBody = {
  messages: ChatMessage[];
  fromSuggestionId?: string;
  lessonTopic?: string;
};

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function optionalString(v: unknown, max: number): string | undefined | false {
  if (v === undefined || v === null || v === "") return undefined;
  return typeof v === "string" && v.length <= max ? v : false;
}

function isMessage(v: unknown): v is ChatMessage {
  return (
    isObject(v) &&
    typeof v.role === "string" &&
    ROLES.has(v.role) &&
    typeof v.content === "string" &&
    v.content.length <= MAX_CONTENT &&
    (v.id === undefined || (typeof v.id === "string" && v.id.length <= 100))
  );
}

export async function readChatBody(req: Request): Promise<ChatBody | null> {
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) return null;

    const body: unknown = JSON.parse(raw);
    if (!isObject(body)) return null;

    const { messages } = body;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) return null;
    if (!messages.every(isMessage)) return null;

    const fromSuggestionId = optionalString(body.fromSuggestionId, 100);
    const lessonTopic = optionalString(body.lessonTopic, 2_000);
    if (fromSuggestionId === false || lessonTopic === false) return null;

    return { messages, fromSuggestionId, lessonTopic };
  } catch {
    return null;
  }
}

export const badRequest = () => new Response("Bad request", { status: 400 });
