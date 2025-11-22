import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
   async rewrites() {
    return [
      {
        source: '/login',
        destination: '/auth/login',
      },
       {
        source: '/signup',
        destination: '/auth/signup',
      },
    ]
  },
};

export default nextConfig;
