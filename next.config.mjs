/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "image.tmdb.org" },
      { hostname: "bqovjefwbplxopfhylji.supabase.co" }, // Supabase 이미지 URL 호스트네임 추가
    ],
  },
};

export default nextConfig;
