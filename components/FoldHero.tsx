'use client';

import { useCallback, useRef, useState } from 'react';
import { FoldDevice } from './FoldDevice';
import { Art, GRAD, Glyph, ICON } from './previews/ui';

/**
 * Vertical control rail.
 *
 * Apple's HIG: because the outer display is wider and shorter than other iPhone
 * displays, the system moves toolbars and tab bars to the SIDE to preserve
 * vertical space — and they stay on the side on the inner display in landscape,
 * so the experience is continuous as the device opens. Drawing a bottom tab bar
 * here would misrepresent the platform.
 */
function Rail({ compact = false }: { compact?: boolean }) {
  const items = [ICON.stack, ICON.radio, ICON.search];
  return (
    <div
      className="flex shrink-0 flex-col items-center gap-3 border-r border-white/[0.07] py-3"
      style={{ width: compact ? 26 : 30 }}
    >
      {items.map((d, i) => (
        <div
          key={i}
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 20,
            height: 20,
            color: i === 0 ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.38)',
            background: i === 0 ? 'rgba(255,255,255,0.10)' : 'transparent',
          }}
        >
          <Glyph d={d} size={12} />
        </div>
      ))}
    </div>
  );
}

function TrackRow({ i, active, dense }: { i: number; active?: boolean; dense?: boolean }) {
  const names = ['Seam Line', 'Hinge Theory', 'Two Panels', 'Cold Aluminium', 'Unfold', 'Detent'];
  return (
    <div className={`flex items-center gap-2 rounded-lg px-1.5 ${dense ? 'py-1' : 'py-1.5'} ${active ? 'bg-white/[0.09]' : ''}`}>
      <Art seed={i + 3} className="h-6 w-6 shrink-0" radius={6} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[9px] leading-tight text-white/90">{names[i % names.length]}</div>
        <div className="truncate text-[7.5px] leading-tight text-white/40">Duo Sessions</div>
      </div>
    </div>
  );
}

/** Inner display: Split View multitasking — Apple's own framing for Landscape pose. */
function InnerDisplay() {
  return (
    <div className="flex h-full w-full text-white">
      <Rail />
      <div className="min-w-0 flex-1 border-r border-white/[0.07] p-2">
        <div className="mb-1.5 text-[10px] font-semibold">Duo Sessions</div>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <TrackRow key={i} i={i} active={i === 4} />
        ))}
      </div>
      <div className="flex w-[44%] shrink-0 flex-col items-center justify-center gap-2 p-2">
        <Art seed={5} className="h-16 w-16 shadow-xl" radius={10} />
        <div className="text-center">
          <div className="text-[10px] font-semibold">Unfold</div>
          <div className="text-[8px] text-white/45">Duo Sessions</div>
        </div>
        <div className="w-full px-2">
          <div className="h-[3px] w-full rounded-full bg-white/12">
            <div className="h-[3px] w-1/3 rounded-full" style={{ background: GRAD }} />
          </div>
        </div>
        <div className="flex items-center gap-3 text-white/85">
          <Glyph d="M11 6 4 12l7 6V6Zm9 0-7 6 7 6V6Z" size={11} />
          <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: GRAD }}>
            <Glyph d={ICON.play} size={11} className="text-white" />
          </div>
          <Glyph d="M13 6l7 6-7 6V6ZM4 6l7 6-7 6V6Z" size={11} />
        </div>
      </div>
    </div>
  );
}

/** Outer display: one column, controls on the side, camera corner left clear. */
function OuterDisplay() {
  return (
    <div className="flex h-full w-full text-white">
      <Rail compact />
      <div className="min-w-0 flex-1 p-2">
        {/* Top-left is the outer camera's reserved region — content starts clear of it. */}
        <div className="mb-1.5 pl-6 text-[9px] font-semibold text-white/85">Library</div>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <TrackRow key={i} i={i} active={i === 4} dense />
        ))}
      </div>
    </div>
  );
}

export function FoldHero() {
  const [openness, setOpenness] = useState(1);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startOpen = useRef(1);

  const onDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startOpen.current = openness;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [openness]);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    // 220px of travel spans the full fold — enough throw to feel deliberate.
    const delta = (e.clientX - startX.current) / 220;
    setOpenness(Math.min(Math.max(startOpen.current + delta, 0), 1));
  }, []);

  const onUp = useCallback(() => {
    dragging.current = false;
    // Hinge detent: a real one settles to rest, it does not stop wherever you let go.
    setOpenness((v) => (v > 0.5 ? 1 : 0));
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="flex min-h-[380px] cursor-ew-resize touch-none items-center justify-center"
      >
        <FoldDevice openness={openness} mm={3.0} inner={<InnerDisplay />} outer={<OuterDisplay />} />
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="glass inline-flex gap-1 rounded-full p-1" role="group" aria-label="Device state">
          {[
            ['Closed', 0],
            ['Open', 1],
          ].map(([label, v]) => {
            const active = openness === v;
            return (
              <button
                key={label as string}
                onClick={() => setOpenness(v as number)}
                aria-pressed={active}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition ${
                  active ? 'bg-white/90 text-ink' : 'text-fog hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <label className="flex w-[260px] items-center gap-3">
          <span className="sr-only">Drag to open and close</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={openness}
            onChange={(e) => setOpenness(Number(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-white"
            aria-label="Drag to open and close"
          />
        </label>
        <p className="text-[12px] text-fog-2">Drag the device — 164.6 × 117.8 mm open, 84.1 × 117.8 mm closed.</p>
      </div>
    </div>
  );
}
