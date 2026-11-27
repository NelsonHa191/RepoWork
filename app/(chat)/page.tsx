"use client";

import { useState, useEffect } from "react";
import ExploreMode from "@/components/explore-mode";
import LearnMode from "@/components/learn-mode";
import { useAppContext } from "@/lib/app-context";
import { DEMO_USER } from "@/lib/demo/user";

export default function Chat() {
  const [mode, setMode] = useState<"explore" | "learn">("explore");
  const { setShowModeSwitcher } = useAppContext();
  // Demo: always signed in as the demo user (the original fetched the session)
  const user = DEMO_USER;

  // Use useEffect to set the showModeSwitcher state
  useEffect(() => {
    // Hide the original mode switcher since we're handling it in ChatInput
    setShowModeSwitcher(false);

    // Cleanup function to restore the mode switcher if the component unmounts
    return () => {
      setShowModeSwitcher(true);
    };
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {mode === "explore" ? (
        <ExploreMode
          key={`explore-${Date.now()}`}
          modeHandler={setMode}
          user={user || undefined} // Convert null to undefined for ExploreMode
        />
      ) : (
        <LearnMode
          key={`learn-${Date.now()}`}
          modeHandler={setMode}
          user={user || undefined} // Convert null to undefined for LearnMode as well
        />
      )}
    </div>
  );
}
