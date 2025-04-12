/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // ネットワークからのアクセスを許可する設定
  async rewrites() {
    return [];
  }
}

module.exports = nextConfig 