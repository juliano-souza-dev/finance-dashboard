// pwa.config.ts

type PWAOptions = {
  dest: string;
  register: boolean;
  skipWaiting: boolean;
  disable?: boolean;
  runtimeCaching?: unknown[];
};

const pwaConfig: PWAOptions = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      // Google Fonts
      urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
    {
      // Imagens/ícones
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'images',
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      // JS/CSS
      urlPattern: /\.(?:js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'static-resources' },
    },
    {
      // APIs do app (transactions)
      urlPattern: /\/api\/transactions/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-transactions',
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
  ],
};

export default pwaConfig;
