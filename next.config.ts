import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
