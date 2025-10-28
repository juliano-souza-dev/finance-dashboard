import type { NextConfig } from "next";


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
 
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
        { key: 'Pragma', value: 'no-cache' },
        { key: 'Expires', value: '0' },
      ],
    },
  ],
};

module.exports = nextConfig;
