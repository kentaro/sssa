import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? '/sssa' : '',
  images: {
    unoptimized: true,
  },
  // Trailing slashを有効化してGitHub Pagesとの互換性を向上
  trailingSlash: true,
};

export default nextConfig;
