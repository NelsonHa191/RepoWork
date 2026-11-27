import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Demo stand-in for the sign-in and sign-up forms. The originals used Better
 * Auth (email/password and Google sign-in) backed by a Neon Postgres
 * database, which the demo doesn't have.
 */
export default function DemoAuthNotice({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">
              Accounts are turned off in this demo. You&apos;re already signed in
              as <span className="font-medium text-foreground">Demo User</span>,
              and your chats are saved in this browser.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            The original app had email/password and Google sign-in, built with
            Better Auth and a Postgres database.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/">Continue as Demo User</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/about">About this project</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
