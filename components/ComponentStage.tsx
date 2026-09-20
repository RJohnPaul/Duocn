'use client';

import { useState } from 'react';
import type { Pose } from '@/content/registry';
import { FoldDevice } from './FoldDevice';
import { PREVIEWS } from './previews';

/**
 * How each of Apple's five poses maps onto the fold.
 *
 * Note that Portrait and Landscape are both *fully open* — they differ only by
 * orientation, not hinge state. Seated and Standing are partially open, which
 * is the only time a division region is actually active.
 */
export const POSE_STATE: Record<Pose, { openness: number; orientation: 'landscape' | 'portrait'; hint: string }> = {
  closed: { openness: 0, orientation: 'landscape', hint: 'Outer display. Controls move to the side.' },
  portrait: { openness: 1, orientation: 'portrait', hint: 'Fully open, hinge across. One continuous canvas.' },
  landscape: { openness: 1, orientation: 'landscape', hint: 'Fully open, hinge vertical. Split View.' },
  seated: { openness: 0.62, orientation: 'portrait', hint: 'Partially open on a surface. Division region active.' },
  standing: { openness: 0.48, orientation: 'landscape', hint: 'Stood on its edges. StandBy on the outer display.' },
};

export const POSE_LABEL: Record<Pose, string> = {
  closed: 'Closed',
  portrait: 'Portrait',
  landscape: 'Landscape',
  seated: 'Seated',
  standing: 'Standing',
};

export function PoseSwitcher({
  value,
  onChange,
  options,
}: {
  value: Pose;
  onChange: (p: Pose) => void;
  options: Pose[];
}) {
  return (
    <div className="glass inline-flex flex-wrap gap-1 rounded-full p-1" role="radiogroup" aria-label="Device pose">
      {options.map((p) => {
        const active = p === value;
        return (
          <button
            key={p}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(p)}
            title={POSE_STATE[p].hint}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
              active ? 'bg-white/90 text-ink shadow-[0_2px_10px_rgba(0,0,0,0.4)]' : 'text-fog hover:text-white'
            }`}
          >
            {POSE_LABEL[p]}
          </button>
        );
      })}
    </div>
  );
}

export function ComponentStage({
  slug,
  poses,
  initial,
}: {
  slug: string;
  poses: Pose[];
  initial?: Pose;
}) {
  const [pose, setPose] = useState<Pose>(initial ?? poses[0]);
  const Preview = PREVIEWS[slug];
  if (!Preview) return null;

  const { openness, orientation } = POSE_STATE[pose];
  const mm = orientation === 'portrait' ? 2.0 : 2.4;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-2">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, rgba(255,255,255,0.10), transparent 70%), radial-gradient(50% 40% at 80% 100%, rgba(255,255,255,0.05), transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="relative flex min-h-[420px] items-center justify-center px-4 py-10">
        <FoldDevice
          openness={openness}
          orientation={orientation}
          mm={mm}
          inner={<Preview pose={pose} display="inner" />}
          outer={<Preview pose={pose} display="outer" />}
        />
      </div>
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-line bg-ink/60 px-4 py-3 backdrop-blur">
        <PoseSwitcher value={pose} onChange={setPose} options={poses} />
        <span className="text-[12px] text-fog-2">{POSE_STATE[pose].hint}</span>
      </div>
    </div>
  );
}

/** Small, non-interactive device for gallery cards. */
export function MiniStage({ slug, pose = 'closed' }: { slug: string; pose?: Pose }) {
  const Preview = PREVIEWS[slug];
  if (!Preview) return null;
  const { openness, orientation } = POSE_STATE[pose];
  return (
    <div className="pointer-events-none flex h-[210px] items-center justify-center overflow-hidden">
      <FoldDevice
        openness={openness}
        orientation={orientation}
        mm={1.5}
        inner={<Preview pose={pose} display="inner" />}
        outer={<Preview pose={pose} display="outer" />}
      />
    </div>
  );
}

/** The five poses side by side, for the landing page explainer. */
export function PoseRow() {
  const Preview = PREVIEWS['duo-stage'];
  const poses: Pose[] = ['closed', 'portrait', 'landscape', 'seated', 'standing'];
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
      {poses.map((p) => {
        const { openness, orientation, hint } = POSE_STATE[p];
        return (
          <div key={p} className="flex flex-col items-center gap-3">
            <div className="flex h-[150px] items-center justify-center">
              <FoldDevice
                openness={openness}
                orientation={orientation}
                mm={1.05}
                inner={Preview ? <Preview pose={p} display="inner" /> : null}
                outer={Preview ? <Preview pose={p} display="outer" /> : null}
              />
            </div>
            <div className="text-center">
              <div className="text-[13px] font-medium text-white">{POSE_LABEL[p]}</div>
              <div className="mt-0.5 text-[11px] leading-snug text-fog-2">{hint}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
