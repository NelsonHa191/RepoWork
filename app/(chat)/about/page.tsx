import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Bot,
  Database,
  FolderGit2,
  Github,
  Layers,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "About · Repose AI",
  description: "How Repose AI was built, and how the demo version works.",
};

const REPO_URL = "https://github.com/NelsonHa191/RepoWork";

const authors = [
  { name: "Nelson", github: "NelsonHa191" },
  { name: "Ryan", github: "ryanside" },
  { name: "Evan", github: "evanz0820" },
];

const features = [
  {
    title: "Explore mode",
    body: "Ask about anything and get a streamed answer from Gemini, grounded in live Google Search results, with the sources listed underneath.",
  },
  {
    title: "A map of your curiosity",
    body: "Every answer comes with three follow-up suggestions. Clicking one branches the conversation, and the whole thing is drawn as a graph you can pan and zoom.",
  },
  {
    title: "Learn mode",
    body: "Type a topic and get a bite-sized lesson. \"Continue Learning\" builds the next lesson from everything you've covered so far, so it turns into a course.",
  },
  {
    title: "Lesson videos",
    body: "Each lesson can pull in a short YouTube video, found with the YouTube Data API using a search built from the lesson's content.",
  },
  {
    title: "Code playground",
    body: "Write code in 12 languages, ask the AI to predict what it outputs, or have it review the code and suggest improvements.",
  },
  {
    title: "Accounts and history",
    body: "Sign in with email or Google. Chats are saved and grouped by date in the sidebar, filterable by Explore or Learn, and Learn chats remember your lesson progress.",
  },
];

const pipeline = [
  "Your question",
  "Next.js API route",
  "Gemini 2.0 Flash + Google Search grounding",
  "Streamed answer + sources",
  "Second Gemini call → 3 suggestions",
  "React Flow graph",
];

const tables = [
  {
    name: "chats",
    note: "One row per conversation",
    columns: ["id (uuid, PK)", "user_id (FK → user)", "title", "mode (explore | learn)", "created_at"],
  },
  {
    name: "messages",
    note: "Every message, including sources and suggestions",
    columns: ["id (uuid, PK)", "chat_id (FK → chats)", "role", "parts (json)", "annotations (json)", "from_suggestion_id"],
  },
  {
    name: "learn_sessions",
    note: "Lesson progress for Learn chats",
    columns: ["id (uuid, PK)", "chat_id (FK → chats)", "current_lesson", "lesson_topic", "lesson_sequence (json)", "last_video_query"],
  },
  {
    name: "user · session · account · verification",
    note: "Managed by Better Auth for sign-in",
    columns: ["email + password accounts", "Google OAuth accounts", "session tokens", "email verification"],
  },
];

const stack = [
  "Next.js 15",
  "React 19",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Vercel AI SDK",
  "Gemini 2.0 Flash",
  "React Flow + dagre",
  "Better Auth",
  "Drizzle ORM",
  "Neon Postgres",
  "YouTube Data API",
  "Docker + Fly.io",
];

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl bg-muted/50 px-6 py-5 sm:py-6 shadow-sm outline outline-border">
      <h2 className="flex items-center gap-2 text-lg font-medium tracking-tight">
        <Icon className="size-5 text-primary" />
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg bg-background px-4 py-3 shadow-sm outline outline-border">{children}</div>;
}

