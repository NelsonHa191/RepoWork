// app/(auth)/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Use only the methods that are actually provided by the handler
const handler = toNextJsHandler(auth.handler);

// Export only the methods that are available
export const GET = handler.GET;
export const POST = handler.POST;

// Note: We're omitting PUT, DELETE, PATCH, HEAD, and OPTIONS since they're not
// provided by the handler according to the TypeScript errors
