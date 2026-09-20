'use client';

import { ReactNode } from 'react';

export const ACCENT = '#fafafa';
export const ACCENT_2 = '#8b8b94';
// The only gradient in the system: white falling to grey. No hue, anywhere.
export const GRAD = `linear-gradient(135deg, ${ACCENT}, ${ACCENT_2})`;

/** Full-bleed panel interior with the Duo status bar. */
export function Screen({
  children,
  title,
  className = '',
  pad = true,
}: {
  children: ReactNode;
  title?: string;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div className={`flex h-full flex-col text-[13px] text-white/90 ${className}`}>
      <div className="flex shrink-0 items-center justify-between px-4 pt-3 text-[10px] font-semibold tracking-wide text-white/45">
        <span>9:41</span>
        {title && <span className="text-white/70">{title}</span>}
        <span className="flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/50" />
          <span className="inline-block h-2 w-3.5 rounded-[2px] border border-white/40" />
        </span>
      </div>
      <div className={`min-h-0 flex-1 ${pad ? 'p-4' : ''}`}>{children}</div>
    </div>
  );
}

export function Card({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur-xl ${className}`}
      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14)' }}
    >
      {children}
    </div>
  );
}

/** A square of album-art-ish gradient, deterministic per seed. */
export function Art({ seed, className = '', radius = 12 }: { seed: number; className?: string; radius?: number }) {
  // Lightness, not hue — album art in a black-and-white system.
  const top = 38 + ((seed * 37) % 44);
  const bottom = Math.max(16, top - 22);
  return (
    <div
      className={className}
      style={{
        borderRadius: radius,
        background: `linear-gradient(140deg, hsl(0 0% ${top}%), hsl(0 0% ${bottom}%))`,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)',
      }}
    />
  );
}

export function Glyph({ d, size = 16, className = '' }: { d: string; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className={className} aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const ICON = {
  play: 'M8 5.5v13l10-6.5-10-6.5Z',
  stack: 'M4 8.5 12 4l8 4.5-8 4.5-8-4.5Zm0 7L12 20l8-4.5',
  radio: 'M12 12h.01M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9M4.5 4.5a10.6 10.6 0 0 0 0 15M19.5 4.5a10.6 10.6 0 0 1 0 15',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5.5-1.5L21 21',
  wand: 'm4 20 11-11M15 4l1.2 2.8L19 8l-2.8 1.2L15 12l-1.2-2.8L11 8l2.8-1.2L15 4Z',
  crop: 'M7 3v14h14M3 7h14v14',
  sliders: 'M4 8h10M18 8h2M4 16h4M12 16h8M14 5v6M8 13v6',
  share: 'M12 15V4m0 0L8.5 7.5M12 4l3.5 3.5M5 14v4.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V14',
  check: 'm5 12.5 4.5 4.5L19 7',
  warn: 'M12 8v5m0 3h.01M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z',
  speaker: 'M4 9.5h3l4.5-3.5v12L7 14.5H4v-5ZM15 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11',
  camera: 'M3 8.5A1.5 1.5 0 0 1 4.5 7h2L8 5h8l1.5 2h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-9Zm9 8.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
  brush: 'M14 4 20 10 10 20H4v-6L14 4Z',
  layers: 'M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5M3 17.5l9 5 9-5',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6 6 18',
  filter: 'M4 6h16M7 12h10M10 18h4',
};

export function Pill({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'accent' }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide"
      style={
        tone === 'accent'
          ? { background: 'rgba(255,255,255,0.14)', color: '#fafafa' }
          : { background: 'rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.6)' }
      }
    >
      {children}
    </span>
  );
}
