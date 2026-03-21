/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    RENDER_API_KEY: process.env.RENDER_API_KEY,
  },
}

module.exports = nextConfig
