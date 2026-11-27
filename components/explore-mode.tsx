// components/explore-mode.tsx
import { generateUUID } from "@/lib/utils";
import ExploreChat from "./explore-chat";
import type { DemoUser as User } from "@/lib/demo/user";

export default function ExploreMode({
  modeHandler,
  user,
}: {
  modeHandler?: (mode: "explore" | "learn") => void;
  user?: User;
}) {
  const id = generateUUID();
  return (
    <ExploreChat
      id={id}
      key={id}
      initialMessages={[]}
      initialNodes={[]}
      initialEdges={[]}
      user={user}
      modeHandler={modeHandler}
    />
  );
}
