# Legacy (original) version

This folder holds the **original code** for Repose AI from when it ran against
real services:

- **Gemini 2.0 Flash** (with Google Search grounding) for answers, lessons and the code assistant
- **YouTube Data API v3** for lesson videos
- **Better Auth** (email/password and Google sign-in) with **Neon Postgres** and **Drizzle ORM**
- **Docker + Fly.io** for hosting

The live app now runs as a **demo** with pre-written answers and no API keys
(see `lib/demo/` in the project root). Nothing in this folder is imported or
built: it's excluded in `tsconfig.json` and `eslint.config.mjs`. It's kept for
reference, and so the real version can be brought back.

## What's in here

The folder mirrors the project root. Each file is the original version of a
file that demo mode replaced or removed:

| Path | What it did |
| --- | --- |
| `app/(chat)/api/explore/route.ts` | Explore answers: Gemini + search grounding, saved to the database |
| `app/(chat)/api/learn/route.ts` | Learn lessons, with a system prompt that changed for technical vs. general topics |
| `app/(chat)/api/code-assistant/route.ts` | Code Playground: predicted program output and code reviews |
| `app/(chat)/actions.ts` | `generateSuggestions()` (three follow-ups via `generateObject` + Zod) and chat history |
| `app/(chat)/youtube-shorts.tsx` | Searched the YouTube Data API for a short matching the lesson |
| `app/(chat)/explore/[id]/page.tsx`, `learn/[id]/*` | Server pages that loaded saved chats from Postgres |
| `app/(chat)/layout.tsx`, `page.tsx` | Read the signed-in user's session |
| `app/(auth)/**` | Real sign-in / sign-up forms and the Better Auth API route |
| `lib/auth.ts`, `lib/auth-client.ts` | Better Auth server and client |
| `lib/db/schema.ts`, `lib/db/queries.ts` | Drizzle schema (`chats`, `messages`, `learn_sessions` + Better Auth tables) and queries |
| `components/*` | Components before the small demo changes (saving to the browser, prompt chips, etc.) |
| `next.config.ts`, `package.original.json` | Original config and dependencies |
| `Dockerfile`, `fly.toml`, `docker-entrypoint.js`, `deploy.sh` | Fly.io / Docker deployment |
| `drizzle.config.ts` | Drizzle Kit migrations config |
| `.github/workflows/ci.yaml` | Original pnpm-based CI |

## Bringing the real version back

1. Copy these files back over their demo versions (and remove `lib/demo/`
   usages), or check out the commit before the demo was added.
2. Restore the dependencies from `package.original.json`
   (`better-auth`, `@ai-sdk/google`, `drizzle-orm`, `@neondatabase/serverless`, `dotenv`, `drizzle-kit`).
3. Create a `.env.local` (never commit it):
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=...   # Gemini
   NEXT_PUBLIC_YOUTUBE_API_KEY=...    # YouTube Data API v3, restricted to your domain
   DATABASE_URL=postgres://...        # Neon
   BETTER_AUTH_SECRET=...
   GOOGLE_CLIENT_ID=...               # Google sign-in
   GOOGLE_CLIENT_SECRET=...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
4. Create the tables with `npx drizzle-kit push`.

> **Note:** `NEXT_PUBLIC_*` variables are bundled into the browser JavaScript,
> so anyone visiting the site can read them. A YouTube key used this way
> must be restricted (HTTP referrers + YouTube Data API only) in Google Cloud.
> The original `fly.toml` had the key written in it. That line has been
> removed from this copy, and the key itself should be revoked.