export default function AboutPage() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <span className="text-sm">
          About <span className="font-semibold tracking-tight">Repose AI</span>
        </span>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
          {/* Intro */}
          <section className="rounded-xl bg-gradient-to-br from-primary/15 via-background to-accent/25 px-6 py-8 sm:px-10 sm:py-10 shadow-sm outline outline-border">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 font-medium text-primary">
                <Sparkles className="size-3.5" />
                AI-powered exploring and learning
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background/70 px-3 py-1 text-muted-foreground">
                <Users className="size-3.5" />
                Team project · Spring 2025
              </span>
            </div>
            <h1 className="mt-5 text-3xl sm:text-4xl font-medium tracking-tight bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text w-fit">
              About Repose AI
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-muted-foreground">
              Built by
              {authors.map((a, i) => (
                <span key={a.github} className="inline-flex items-center gap-1.5">
                  {i > 0 && (
                    <span className={i < authors.length - 1 ? "-ml-1.5" : ""}>
                      {i < authors.length - 1 ? "," : "&"}
                    </span>
                  )}
                  <a
                    href={`https://github.com/${a.github}`}
                    target="_blank"
                    rel="noreferrer"
                    title={`${a.name} on GitHub (@${a.github})`}
                    className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    <Github className="size-4" />
                    {a.name}
                  </a>
                </span>
              ))}
            </p>
            <div className="mt-6 max-w-3xl space-y-4 leading-relaxed">
              <p>
                Repose AI is a different way to use an AI chatbot. Instead of one long
                scrolling chat, <strong className="font-medium">Explore</strong> turns a
                conversation into a map of ideas you can branch off in any direction, and{" "}
                <strong className="font-medium">Learn</strong> turns any topic into a
                step-by-step course with code examples and videos.
              </p>
              <p>
                Ryan built the Explore mode: the streaming answers, the suggestions and the
                graph. I built Learn mode, the lesson videos, the code playground, sign-in
                and saved chat history, and got the whole thing deployed on Fly.io.
              </p>
            </div>
          </section>

          {/* What it does */}
          <Section icon={Sparkles} title="What it does">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <Card key={f.title}>
                  <h3 className="font-medium">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
                </Card>
              ))}
            </div>
          </Section>

          {/* AI */}
          <Section icon={Workflow} title="How the AI worked">
            <ol className="flex flex-wrap items-center gap-2 text-sm">
              {pipeline.map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  <span className="rounded-full bg-background px-3 py-1 shadow-sm outline outline-border">{step}</span>
                  {i < pipeline.length - 1 && <ArrowRight className="size-4 text-muted-foreground" />}
                </li>
              ))}
            </ol>
            <div className="mt-4 max-w-3xl space-y-3 text-sm text-muted-foreground">
              <p>
                Questions went to Next.js API routes that called{" "}
                <strong className="text-foreground">Gemini 2.0 Flash</strong> through the
                Vercel AI SDK, with <strong className="text-foreground">Google Search grounding</strong>{" "}
                turned on, so answers came with up-to-date sources. The answer streamed to
                the browser word by word.
              </p>
              <p>
                When the answer finished, a second call used{" "}
                <code className="rounded bg-background px-1 py-0.5 text-foreground">generateObject</code>{" "}
                with a Zod schema to produce exactly three follow-up suggestions. These were
                attached to the message as <em>annotations</em> on the same stream, then laid
                out as a tree with <strong className="text-foreground">dagre</strong> and drawn
                with <strong className="text-foreground">React Flow</strong>.
              </p>
              <p>
                Learn mode used its own system prompt that changed shape depending on the topic.
                Technical topics got a key concept, a code example and a practice exercise.
                Everything else got an overview, key points and a &ldquo;did you know?&rdquo;
                fact. Code blocks were pulled out of the answer into their own panels.
              </p>
            </div>
          </Section>

          {/* Database */}
          <Section icon={Database} title="How the database worked">
            <p className="max-w-3xl text-sm text-muted-foreground">
              Chats were stored in <strong className="text-foreground">Postgres on Neon</strong>,
              using <strong className="text-foreground">Drizzle ORM</strong> for the schema and
              queries. Each message kept the AI SDK&apos;s{" "}
              <code className="rounded bg-background px-1 py-0.5 text-foreground">parts</code> and{" "}
              <code className="rounded bg-background px-1 py-0.5 text-foreground">annotations</code>{" "}
              as JSON, so reopening an Explore chat could rebuild the whole graph from the saved
              suggestions and branch links.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {tables.map((t) => (
                <Card key={t.name}>
                  <h3 className="font-mono text-sm font-medium">{t.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{t.note}</p>
                  <ul className="mt-3 space-y-1 font-mono text-xs text-muted-foreground">
                    {t.columns.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </Section>

          <div className="grid gap-4 lg:grid-cols-2">
            <Section icon={Layers} title="Built with">
              <div className="flex flex-wrap gap-2">
                {stack.map((s) => (
                  <span key={s} className="rounded-full bg-background px-3 py-1 text-sm shadow-sm outline outline-border">
                    {s}
                  </span>
                ))}
              </div>
            </Section>

            <Section icon={FolderGit2} title="Where it is today">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  The live version needed API keys (Gemini, plus a YouTube key with a
                  small daily quota) and a database, so this version runs as a{" "}
                  <strong className="text-foreground">demo</strong>:
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Answers and lessons are pre-written for a few topics, and stream in just like the real ones did.</li>
                  <li>Lesson videos are hand-picked YouTube embeds, so no API key is needed.</li>
                  <li>JavaScript in the code playground really runs, in your browser.</li>
                  <li>You&apos;re signed in automatically, and chats are saved in this browser instead of a database.</li>
                </ul>
                <p>
                  The original code is kept in the repo&apos;s{" "}
                  <code className="rounded bg-background px-1 py-0.5 text-xs text-foreground">legacy</code>{" "}
                  folder.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-medium underline underline-offset-4"
                >
                  View the code on GitHub <ArrowRight className="size-3.5" />
                </a>
                <Link href="/" className="inline-flex items-center gap-1 font-medium underline underline-offset-4">
                  Try it out <Bot className="size-3.5" />
                </Link>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
