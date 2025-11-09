/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['maps.googleapis.com'],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/prenota',
        destination: 'https://wa.me/393392399044?text=Ciao,%20vorrei%20prenotare%20un%20appuntamento',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
