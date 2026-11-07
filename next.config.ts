import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The decision briefs sit outside public/ and are read by the download route.
  // Old addresses kept working: the explainer moved to /how-it-works, and the
  // briefs already in circulation link to /learn-more, now /connect.
  async redirects() {
    return [
      { source: "/understanding-phrona", destination: "/how-it-works", permanent: true },
      { source: "/learn-more", destination: "/connect", permanent: true },
    ];
  },
  outputFileTracingIncludes: {
    "/download/[brief]": ["./private/briefs/**"],
  },
};

export default nextConfig;
