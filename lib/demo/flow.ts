// lib/demo/flow.ts
// Rebuilds the Explore graph from saved messages. The logic is the original
// convertToFlow() from app/(chat)/explore/[id]/page.tsx, moved here so it can
// run in the browser (where the demo keeps its saved chats).

import type { UIMessage } from "ai";
import { plainLabel, type CustomEdge, type CustomNode } from "@/components/explore-chat";
import { getLayoutedElements } from "@/lib/utils";

interface TextPart {
  type: "text";
  text: string;
}

type Suggestion = { id: string; content: string };

function findSuggestions(message: UIMessage): Suggestion[] | undefined {
  for (const annotation of message.annotations ?? []) {
    if (
      typeof annotation === "object" &&
      annotation !== null &&
      "suggestions" in annotation &&
      typeof annotation.suggestions === "object" &&
      annotation.suggestions !== null &&
      "suggestions" in annotation.suggestions &&
      Array.isArray(annotation.suggestions.suggestions)
    ) {
      return annotation.suggestions.suggestions as Suggestion[];
    }
  }
  return undefined;
}

function findFromSuggestionId(message: UIMessage): string | undefined {
  for (const annotation of message.annotations ?? []) {
    if (
      typeof annotation === "object" &&
      annotation !== null &&
      "fromSuggestionId" in annotation &&
      typeof annotation.fromSuggestionId === "string"
    ) {
      return annotation.fromSuggestionId;
    }
  }
  return undefined;
}

export function convertToFlow(messages: UIMessage[]): {
  nodes: CustomNode[];
  edges: CustomEdge[];
} {
  const nodes: CustomNode[] = [];
  const edges: CustomEdge[] = [];

  for (const message of messages) {
    if (message.role === "user") continue;

    const suggestions = findSuggestions(message);
    if (!suggestions) continue;

    const firstTextPart = message.parts?.find((part) => part.type === "text") as TextPart | undefined;
    const label = firstTextPart
      ? plainLabel(firstTextPart.text)
      : `Msg: ${message.id.substring(0, 8)}...`;

    nodes.push({ id: message.id, data: { label }, position: { x: 0, y: 0 } });

    for (const suggestion of suggestions) {
      nodes.push({ id: suggestion.id, data: { label: suggestion.content }, position: { x: 0, y: 0 } });
      edges.push({
        id: `${message.id}-${suggestion.id}`,
        source: message.id,
        target: suggestion.id,
        label: "suggestion",
      });
    }

    const fromSuggestionId = findFromSuggestionId(message);
    if (fromSuggestionId) {
      edges.push({
        id: `${fromSuggestionId}-${message.id}`,
        source: fromSuggestionId,
        target: message.id,
        label: "branching...",
      });
    }
  }

  return getLayoutedElements(nodes, edges, { direction: "TB" });
}

/** Text of the first text part, used as the message's `content`. */
export function textOf(message: UIMessage) {
  const part = message.parts?.find((p) => p.type === "text") as TextPart | undefined;
  return part?.text ?? message.content ?? "";
}
