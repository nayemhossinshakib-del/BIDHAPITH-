import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["better-sqlite3"],
  outputFileTracingIncludes: {
    "/*": ["./prisma/demo.sqlite"],
    "/admin": ["./prisma/demo.sqlite"],
    "/admin/:path*": ["./prisma/demo.sqlite"],
    "/api/:path*": ["./prisma/demo.sqlite"],
    "/login": ["./prisma/demo.sqlite"],
    "/school/:path*": ["./prisma/demo.sqlite"],
    "/teacher/:path*": ["./prisma/demo.sqlite"],
    "/accountant/:path*": ["./prisma/demo.sqlite"],
    "/student/:path*": ["./prisma/demo.sqlite"],
    "*": ["./prisma/demo.sqlite"],
  },
  images: {
    remotePatterns: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
