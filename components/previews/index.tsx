'use client';

import { useEffect, useRef, useState } from 'react';
import type { Pose } from '@/content/registry';
import { ACCENT, ACCENT_2, GRAD, Art, Card, Glyph, ICON, Pill, Screen } from './ui';

export type PreviewProps = { pose: Pose; display: 'inner' | 'outer' };
type Preview = (p: PreviewProps) => React.ReactNode;

const isOpen = (p: Pose) => p !== 'closed';

/* ------------------------------------------------------------------ */
/* Foundations                                                         */
/* ------------------------------------------------------------------ */

const PostureReadout: Preview = ({ pose, display }) => {
  const seam = { closed: 0, portrait: 0, landscape: 0, seated: 20, standing: 20 }[pose];
  const angle = { closed: 0, portrait: 180, landscape: 180, seated: 115, standing: 80 }[pose];
  return (
    <Screen title={display === 'outer' ? 'outer' : 'inner'}>
      <div className="flex h-full flex-col justify-center gap-3">
        <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">environment</div>
        <div className="font-mono text-[15px]" style={{ color: ACCENT_2 }}>
          \.duoPose
        </div>
        <div className="text-[34px] font-semibold leading-none">.{pose}</div>
        <div className="mt-2 space-y-1.5 font-mono text-[11px] text-white/55">
          <div>isSpanned <span className="text-white/85">{String(isOpen(pose))}</span></div>
          <div>hingeAxis <span className="text-white/85">.{pose === 'seated' ? 'horizontal' : 'vertical'}</span></div>
          <div>occlusion <span className="text-white/85">{seam}pt</span></div>
          <div>angle <span className="text-white/85">{angle}°</span></div>
          <div>duoScreen <span className="text-white/85">.{display}</span></div>
        </div>
      </div>
    </Screen>
  );
};

