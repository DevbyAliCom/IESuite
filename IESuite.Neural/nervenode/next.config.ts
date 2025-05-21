import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    env: {
        NEXT_PUBLIC_BRAIN_HUB_URL: process.env.NEXT_PUBLIC_BRAIN_HUB_URL,
    },
};

export default nextConfig;
