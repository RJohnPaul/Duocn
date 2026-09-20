/** @type {import('next').NextConfig} */
export default {
  outputFileTracingIncludes: {
    '/docs/**': ['./swift/DuoCN/Sources/DuoCN/**/*.swift'],
  },
  async redirects() {
    return [
      // 0.x vocabulary. These slugs shipped, so they must not 404.
      { source: '/docs/duo-posture', destination: '/poses', permanent: true },
      { source: '/docs/hinge-split', destination: '/docs/companion-pane', permanent: true },
      { source: '/docs/hinge-tab-bar', destination: '/poses', permanent: true },
      { source: '/docs/duo-drag-bridge', destination: '/poses', permanent: true },
      { source: '/docs/mirror-stage', destination: '/docs/duo-preview', permanent: true },
      { source: '/components/:slug', destination: '/docs/:slug', permanent: true },
    ];
  },
};
