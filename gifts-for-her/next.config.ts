import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@mastra/*"],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "didactic-capybara-7vr7vrj5rx7c66x-3000.app.github.dev"],
    },
  },
};

export default nextConfig;