/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // Proxy /chat requests to the backend server
  async rewrites() {
    return [
      {
        source: "/chat",
        destination: "http://backend:8000/chat",
      },
    ];
  },
};

export default nextConfig;
