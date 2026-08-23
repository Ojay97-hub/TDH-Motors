import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/our-inventory",
        destination: "/inventory",
        permanent: true,
      },
    ];
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Next's default top breakpoint is 3840px. Nothing on this site renders an
    // image anywhere near that wide — the biggest box is the 1216px car gallery
    // — but a retina screen asks for 2x and lands on 3840 anyway. Straight off
    // the camera that's a 2.3MB AVIF per photo versus 0.9MB at 2048, for no
    // visible difference at the size it's actually displayed.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
