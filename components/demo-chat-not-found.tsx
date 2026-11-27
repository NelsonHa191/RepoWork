"use client";

import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

/** Shown when a saved chat link isn't in this browser's storage. */
export default function DemoChatNotFound() {
  return (
    <div className="flex flex-col h-full w-full">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-2xl font-medium tracking-tight">This chat isn&apos;t saved here</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          In the demo, chats are saved in your browser instead of a database, so a chat link
          only works in the browser that created it (and until the demo is reset).
        </p>
        <Button asChild className="mt-2">
          <Link href="/">Start a new chat</Link>
        </Button>
      </div>
    </div>
  );
}
