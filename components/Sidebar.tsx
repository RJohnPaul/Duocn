'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { byCategory } from '@/content/registry';

export function Sidebar() {
  const path = usePathname();
  const groups = byCategory();
  return (
    <nav className="space-y-6 text-[13px]">
      <div>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-fog-2">
          Getting started
        </div>
        <Link
          href="/docs"
          className={`block rounded-md px-2 py-1.5 transition ${
            path === '/docs' ? 'bg-white/[0.08] text-white' : 'text-fog hover:text-white'
          }`}
        >
          Introduction
        </Link>
        <Link
          href="/components"
          className={`block rounded-md px-2 py-1.5 transition ${
            path === '/components' ? 'bg-white/[0.08] text-white' : 'text-fog hover:text-white'
          }`}
        >
          All components
        </Link>
      </div>
      {groups.map((g) => (
        <div key={g.category}>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-fog-2">
            {g.category}
          </div>
          <div className="space-y-0.5">
            {g.items.map((c) => {
              const href = `/docs/${c.slug}`;
              const active = path === href;
              return (
                <Link
                  key={c.slug}
                  href={href}
                  className={`flex items-center justify-between rounded-md px-2 py-1.5 transition ${
                    active ? 'bg-white/[0.08] text-white' : 'text-fog hover:text-white'
                  }`}
                >
                  <span>{c.name}</span>
                  {c.duoOnly && (
                    <span  style={{ background: 'rgba(255,255,255,0.10)' }}>
                      FOLD
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
