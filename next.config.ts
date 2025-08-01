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
      ],
   },
};

export default nextConfig;
