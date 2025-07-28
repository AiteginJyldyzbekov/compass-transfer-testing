import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin(); // Заголовки безопасности, которые будут применяться ко всем маршрутам
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self)',
  },
];
const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    dangerouslyAllowSVG: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'funny.klev.club',
        port: '',
        pathname: '/uploads/**',
      },
    ],
    domains: ['localhost', 'compass.local', 'example.com', 'funny.klev.club'],
  },

  // Добавляем настройку заголовков
  async headers() {
    return [
      {
        // Применяем ко всем маршрутам
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Кэширование статических изображений
        source: '/regions/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // Кэш на год
          },
        ],
      },
      {
        // Кэширование флагов и других статических ресурсов
        source: '/(flag|logo|fonts|taxi-tariffs)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // Кэш на год
          },
        ],
      },
      {
        // Отдельно настраиваем Content-Security-Policy для API
        source: '/api/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'none'; style-src 'self'",
          },
        ],
      },
      {
        // Добавляем заголовки CORS для запросов к внешнему API
        source: '/Auth/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://compass-api.karaoketest.ru:80' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://compass-api.karaoketest.ru:80/:path*',
      },
    ];
  },

  experimental: {
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },

  // Оптимизация Webpack для уменьшения предупреждений о больших строках
  webpack: (config, { dev, isServer }) => {
    // Оптимизация кэша для больших строк
    if (!dev && !isServer) {
      config.cache = {
        ...config.cache,
        compression: 'gzip', // Сжатие кэша
        maxMemoryGenerations: 1, // Ограничение памяти
      };
    }

    // Оптимизация для SVG и больших строк
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = withNextIntl(nextConfig);
