import type { Metadata } from 'next';
import { SiteNav } from '@/components/SiteNav';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'duocn — development for iPhone Duo',
    template: '%s — duocn',
  },
  description:
    'Opinionated SwiftUI presets for Apple\'s iPhone Duo APIs — ReservedRegion, DeviceHinge and ArrangementView — plus the pose harness Xcode does not give you. Copy the file, own the code.',
  keywords: ['SwiftUI', 'iPhone Duo', 'foldable', 'component library', 'iOS', 'dual screen'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <SiteNav />
        {children}
        <footer className="border-t border-line px-5 py-10">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 text-[12px] text-fog-2">
            <span>duocn · MIT · iPhone Duo · iOS 27.1 (beta)</span>
            <span className="font-mono">18 components · 0 dependencies</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
