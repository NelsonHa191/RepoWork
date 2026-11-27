// lib/auth-client.ts
import { createAuthClient } from "better-auth/client";

// Export the auth client with the correct interface
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});
