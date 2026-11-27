import ExploreChat, { CustomNode, CustomEdge } from "@/components/explore-chat";
import { auth } from "@/lib/auth";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { DBMessage } from "@/lib/db/schema";
import { getLayoutedElements } from "@/lib/utils";
import { UIMessage } from "ai";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

// Define the expected structure for a text part locally if not exported
interface TextPart {
  type: "text";
  text: string;
}

// Helper function to generate initial nodes and edges from messages
function convertToFlow(messages: Array<UIMessage>): {
  nodes: CustomNode[];
  edges: CustomEdge[];
} {
  const initialNodes: CustomNode[] = [];
  const initialEdges: CustomEdge[] = [];

  messages.forEach((message) => {
    // Skip user messages
    if (message.role === "user") {
      return; // Continue to the next message
    }

    // Logic now uses UIMessage structure
    const annotations = message.annotations;

    const suggestionsAnnotation = message.annotations?.find(
      (annotation) =>
        typeof annotation === "object" &&
        annotation !== null &&
        "suggestions" in annotation &&
        typeof annotation.suggestions === "object" &&
        annotation.suggestions !== null &&
        "suggestions" in annotation.suggestions &&
        Array.isArray(annotation.suggestions.suggestions)
    );

    if (suggestionsAnnotation) {
      const suggestionsData = (
        suggestionsAnnotation as {
          suggestions: {
            suggestions: {
              id: string;
              content: string;
            }[];
          };
        }
      ).suggestions.suggestions as Array<{
        id: string;
        content: string;
      }>;

      const fromSuggestionIdAnnotation = annotations?.find(
        (annotation) =>
          typeof annotation === "object" &&
          annotation !== null &&
          "fromSuggestionId" in annotation &&
          typeof annotation.fromSuggestionId === "string"
      );

      const fromSuggestionId = fromSuggestionIdAnnotation
        ? (fromSuggestionIdAnnotation as { fromSuggestionId: string })
            .fromSuggestionId
        : undefined;

      // Extract label from message.parts
      const firstTextPart = message.parts?.find(
        (part) => part.type === "text"
      ) as TextPart | undefined;
      const labelContent = firstTextPart
        ? firstTextPart.text.substring(0, 50) + "..."
        : `Msg: ${message.id.substring(0, 8)}...`;

      // Create root node for the message
      const rootNode: CustomNode = {
        id: message.id,
        data: { label: labelContent },
        position: { x: 0, y: 0 },
      };
      initialNodes.push(rootNode);

      // Create suggestion nodes and edges
      suggestionsData.forEach((suggestion) => {
        const suggestionNode: CustomNode = {
          id: suggestion.id,
          data: { label: suggestion.content },
          position: { x: 0, y: 0 },
        };
        initialNodes.push(suggestionNode);

        initialEdges.push({
          id: `${rootNode.id}-${suggestionNode.id}`,
          source: rootNode.id,
          target: suggestionNode.id,
          label: "suggestion",
        });
      });

      // Create edge if branching from a suggestion
      if (fromSuggestionId) {
        initialEdges.push({
          id: `${fromSuggestionId}-${message.id}`,
          source: fromSuggestionId,
          target: message.id,
          label: "branching...",
        });
      }
    }
  });

  const layoutedElements = getLayoutedElements(initialNodes, initialEdges, {
    direction: "TB",
  });

  return { nodes: layoutedElements.nodes, edges: layoutedElements.edges };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  const params = await props.params;
  const { id } = params;
  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  const messagesFromDb = await getMessagesByChatId({ id });

  function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
    return messages.map((message) => ({
      id: message.id,

      parts: message.parts
        ? (message.parts as UIMessage["parts"])
        : [{ type: "text", text: "" }],
      role: message.role as UIMessage["role"],
      // content will get deprecated in the future
      content: "",
      createdAt: message.createdAt,
      annotations: message.annotations as UIMessage["annotations"],
    }));
  }

  const uiMessages = convertToUIMessages(messagesFromDb);
  // Generate initial graph state from DB messages
  const { nodes: initialNodes, edges: initialEdges } =
    convertToFlow(uiMessages);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <ExploreChat
        id={id}
        user={session?.user}
        initialMessages={uiMessages}
        initialNodes={initialNodes}
        initialEdges={initialEdges}
      />
    </div>
  );
}
