import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://andyfmaxwell-posts.s3.us-west-1.amazonaws.com/*'),
    ]
  }
};

export default nextConfig;
