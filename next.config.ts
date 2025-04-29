import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)", // Apply headers to all routes
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin", // Allows popups only from the same origin
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp", // Requires all subresources to opt-in via CORP or CORS headers
          },
        ],
      },
    ];
  },
};

export default nextConfig;
