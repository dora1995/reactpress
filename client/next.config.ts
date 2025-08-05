import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_URL: 'http://localhost:3002'
  },
  images: {
    domains: ['localhost'], // 如果你的图片来自这个域名
  },
};

export default nextConfig;