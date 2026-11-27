"use client";

// app/(chat)/learn/[id]/page.tsx (demo version)
// Loads a saved Learn chat (and its lesson progress) from this browser
// instead of the database.
// Original: legacy/app/(chat)/learn/[id]/page.tsx
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LearnChat from "@/components/learn-chat";
import DemoChatNotFound from "@/components/demo-chat-not-found";
import Loading from "./loading";
import { getChat, type StoredChat } from "@/lib/demo/history";
import { textOf } from "@/lib/demo/flow";
import { DEMO_USER } from "@/lib/demo/user";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [chat, setChat] = useState<StoredChat | null | undefined>(undefined);

  useEffect(() => {
    const saved = getChat(id);
    if (!saved || saved.mode !== "learn") {
      setChat(null);
      return;
    }
    setChat({ ...saved, messages: saved.messages.map((m) => ({ ...m, content: textOf(m) })) });
  }, [id]);

  if (chat === undefined) return <Loading />;
  if (chat === null) return <DemoChatNotFound />;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <LearnChat
        id={id}
        user={DEMO_USER}
        initialMessages={chat.messages}
        initialSession={chat.learnSession ?? null}
      />
    </div>
  );
}
