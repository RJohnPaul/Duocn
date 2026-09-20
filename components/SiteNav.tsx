'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const LINKS = [
  { href: '/docs', label: 'Docs' },
  { href: '/components', label: 'Components' },
  { href: '/poses', label: 'Poses' },
];

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#6b6b74" />
        </linearGradient>
      </defs>
      <rect x="2" y="3.5" width="8.4" height="17" rx="2.6" fill="url(#lg)" />
      <rect x="13.6" y="3.5" width="8.4" height="17" rx="2.6" fill="url(#lg)" opacity="0.45" />
      <rect x="11.2" y="5" width="1.6" height="14" rx="0.8" fill="#ffffff" opacity="0.5" />
    </svg>
  );
}

export function SiteNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-6 px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
          <Logo />
          duocn
        </Link>
        <nav className="hidden items-center gap-5 text-[13px] md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`transition ${path === l.href ? 'text-white' : 'text-fog hover:text-white'}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2.5">
          <span className="hidden rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-fog-2 sm:inline">
            0.9.0 beta · iOS 27.1
          </span>
          <Link
            href="/docs"
            className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-ink"
            style={{ background: '#fafafa' }}
          >
            Get started
          </Link>
          <button
            className="md:hidden rounded-md border border-line px-2 py-1 text-[12px] text-fog"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            Menu
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line px-5 py-3 md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-1.5 text-[14px] text-fog">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
