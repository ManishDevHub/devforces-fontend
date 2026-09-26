import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://13.127.6.1:4000/api/:path*",
      },
    ];
  },
};

export default nextConfig;