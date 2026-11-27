// next.config.ts (demo version)
// Original config (Fly.io / Better Auth workarounds): legacy/next.config.ts
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content Security Policy: only this site's own scripts and API, plus
// youtube-nocookie.com for lesson videos. 'unsafe-inline' scripts are needed
// for Next.js's inline bootstrap scripts. blob: workers run the
// Code Playground's JavaScript.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "frame-src https://www.youtube-nocookie.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  // YouTube embeds need the referrer's origin, so don't use no-referrer here
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
