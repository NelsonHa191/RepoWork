"use client";

// app/(chat)/explore/[id]/page.tsx (demo version)
// Loads a saved Explore chat from this browser instead of the database.
// Original: legacy/app/(chat)/explore/[id]/page.tsx
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ExploreChat, { CustomEdge, CustomNode } from "@/components/explore-chat";
import DemoChatNotFound from "@/components/demo-chat-not-found";
import Loading from "./loading";
import { getChat } from "@/lib/demo/history";
import { convertToFlow, textOf } from "@/lib/demo/flow";
import { DEMO_USER } from "@/lib/demo/user";
import type { UIMessage } from "ai";

type Loaded = { messages: UIMessage[]; nodes: CustomNode[]; edges: CustomEdge[] };

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [loaded, setLoaded] = useState<Loaded | null | undefined>(undefined);

  useEffect(() => {
    const chat = getChat(id);
    if (!chat || chat.mode !== "explore") {
      setLoaded(null);
      return;
    }
    const messages = chat.messages.map((m) => ({ ...m, content: textOf(m) }));
    setLoaded({ messages, ...convertToFlow(messages) });
  }, [id]);

  if (loaded === undefined) return <Loading />;
  if (loaded === null) return <DemoChatNotFound />;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <ExploreChat
        id={id}
        user={DEMO_USER}
        initialMessages={loaded.messages}
        initialNodes={loaded.nodes}
        initialEdges={loaded.edges}
      />
    </div>
  );
}
