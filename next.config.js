/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "default",
    domains: ["raw.githubusercontent.com"],
  },
};

module.exports = nextConfig;