const ThemeSheet: Preview = () => (
  <Screen title="DuoTheme">
    <div className="space-y-3">
      <div>
        <div className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-white/40">colour</div>
        <div className="flex gap-1.5">
          {[GRAD, '#e4e4e7', '#9b9ba3', 'rgba(255,255,255,0.10)'].map((bg, i) => (
            <div key={i} className="h-8 flex-1 rounded-lg border border-white/10" style={{ background: bg }} />
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-white/40">radius · concentric</div>
        <div className="flex items-end gap-1.5">
          {[10, 18, 28, 44].map((r) => (
            <div
              key={r}
              className="flex h-12 flex-1 items-end justify-center border border-white/15 bg-white/[0.05] pb-1 font-mono text-[9px] text-white/45"
              style={{ borderRadius: r }}
            >
              {r}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1 text-[10px] uppercase tracking-[0.16em] text-white/40">type</div>
        <div className="space-y-0.5">
          <div className="text-[22px] font-bold leading-tight">Display</div>
          <div className="text-[15px] font-semibold">Headline</div>
          <div className="text-[13px] text-white/75">Body copy sits here.</div>
          <div className="font-mono text-[11px] text-white/50">mono · 14 / medium</div>
        </div>
      </div>
      <div className="flex gap-1 pt-0.5">
        {['4', '8', '12', '20', '32'].map((s) => (
          <div key={s} className="rounded bg-white/[0.07] px-1.5 py-1 font-mono text-[9px] text-white/45">{s}</div>
        ))}
      </div>
    </div>
  </Screen>
);

const GlassCardPreview: Preview = ({ pose }) => (
  <Screen title="GlassCard">
    <div className="space-y-3">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] text-white/50">Battery</div>
            <div className="text-lg font-semibold">82%</div>
          </div>
          <Ring value={0.82} size={44} width={5} />
        </div>
      </Card>
      <Card className="relative overflow-hidden">
        <div className="text-[11px] text-white/50">depth: .floating</div>
        <div className="mt-1 text-[13px]">Specular edge tracks the hinge angle.</div>
        <div
          className="pointer-events-none absolute inset-y-0 w-16 animate-sheen"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)' }}
        />
      </Card>
      <Card>
        <div className="text-[11px] text-white/50">hinge angle</div>
        <div className="mt-1 font-mono text-[13px]" style={{ color: ACCENT_2 }}>
          {{ closed: '0°', portrait: '180°', landscape: '180°', seated: '115°', standing: '80°' }[pose]}
        </div>
      </Card>
    </div>
  </Screen>
);

const HapticsPreview: Preview = ({ display }) => {
  const [fired, setFired] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const events = ['select', 'toggleOn', 'success', 'hingeDetent'];
  return (
    <Screen title="DuoHaptics">
      <div className="grid grid-cols-2 gap-2">
        {events.map((e) => (
          <button
            key={e}
            onClick={() => {
              setFired(e);
              setTick((t) => t + 1);
              if ('vibrate' in navigator) navigator.vibrate(e === 'hingeDetent' ? 18 : 8);
            }}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] py-3 font-mono text-[11px] text-white/80 active:scale-95"
          >
            .{e}
          </button>
        ))}
      </div>
      <div key={tick} className="mt-4 animate-rise text-center">
        {fired ? (
          <>
            <div
              className="mx-auto mb-2 h-10 w-10 rounded-full"
              style={{ background: GRAD, filter: 'blur(1px)', animation: 'rise .4s ease-out' }}
            />
            <div className="font-mono text-[11px] text-white/60">
              play(.{fired}, on: .{display})
            </div>
          </>
        ) : (
          <div className="text-[11px] text-white/35">Tap an event.</div>
        )}
      </div>
    </Screen>
  );
};

/* ------------------------------------------------------------------ */
/* Controls                                                            */
/* ------------------------------------------------------------------ */

const ButtonPreview: Preview = () => {
  const roles: [string, React.CSSProperties][] = [
    ['Continue', { background: GRAD, color: '#fff' }],
    ['Add to Library', { background: 'rgba(255,255,255,0.10)', color: '#fff' }],
    ['Not now', { background: 'transparent', color: '#a99bff' }],
    ['Delete album', { background: '#9b9ba3', color: '#fff' }],
  ];
  return (
    <Screen title="DuoButton">
      <div className="space-y-2.5">
        {roles.map(([label, style]) => (
          <button
            key={label}
            className="w-full rounded-full border border-white/20 py-3 text-[13px] font-medium transition active:scale-[0.96]"
            style={style}
          >
            {label}
          </button>
        ))}
        <div className="flex items-center gap-2 pt-1">
          {[['S', 8], ['M', 11], ['L', 14]].map(([l, p]) => (
            <button
              key={l as string}
              className="rounded-full border border-white/20 bg-white/10 px-4 text-[12px] active:scale-95"
              style={{ paddingTop: p as number, paddingBottom: p as number }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </Screen>
  );
};

function Slider({ value, onChange, icon }: { value: number; onChange: (v: number) => void; icon?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [over, setOver] = useState(0);

  const set = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const raw = (clientX - r.left) / r.width;
    setOver((raw - Math.min(Math.max(raw, 0), 1)) * 22);
    onChange(Math.min(Math.max(raw, 0), 1));
  };

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        setDragging(true);
        set(e.clientX);
      }}
      onPointerMove={(e) => dragging && set(e.clientX)}
      onPointerUp={() => {
        setDragging(false);
        setOver(0);
      }}
      className="relative w-full cursor-pointer touch-none select-none overflow-hidden rounded-full bg-white/[0.08] transition-all"
      style={{ height: dragging ? 40 : 28 }}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-75"
        style={{ width: `calc(${value * 100}% + ${over}px)`, background: GRAD }}
      />
      {icon && (
        <Glyph
          d={icon}
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/85"
        />
      )}
    </div>
  );
}

const LiquidSliderPreview: Preview = () => {
  const [vol, setVol] = useState(0.62);
  const [exp, setExp] = useState(0.4);
  return (
    <Screen title="LiquidSlider">
      <div className="space-y-6 pt-2">
        <div>
          <div className="mb-2 flex justify-between text-[11px] text-white/50">
            <span>Volume</span>
            <span className="font-mono text-white/80">{Math.round(vol * 100)}</span>
          </div>
          <Slider value={vol} onChange={setVol} icon={ICON.speaker} />
        </div>
        <div>
          <div className="mb-2 flex justify-between text-[11px] text-white/50">
            <span>Exposure</span>
            <span className="font-mono text-white/80">{(exp * 4 - 2).toFixed(1)} EV</span>
          </div>
          <Slider value={exp} onChange={setExp} />
        </div>
        <div className="text-center text-[10px] text-white/30">Drag past the end — it resists.</div>
      </div>
    </Screen>
  );
};

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative h-8 w-[52px] shrink-0 rounded-full transition-colors duration-300"
      style={{ background: on ? GRAD : 'rgba(255,255,255,0.12)' }}
      aria-pressed={on}
    >
      <span
        className="absolute top-[3px] h-[26px] rounded-full bg-white shadow transition-all duration-300"
        style={{ left: on ? 23 : 3, width: 26 }}
      />
    </button>
  );
}

const HapticTogglePreview: Preview = () => {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState(true);
  const rows: [string, string, boolean, () => void][] = [
    ['Spatial audio', 'Head tracking on supported devices', a, () => setA(!a)],
    ['Lossless', 'Up to 24-bit/192 kHz', b, () => setB(!b)],
    ['Crossfade', '6 seconds', c, () => setC(!c)],
  ];
  return (
    <Screen title="HapticToggle">
      <div className="space-y-1">
        {rows.map(([t, s, on, fn]) => (
          <div key={t} className="flex items-center gap-3 rounded-xl px-1 py-3">
            <div className="min-w-0 flex-1">
              <div className="text-[13px]">{t}</div>
              <div className="truncate text-[11px] text-white/45">{s}</div>
            </div>
            <Toggle on={on} onToggle={() => { fn(); if ('vibrate' in navigator) navigator.vibrate(on ? 6 : 12); }} />
          </div>
        ))}
      </div>
    </Screen>
  );
};

const SegmentedPreview: Preview = () => {
  const [sel, setSel] = useState('Week');
  const opts = ['Day', 'Week', 'Month'];
  return (
    <Screen title="SegmentedPill">
      <div className="space-y-4 pt-2">
        <div className="flex rounded-full bg-white/[0.07] p-[3px]">
          {opts.map((o) => (
            <button
              key={o}
              onClick={() => setSel(o)}
              className={`relative flex-1 rounded-full py-2 text-[12px] font-medium transition-colors ${
                sel === o ? 'text-white' : 'text-white/45'
              }`}
            >
              {sel === o && (
                <span className="absolute inset-0 rounded-full border border-white/20 bg-white/[0.14] backdrop-blur-xl" />
              )}
              <span className="relative">{o}</span>
            </button>
          ))}
        </div>
        <Card>
          <div className="text-[11px] text-white/45">Listening time · {sel}</div>
          <div className="mt-2 flex h-20 items-end gap-1">
            {Array.from({ length: opts.indexOf(sel) === 0 ? 8 : opts.indexOf(sel) === 1 ? 7 : 12 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all duration-500"
                style={{ height: `${25 + ((i * 37) % 70)}%`, background: GRAD, opacity: 0.55 + (i % 3) * 0.2 }}
              />
            ))}
          </div>
        </Card>
      </div>
    </Screen>
  );
};

/* ------------------------------------------------------------------ */
/* Feedback                                                            */
/* ------------------------------------------------------------------ */

function Ring({ value, size = 110, width = 10, label }: { value: number | null; size?: number; width?: number; label?: string }) {
  const r = (size - width) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ width: size, height: size }} className="relative shrink-0">
      <svg width={size} height={size} className={value === null ? 'animate-spin' : ''} style={{ animationDuration: '0.9s' }}>
        <defs>
          <linearGradient id={`rg${size}${width}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={ACCENT_2} />
            <stop offset="100%" stopColor={ACCENT} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.09)" strokeWidth={width} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#rg${size}${width})`}
          strokeWidth={width}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - (value ?? 0.22))}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset .5s cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      {label && (
        <div className="absolute inset-0 flex items-center justify-center text-[15px] font-semibold">{label}</div>
      )}
    </div>
  );
}

