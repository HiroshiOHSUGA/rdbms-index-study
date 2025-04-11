/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next.js 14以降のApp Routerを使用
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig 