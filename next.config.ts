import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep existing headers config
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
  // Add this configuration to prevent prerendering /protected/record
  experimental: {
    workerThreads: true,
    cpus: 4,
  },
  // Use runtime config for the recording page
  reactStrictMode: true,
};

export default nextConfig;
