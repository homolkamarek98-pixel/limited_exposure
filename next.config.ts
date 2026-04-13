import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Packeta API key je veřejný — použije se v checkout widgetu na klientovi
    NEXT_PUBLIC_PACKETA_API_KEY: process.env.PACKETA_API_KEY ?? "",
  },
};

export default nextConfig;
