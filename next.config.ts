import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Trailing slashを有効化してGitHub Pagesとの互換性を向上
  trailingSlash: true,
};

export default nextConfig;
