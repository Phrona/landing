import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The decision briefs sit outside public/ and are read by the download route.
  outputFileTracingIncludes: {
    "/download/[brief]": ["./private/briefs/**"],
  },
};

export default nextConfig;
