'use client';

import { useState } from 'react';

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      className="rounded-md border border-white/12 bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-fog transition hover:border-white/25 hover:text-white"
    >
      {done ? 'Copied' : label}
    </button>
  );
}

export function CodeBlock({
  code,
  html,
  filename,
  collapsible = false,
}: {
  code: string;
  html: string;
  filename?: string;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(!collapsible);
  const lines = code.split('\n').length;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-ink-2">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <div className="flex items-center gap-2 font-mono text-[11px] text-fog-2">
          {filename && <span className="text-fog">{filename}</span>}
          <span>{lines} lines</span>
        </div>
        <div className="flex items-center gap-1.5">
          {collapsible && (
            <button
              onClick={() => setOpen(!open)}
              className="rounded-md border border-white/12 bg-white/[0.06] px-2.5 py-1 text-[11px] text-fog transition hover:text-white"
            >
              {open ? 'Collapse' : 'Expand'}
            </button>
          )}
          <CopyButton text={code} />
        </div>
      </div>
      <div
        className="overflow-auto transition-[max-height] duration-300"
        style={{ maxHeight: open ? 2400 : 220 }}
      >
        <pre className="p-4">
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </div>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-full border-t border-line bg-gradient-to-t from-ink-2 to-transparent py-2 text-[11px] text-fog hover:text-white"
        >
          Show all {lines} lines
        </button>
      )}
    </div>
  );
}
