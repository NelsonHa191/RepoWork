// lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import * as schema from "./db/schema"; // Import the schema
import { drizzle } from "drizzle-orm/neon-http";

// Create the database connection
const db = drizzle(process.env.DATABASE_URL!);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql"
    schema: schema, // Pass the schema to the adapter
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  // Add better error handling with explicit type
  onError: (error: Error) => {
    console.error("Auth error:", error);
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});

// Create a type-safe function for getting server sessions
export async function getServerSession(request: Request) {
  try {
    // Pass the request context explicitly to avoid TS errors
    return await auth.api.getSession({
      headers: request.headers,
    });
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}
