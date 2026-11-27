// lib/demo/user.ts
// In the demo everyone is signed in as the same pretend user, so the
// "logged in" features (saved history, chat URLs) all work without accounts.

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export const DEMO_USER: DemoUser = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@example.com",
  image: null,
};
