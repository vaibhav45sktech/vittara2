import type { NextConfig } from "next";

const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_c21vb3RoLW1hbnRpcy04Ny5jbGVyay5hY2NvdW50cy5kZXYk",
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: "/sign-in",
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: "/sign-up",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;