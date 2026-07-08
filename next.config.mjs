/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Bypasses the ESLint 9 serialization error during next build
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
};

export default nextConfig;
