# Repose AI

An AI-powered way to **explore** and **learn** about anything. Explore turns a
conversation into a branching map of ideas, and Learn turns any topic into a
step-by-step course with code examples and videos.

Built by [Nelson](https://github.com/NelsonHa191), [Ryan](https://github.com/ryanside) and [Evan](https://github.com/evanz0820) in spring 2025.

> ⚠️ **This is now a demo.** The original used Gemini, the YouTube Data API and
> a Postgres database, all of which need API keys or paid services. The demo
> runs with **no API keys at all**:
>
> - Answers and lessons are **pre-written** for a few topics, and stream in through the same Vercel AI SDK pipeline the real ones did.
> - Lesson videos are **hand-picked YouTube embeds** (no API key needed).
> - JavaScript in the Code Playground **really runs**, in a sandboxed worker in your browser.
> - You're signed in automatically as a demo user, and chats are **saved in your browser** (localStorage) instead of a database.
>
> The **original code is kept in [`legacy/`](legacy/)**, with instructions to bring it back.

## Features

- **Explore mode**: streamed, search-grounded answers with sources, plus three follow-up suggestions per answer
- **Graph view**: every answer and suggestion drawn as a tree with React Flow + dagre, which grows as you branch
- **Learn mode**: bite-sized lessons, with "Continue Learning" building the next one into a course
- **Lesson videos**: a related YouTube video for each lesson
- **Code Playground**: an editor for 12 languages, with "Run" and an AI code review
- **History**: chats grouped by date in the sidebar, filterable by mode, and reopenable with lesson progress
- **About page**: `/about` explains how everything worked

Demo topics: *Explain quantum computing*, *How do black holes form?*, *Best
practices for React development*, *How does the internet work?* (Explore), and
*Python*, *quantum physics*, *machine learning* (Learn). The home screen shows
them as clickable chips.

## Tech stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui ·
Vercel AI SDK · React Flow + dagre · react-markdown

Originally also: Gemini 2.0 Flash · YouTube Data API · Better Auth · Drizzle ORM ·
Neon Postgres · Docker + Fly.io (see [`legacy/`](legacy/)).

## How the demo works

| Piece | File |
| --- | --- |
| Pre-written Explore answers, sources and suggestions | `lib/demo/explore-content.ts` |
| Pre-written Learn courses (code examples verified by running them) | `lib/demo/learn-content.ts` |
| Topic list, keyword matching, lesson videos | `lib/demo/catalog.ts` |
| A "language model" that streams scripted text into `streamText()` in place of `google(...)` | `lib/demo/scripted-model.ts` |
| Browser-side chat history (replaces the database) | `lib/demo/history.ts` |
| Code Playground samples and the JavaScript sandbox | `lib/demo/code-samples.ts`, `lib/demo/run-javascript.ts` |
| Request body checks for the API routes | `lib/demo/request.ts` |

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No `.env` file is needed.

## Deploying on Vercel

1. Import the repo at [vercel.com/new](https://vercel.com/new).
2. Keep the detected **Next.js** preset. No environment variables are needed.
3. Deploy. Every push to `main` redeploys automatically.

## Security notes

- There are **no secrets** in the demo: no API keys, database URLs or auth secrets.
- The API routes only return pre-written text. They validate and size-limit
  request bodies, and never call external services.
- Security headers (CSP, `X-Frame-Options`, `nosniff`, Referrer and Permissions
  policies) are set in `next.config.ts`. The CSP only allows this site's own
  scripts, plus `youtube-nocookie.com` frames for videos.
- `npm audit` still reports advisories in AI SDK 4's dependency chain
  (`@ai-sdk/provider-utils` response size limits, `jsondiffpatch`'s HTML
  formatter, and `zod` large-array parsing). The demo doesn't reach any of
  them: it makes no provider HTTP calls, doesn't use the HTML formatter, and
  doesn't run zod on request input. Fixing them for good means upgrading to AI
  SDK 5+, which rewrites `useChat`.
