import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "example.com",             // Replace with your image hosts
      "files.edgestore.dev",      // For images uploaded to Cloudinary
      "lh3.googleusercontent.com" // For Google avatars
    ],
  },
};

export default nextConfig;
