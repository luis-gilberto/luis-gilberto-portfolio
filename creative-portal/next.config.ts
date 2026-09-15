import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        // Exact legacy bookmark / PWA variant — not a wildcard
        source: "/studio/kitchen/costello/index.html",
        destination: "https://www.luis-gilberto.com/studio/kitchen/costello/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