const ProgressRingPreview: Preview = () => {
  const [v, setV] = useState(0.34);
  useEffect(() => {
    const t = setInterval(() => setV((x) => (x > 0.97 ? 0.08 : x + 0.06)), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <Screen title="ProgressRing">
      <div className="flex h-full flex-col items-center justify-center gap-5">
        <Ring value={v} label={`${Math.round(v * 100)}%`} />
        <div className="flex items-center gap-3 text-[11px] text-white/50">
          <Ring value={null} size={26} width={4} />
          <span>progress: nil — indeterminate</span>
        </div>
      </div>
    </Screen>
  );
};

const ShimmerPreview: Preview = ({ display }) => (
  <Screen title="ShimmerSkeleton">
    <div className="space-y-4">
      {[0, 1].map((block) => (
        <div key={block} className="flex gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/[0.07]">
            <Sweep offset={display === 'outer' ? -0.5 : 0} />
          </div>
          <div className="flex-1 space-y-2 pt-1">
            {[100, 72, 48].map((w, i) => (
              <div key={i} className="relative h-3 overflow-hidden rounded-md bg-white/[0.07]" style={{ width: `${w}%` }}>
                <Sweep offset={display === 'outer' ? -0.5 : 0} delay={i * 0.08} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="pt-1 text-center text-[10px] text-white/30">
        One sweep, phased per display — it crosses the seam as a single light.
      </div>
    </div>
  </Screen>
);

function Sweep({ offset = 0, delay = 0 }: { offset?: number; delay?: number }) {
  return (
    <span
      className="pointer-events-none absolute inset-y-0 w-1/2 animate-sheen"
      style={{
        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)',
        animationDelay: `${offset * 1.3 + delay}s`,
      }}
    />
  );
}

const ToastPreview: Preview = ({ display }) => {
  const [toasts, setToasts] = useState<{ id: number; kind: 'success' | 'error' }[]>([]);
  const post = (kind: 'success' | 'error') => {
    const id = Date.now();
    setToasts((t) => [...t, { id, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
  };
  return (
    <Screen title="ToastCenter">
      <div className="relative h-full">
        <div className="absolute inset-x-0 top-0 z-10 space-y-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="glass flex animate-rise items-center gap-2 rounded-full px-3.5 py-2.5 text-[12px]"
            >
              <Glyph
                d={t.kind === 'success' ? ICON.check : ICON.warn}
                size={14}
                className={t.kind === 'success' ? 'text-[#e4e4e7]' : 'text-[#9b9ba3]'}
              />
              {t.kind === 'success' ? 'Saved to Library' : 'Offline — queued'}
            </div>
          ))}
        </div>
        <div className="flex h-full flex-col justify-end gap-2">
          <div className="mb-2 text-center text-[10px] text-white/30">
            posted on .{display}
          </div>
          <button
            onClick={() => post('success')}
            className="w-full rounded-full py-2.5 text-[12px] font-medium text-white active:scale-95"
            style={{ background: GRAD }}
          >
            post(.success)
          </button>
          <button
            onClick={() => post('error')}
            className="w-full rounded-full border border-white/15 bg-white/[0.07] py-2.5 text-[12px] active:scale-95"
          >
            post(.error)
          </button>
        </div>
      </div>
    </Screen>
  );
};

/* ------------------------------------------------------------------ */
/* Duo layout                                                          */
/* ------------------------------------------------------------------ */

const TRACKS = [
  'Seam Line', 'Hinge Theory', 'Two Panels', 'Cold Aluminium',
  'Unfold', 'Detent', 'Spanned', 'Panel B',
];

function TrackRow({ i, active, compact }: { i: number; active?: boolean; compact?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl px-2 ${compact ? 'py-1.5' : 'py-2'} ${
        active ? 'bg-white/[0.09]' : ''
      }`}
    >
      <Art seed={i + 3} className="h-8 w-8 shrink-0" radius={8} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px]">{TRACKS[i % TRACKS.length]}</div>
        <div className="truncate text-[10px] text-white/40">Duo Sessions</div>
      </div>
      {active && <Glyph d={ICON.play} size={12} className="text-white" />}
    </div>
  );
}

function NowPlaying() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <Art seed={5} className="h-32 w-32 shadow-2xl" radius={18} />
      <div className="text-center">
        <div className="text-[15px] font-semibold">Unfold</div>
        <div className="text-[11px] text-white/45">Duo Sessions</div>
      </div>
      <div className="w-full px-2">
        <div className="h-1 w-full rounded-full bg-white/10">
          <div className="h-1 w-1/3 rounded-full" style={{ background: GRAD }} />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[9px] text-white/35">
          <span>1:12</span>
          <span>3:48</span>
        </div>
      </div>
      <div className="flex items-center gap-6 text-white/80">
        <Glyph d="M11 6 4 12l7 6V6Zm9 0-7 6 7 6V6Z" size={18} />
        <div className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: GRAD }}>
          <Glyph d={ICON.play} size={18} className="text-white" />
        </div>
        <Glyph d="M13 6l7 6-7 6V6ZM4 6l7 6-7 6V6Z" size={18} />
      </div>
    </div>
  );
}

const StagePreview: Preview = ({ pose, display }) => {
  if (isOpen(pose) && display === 'outer') {
    return (
      <Screen title="secondary">
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.16em] text-white/40">injected</div>
          {[
            ['\\.duoPose', `.${pose}`],
            ['\\.duoHinge', `${pose === 'seated' ? '.horizontal' : '.vertical'}`],
            ['\\.duoScreen', '.secondary'],
          ].map(([k, v]) => (
            <Card key={k} className="!py-2">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-white/50">{k}</span>
                <span style={{ color: ACCENT_2 }}>{v}</span>
              </div>
            </Card>
          ))}
          <div className="pt-2 text-[10px] leading-relaxed text-white/35">
            One stage at the root. Everything below reads from the environment — no prop drilling, no singletons.
          </div>
        </div>
      </Screen>
    );
  }
  return (
    <Screen title="DuoStage">
      <div className="flex h-full flex-col">
        <div className="text-[22px] font-semibold leading-tight">Library</div>
        <div className="mt-0.5 text-[11px] text-white/40">Measured · {pose}</div>
        <div className="mt-3 grid flex-1 grid-cols-2 gap-2 content-start">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-1">
              <Art seed={i * 7} className="aspect-square w-full" radius={12} />
              <div className="truncate text-[10px] text-white/55">{TRACKS[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
};


const CompanionPanePreview: Preview = ({ pose, display }) => {
  const [brush, setBrush] = useState(0.5);
  const inspector = (
    <div className="space-y-3">
      <div className="text-[12px] font-semibold">Brush</div>
      <div>
        <div className="mb-1.5 flex justify-between text-[10px] text-white/45">
          <span>Size</span><span className="font-mono">{Math.round(brush * 80)}px</span>
        </div>
        <Slider value={brush} onChange={setBrush} />
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Art key={i} seed={i * 29} className="aspect-square w-full" radius={6} />
        ))}
      </div>
      <div className="space-y-1 pt-1">
        <div className="text-[10px] uppercase tracking-[0.14em] text-white/35">Layers</div>
        {['Sky', 'Subject', 'Grain'].map((l) => (
          <div key={l} className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-2 py-1.5 text-[11px]">
            <Glyph d={ICON.layers} size={12} className="text-white/40" />{l}
          </div>
        ))}
      </div>
    </div>
  );

  const canvas = (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      <Art seed={11} className="absolute inset-0" radius={12} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 30% 30%, transparent, rgba(0,0,0,0.55))' }} />
      <div
        className="absolute rounded-full border-2 border-white/80"
        style={{ width: 20 + brush * 60, height: 20 + brush * 60, left: '38%', top: '42%' }}
      />
    </div>
  );

  // The outer display is what you see with the device closed.
  if (display === 'outer' || !isOpen(pose)) {
    return (
      <Screen title="closed · bottom bar" pad={false}>
        <div className="flex h-full flex-col p-3">
          <div className="min-h-0 flex-1">{canvas}</div>
          <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.07] p-2.5 backdrop-blur-xl">
            <div className="mb-2 flex justify-between text-[10px] text-white/45">
              <span>Size</span><span className="font-mono">{Math.round(brush * 80)}px</span>
            </div>
            <Slider value={brush} onChange={setBrush} />
            <div className="mt-2 flex gap-1.5">
              {[0, 1, 2, 3, 4, 5].map((i) => <Art key={i} seed={i * 29} className="h-6 flex-1" radius={5} />)}
            </div>
          </div>
        </div>
      </Screen>
    );
  }
  const stacked = pose === 'portrait' || pose === 'seated';
  return (
    <Screen title={stacked ? 'companion below' : 'companion beside'} pad={false}>
      <div className={`flex h-full gap-2 p-3 ${stacked ? 'flex-col' : 'flex-row'}`}>
        <div className="min-h-0 min-w-0 flex-1">{canvas}</div>
        <div
          className={`shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 backdrop-blur-xl ${
            stacked ? 'h-[38%] w-full' : 'w-[38%]'
          }`}
        >
          {inspector}
        </div>
      </div>
    </Screen>
  );
};

const SpanningScrollPreview: Preview = ({ pose, display }) => {
  const rows = Array.from({ length: 9 });
  const showSeamNote = isOpen(pose) && display === 'outer';
  return (
    <Screen title={showSeamNote ? 'rows resume, never cut' : 'SpanningScroll'} pad={false}>
      <div className="h-full overflow-hidden px-3 pt-1">
        {rows.map((_, i) => (
          <div key={i} className="border-b border-white/[0.06] last:border-0">
            <TrackRow i={i + (display === 'outer' ? 9 : 0)} />
          </div>
        ))}
      </div>
    </Screen>
  );
};


const DuoPreviewPreview: Preview = ({ pose, display }) => {
  const viewfinder = (subject: boolean) => (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-black">
      <Art seed={23} className="absolute inset-0 opacity-70" radius={12} />
      <div className="absolute inset-0 flex items-center justify-center">
        <Glyph d={ICON.person} size={72} className="text-white/25" />
      </div>
      <div className="absolute inset-3 rounded-lg border border-white/25" />
      {subject ? (
        <div className="absolute inset-x-0 bottom-3 text-center">
          <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] text-white/80">Look here · 3</span>
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-white/80" />
        </div>
      )}
    </div>
  );

  if ((pose === 'seated' || pose === 'landscape') && display === 'outer') {
    return (
      <Screen title="subject view" pad={false}>
        <div className="h-full p-3" style={{ transform: 'scaleX(-1)' }}>
          {viewfinder(true)}
        </div>
      </Screen>
    );
  }
  return (
    <Screen title="operator" pad={false}>
      <div className="relative h-full p-3">
        {viewfinder(false)}
        {pose === 'closed' && (
          <div className="absolute inset-x-3 bottom-5 rounded-lg bg-black/70 px-2 py-1.5 text-center text-[10px] text-white/55">
            Folded — subject can&apos;t see the frame
          </div>
        )}
      </div>
    </Screen>
  );
};

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

const TABS = [
  { t: 'Library', d: ICON.stack },
  { t: 'Radio', d: ICON.radio },
  { t: 'Search', d: ICON.search },
];


const FloatingDockPreview: Preview = () => {
  const [hover, setHover] = useState<number | null>(null);
  const items = [
    { d: ICON.wand, t: 'Enhance' },
    { d: ICON.crop, t: 'Crop' },
    { d: ICON.sliders, t: 'Adjust' },
    { d: ICON.share, t: 'Share' },
  ];
  const scale = (i: number) => {
    if (hover === null) return 1;
    const dist = Math.abs(i - hover);
    return dist === 0 ? 1.32 : dist === 1 ? 1.14 : dist === 2 ? 1.05 : 1;
  };
  return (
    <Screen title="FloatingDock" pad={false}>
      <div className="flex h-full flex-col p-3">
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl">
          <Art seed={31} className="absolute inset-0" radius={12} />
        </div>
        <div className="mt-3 flex items-end justify-center">
          <div className="glass flex items-end gap-2 rounded-full p-2">
            {items.map((it, i) => (
              <button
                key={it.t}
                title={it.t}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.08] text-white/85 transition-transform duration-200"
                style={{ transform: `scale(${scale(i)})`, transformOrigin: 'bottom center' }}
              >
                <Glyph d={it.d} size={18} />
              </button>
            ))}
          </div>
        </div>
        <div className="pt-2 text-center text-[10px] text-white/30">Hover — neighbours grow too.</div>
      </div>
    </Screen>
  );
};

const DuoSheetPreview: Preview = ({ pose, display }) => {
  const [open, setOpen] = useState(true);
  const filters = (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-semibold">Filters</div>
        <button onClick={() => setOpen(false)} className="text-white/40">
          <Glyph d={ICON.close} size={14} />
        </button>
      </div>
      {['Favourites', 'Live Photos', 'Screenshots'].map((f, i) => (
        <div key={f} className="flex items-center justify-between">
          <span className="text-[12px] text-white/75">{f}</span>
          <Toggle on={i !== 1} onToggle={() => {}} />
        </div>
      ))}
      <div className="pt-1">
        <div className="mb-1.5 text-[10px] text-white/45">Date range</div>
        <div className="h-1.5 w-full rounded-full bg-white/10">
          <div className="h-1.5 w-2/3 rounded-full" style={{ background: GRAD }} />
        </div>
      </div>
    </div>
  );

  const grid = (
    <div className="grid grid-cols-3 gap-1.5">
      {Array.from({ length: 12 }).map((_, i) => (
        <Art key={i} seed={i * 17} className="aspect-square w-full" radius={7} />
      ))}
    </div>
  );

  if (isOpen(pose) && display === 'outer') {
    return <Screen title="display, not sheet">{open ? filters : <div className="flex h-full items-center justify-center text-[11px] text-white/30">Dismissed</div>}</Screen>;
  }
  if (!isOpen(pose)) {
    return (
      <Screen title="folded · detent 0.32" pad={false}>
        <div className="relative h-full p-3">
          {grid}
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-white/12 bg-[#14141c]/95 p-4 backdrop-blur-2xl transition-transform duration-500"
            style={{ transform: open ? 'translateY(0)' : 'translateY(88%)' }}
          >
            <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-white/25" onClick={() => setOpen(!open)} />
            {filters}
          </div>
        </div>
      </Screen>
    );
  }
  return (
    <Screen title="content stays visible" pad={false}>
      <div className="h-full p-3">
        {grid}
        <button
          onClick={() => setOpen(true)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] py-2 text-[11px]"
        >
          <Glyph d={ICON.filter} size={12} /> Filters
        </button>
      </div>
    </Screen>
  );
};

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */

const CoverCarouselPreview: Preview = ({ pose }) => {
  const [idx, setIdx] = useState(2);
  const fold = 1 - ({ closed: 0, portrait: 180, landscape: 180, seated: 115, standing: 80 }[pose] / 180);
  const tilt = 26 + fold * 18;
  return (
    <Screen title="CoverCarousel" pad={false}>
      <div className="flex h-full flex-col justify-center">
        <div className="relative h-[180px]" style={{ perspective: 900 }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const d = i - idx;
            return (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="absolute left-1/2 top-1/2 h-[150px] w-[120px] -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={{
                  transform: `translate(-50%,-50%) translateX(${d * 74}px) rotateY(${-d * tilt}deg) scale(${1 - Math.min(Math.abs(d) * 0.12, 0.3)})`,
                  opacity: 1 - Math.min(Math.abs(d) * 0.28, 0.7),
                  zIndex: 10 - Math.abs(d),
                }}
              >
                <Art seed={i * 19 + 4} className="h-full w-full shadow-2xl" radius={12} />
              </button>
            );
          })}
        </div>
        <div className="px-4 text-center">
          <div className="text-[13px] font-semibold">{TRACKS[idx]}</div>
          <div className="text-[10px] text-white/40">tilt {Math.round(tilt)}° · hinge-linked</div>
        </div>
      </div>
    </Screen>
  );
};

const AvatarStackPreview: Preview = () => {
  const people = ['AR', 'JP', 'MK', 'LS', 'TN', 'DV', 'RC'];
  const [speaking, setSpeaking] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setSpeaking((s) => (s + 1) % 4), 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <Screen title="AvatarStack">
      <div className="flex h-full flex-col justify-center gap-6">
        <div className="flex justify-center">
          <div className="flex -space-x-3">
            {people.slice(0, 4).map((p, i) => (
              <div
                key={p}
                className="flex h-11 w-11 items-center justify-center rounded-full text-[12px] font-semibold text-white transition-all duration-300"
                style={{
                  background: `linear-gradient(140deg, hsl(0 0% ${28 + i * 13}%), hsl(0 0% ${14 + i * 11}%))`,
                  border: `2px solid ${speaking === i ? '#e4e4e7' : 'rgba(0,0,0,0.4)'}`,
                  transform: speaking === i ? 'scale(1.12)' : 'scale(1)',
                  zIndex: speaking === i ? 5 : 1,
                }}
              >
                {p}
              </div>
            ))}
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.09] text-[11px] text-white/55">
              +{people.length - 4}
            </div>
          </div>
        </div>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px] font-medium">Design sync</div>
              <div className="text-[10px] text-white/40">{people.length} participants</div>
            </div>
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-[#e4e4e7] transition-all duration-200"
                  style={{ height: 6 + ((speaking + i) % 3) * 6 }}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </Screen>
  );
};

/* ------------------------------------------------------------------ */

export const PREVIEWS: Record<string, Preview> = {
  'duo-pose': PostureReadout,
  'duo-stage': StagePreview,
  'companion-pane': CompanionPanePreview,
  'spanning-scroll': SpanningScrollPreview,
  'duo-preview': DuoPreviewPreview,
  'duo-theme': ThemeSheet,
  'glass-card': GlassCardPreview,
  'duo-haptics': HapticsPreview,
  'duo-button': ButtonPreview,
  'liquid-slider': LiquidSliderPreview,
  'haptic-toggle': HapticTogglePreview,
  'segmented-pill': SegmentedPreview,
  'floating-dock': FloatingDockPreview,
  'duo-sheet': DuoSheetPreview,
  'toast-center': ToastPreview,
  'shimmer-skeleton': ShimmerPreview,
  'progress-ring': ProgressRingPreview,
  'cover-carousel': CoverCarouselPreview,
  'avatar-stack': AvatarStackPreview,
};
