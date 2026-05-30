/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Aumenta limite body size per upload immagini
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
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
