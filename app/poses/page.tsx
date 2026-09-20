import type { Metadata } from 'next';
import Link from 'next/link';
import { PoseRow } from '@/components/ComponentStage';
import { PoseExplorer } from '@/components/PoseExplorer';

export const metadata: Metadata = {
  title: 'Poses',
  description:
    "Apple names five iPhone Duo poses — Closed, Portrait, Landscape, Seated, Standing. At runtime the system reports three hinge states. Here is how the two vocabularies line up.",
};

const MAPPING = [
  ['Closed', '.closed', 'compact', 'Outer', 'none', 'Controls move to the side of the outer display.'],
  ['Portrait', '.fullyOpen', 'regular', 'Inner', 'none', 'One continuous canvas, hinge running across.'],
  ['Landscape', '.fullyOpen', 'regular', 'Inner', 'none', 'One continuous canvas. Split View multitasking.'],
  ['Seated', '.partiallyOpen', 'regular', 'Inner', 'horizontal', 'Propped on a surface. Controls along the bottom.'],
  ['Standing', '.partiallyOpen', 'regular', 'Outer', 'vertical', 'Stood on its edges. StandBy on the outer display.'],
];

export default function PosesPage() {
  return (
    <main className="mx-auto max-w-[1400px] px-5 py-14">
      <h1 className="text-[2.6rem] font-bold tracking-[-0.03em]">Poses</h1>
      <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-fog">
        Apple names <b className="text-white">five poses</b> for people, and exposes{' '}
        <b className="text-white">three hinge states</b> to code. Conflating the two is the most common
        modelling error on this device — so duocn keeps them apart, and so should you.
      </p>

      <div className="mt-12">
        <PoseRow />
      </div>

      <section className="mt-20">
        <h2 className="text-[1.5rem] font-bold tracking-[-0.02em]">How the two vocabularies line up</h2>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-fog">
          Portrait and Landscape are <b className="text-white">both fully open</b> — they differ by
          orientation, not hinge state. That means a fully open Duo has{' '}
          <b className="text-white">no active division region</b>: the inner display is one continuous
          7.6&Prime; canvas. Only a partially open device divides.
        </p>

        <div className="mt-6 overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-white/[0.04] text-[11px] uppercase tracking-wide text-fog-2">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Pose</th>
                <th className="px-4 py-2.5 font-semibold">DeviceHinge.Status</th>
                <th className="px-4 py-2.5 font-semibold">Width class</th>
                <th className="px-4 py-2.5 font-semibold">Display</th>
                <th className="px-4 py-2.5 font-semibold">Division</th>
                <th className="px-4 py-2.5 font-semibold">What it is for</th>
              </tr>
            </thead>
            <tbody>
              {MAPPING.map(([pose, status, width, display, division, purpose]) => (
                <tr key={pose} className="border-t border-line align-top">
                  <td className="px-4 py-3 font-medium text-white">{pose}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-[#7fd3ff]">{status}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-fog-2">{width}</td>
                  <td className="px-4 py-3 text-fog">{display}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-fog-2">{division}</td>
                  <td className="px-4 py-3 text-fog">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-[1.5rem] font-bold tracking-[-0.02em]">Read the hinge, don&apos;t guess it</h2>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-fog">
          Aspect ratio cannot tell you the pose. The closed outer display is 1398&times;2034 (ratio{' '}
          <span className="font-mono text-white">0.687</span>) and the fully open device in Portrait is
          1878&times;2670 (ratio <span className="font-mono text-white">0.703</span>). Those are 2% apart.
          Any library inferring the pose from window shape alone will report an open device as closed.
        </p>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-fog">
          Use the horizontal size class to tell the displays apart, and{' '}
          <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-[13px]">onHingeChange</code>{' '}
          for the live angle and status.
        </p>
      </section>

      <section className="mt-20">
        <h2 className="text-[1.5rem] font-bold tracking-[-0.02em]">Try it</h2>
        <p className="mt-2 text-[15px] text-fog">
          Every pose, with the environment values duocn publishes for it.
        </p>
        <div className="mt-6">
          <PoseExplorer />
        </div>
      </section>

      <p className="mt-16 text-[13px] text-fog-2">
        Migrating from duocn 0.x? The old four-value <code className="font-mono">DuoPosture</code> enum
        mapped onto neither vocabulary.{' '}
        <Link href="/docs" className="text-white underline underline-offset-4">
          See the migration notes
        </Link>
        .
      </p>
    </main>
  );
}
