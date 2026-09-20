import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
export default {
  // There is a stray package-lock.json in the user's home directory, so Next
  // walks up and infers the workspace root as ~ instead of this project. Pin it,
  // or file tracing resolves against the wrong tree.
  outputFileTracingRoot: here,
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
