'use client';

import { useState } from 'react';
import { FoldDevice } from '@/components/FoldDevice';

function InnerCanvas() {
  return (
    <div className="flex h-full w-full flex-col p-3 text-white">
      <div className="text-[11px] font-semibold text-white/50">Inner · Landscape pose</div>
      <div className="mt-2 grid flex-1 grid-cols-6 gap-1.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="rounded-md"
            style={{ background: `linear-gradient(140deg,hsl(${i * 29} 72% 58%),hsl(${i * 29 + 50} 70% 42%))` }}
          />
        ))}
      </div>
    </div>
  );
}

function OuterCanvas() {
  return (
    <div className="flex h-full w-full flex-col p-2.5 text-white">
      <div className="text-[10px] font-semibold text-white/50">Outer · Closed</div>
      <div className="mt-2 grid flex-1 grid-cols-3 gap-1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="rounded-md"
            style={{ background: `linear-gradient(140deg,hsl(${i * 37} 70% 56%),hsl(${i * 37 + 50} 72% 40%))` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function FoldLab() {
  const [open, setOpen] = useState(1);
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-2xl font-bold">Fold lab</h1>
      <p className="mt-2 text-[13px] text-fog">
        Real geometry: open 164.6 × 117.8 mm, closed 84.1 × 117.8 mm. One half rotates 180° about the hinge.
      </p>

      <div className="mt-10 flex min-h-[340px] items-center justify-center rounded-2xl border border-line bg-ink-2">
        <FoldDevice openness={open} mm={2.6} inner={<InnerCanvas />} outer={<OuterCanvas />} />
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={() => setOpen(0)} className="rounded-full border border-line px-4 py-2 text-[13px]">
          Closed
        </button>
        <button onClick={() => setOpen(1)} className="rounded-full border border-line px-4 py-2 text-[13px]">
          Open
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={open}
          onChange={(e) => setOpen(Number(e.target.value))}
          className="flex-1"
          aria-label="Drag to open and close"
        />
        <span className="w-12 font-mono text-[12px] text-fog">{open.toFixed(2)}</span>
      </div>
    </main>
  );
}
