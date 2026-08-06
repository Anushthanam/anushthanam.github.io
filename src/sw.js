/* eslint-disable no-restricted-globals */
/**
 * Custom service-worker additions for Anushthanam PWA.
 *
 * Docusaurus plugin-pwa dynamically imports this module and invokes the
 * default export with { debug, offlineMode }. We register runtime Workbox
 * routes so the app always renders — even for pages the user hasn't visited
 * — and refreshes cached content when back online.
 *
 * See https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-pwa#swCustom
 */

import { NavigationRoute, registerRoute } from 'workbox-routing';
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

export default function swCustom(params) {
  const { offlineMode, debug } = params;
  if (debug) {
    console.log('[Anushthanam SW] custom code initialised, offlineMode =', offlineMode);
  }

  // HTML navigations: try network first (fresh content when online),
  // fall back to cache when offline. Guarantees pages open even without net.
  registerRoute(
    new NavigationRoute(
      new NetworkFirst({
        cacheName: 'anushthanam-pages',
        networkTimeoutSeconds: 3,
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            purgeOnQuotaError: true,
          }),
        ],
      }),
    ),
  );

  // Same-origin static assets (JS/CSS chunks, images, fonts): serve from
  // cache instantly, refresh in background.
  registerRoute(
    ({ request, url }) =>
      url.origin === self.location.origin &&
      ['script', 'style', 'image', 'font'].includes(request.destination),
    new StaleWhileRevalidate({
      cacheName: 'anushthanam-assets',
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 400,
          maxAgeSeconds: 60 * 60 * 24 * 60, // 60 days
          purgeOnQuotaError: true,
        }),
      ],
    }),
  );

  // Cross-origin fonts (Google Fonts): cache-first, they never change.
  registerRoute(
    ({ url }) =>
      url.origin === 'https://fonts.googleapis.com' ||
      url.origin === 'https://fonts.gstatic.com',
    new CacheFirst({
      cacheName: 'anushthanam-fonts',
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        }),
      ],
    }),
  );

  // Take control of open pages immediately after a new SW activates so users
  // don't need to close all tabs to get fresh content.
  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });
}
