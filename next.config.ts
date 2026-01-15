import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  devIndicators: {
    position: "bottom-right",
  },
  experimental: {
    // @ts-ignore
    appDir: true,
  } as any,
  webpack: (config) => {
    config.resolve.modules.push(path.resolve(__dirname, "src"));
    return config;
  },
};

export default nextConfig;
