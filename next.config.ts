import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         {
            hostname: "m7o79ww1a4.ufs.sh",
            protocol: "https",
         },
         {
            hostname: "placehold.co",
            protocol: "https",
         },
         {
            hostname: "utfs.io",
            protocol: "https",
         },
         {
            hostname: "images.unsplash.com",
            protocol: "https",
         },
         {
            hostname: "plus.unsplash.com",
            protocol: "https",
         },
      ],
   },
};

export default nextConfig;
