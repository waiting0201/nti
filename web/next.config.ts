import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // mockup 的 <img> 一律原樣輸出，不走 next/image，確保版面與 mockup 逐像素一致
  images: { unoptimized: true },
}

export default nextConfig
