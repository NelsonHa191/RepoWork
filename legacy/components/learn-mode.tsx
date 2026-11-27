"use client";

// components/learn-mode.tsx
import { generateUUID } from "@/lib/utils";
import LearnChat from "./learn-chat";
import { User } from "better-auth";

export default function LearnMode({
  modeHandler,
  user,
}: {
  modeHandler?: (mode: "explore" | "learn") => void;
  user?: User;
}) {
  const id = generateUUID();
  return (
    <LearnChat
      id={id}
      key={id}
      initialMessages={[]}
      user={user}
      modeHandler={modeHandler}
    />
  );
}
