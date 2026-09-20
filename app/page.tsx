import Link from 'next/link';
import { CodeBlock, CopyButton } from '@/components/CodeBlock';
import { FoldHero } from '@/components/FoldHero';
import { MiniStage, PoseRow } from '@/components/ComponentStage';
import { COMPONENTS } from '@/content/registry';
import { highlightSwift } from '@/lib/highlight';

const INSTALL = '.package(url: "https://github.com/duocn/duocn", from: "0.9.0")';
const ADD = 'npx duocn add companion-pane';

const EXAMPLE = `import SwiftUI
import DuoCN

@main
struct StudioApp: App {
    @State private var track: Track?

    var body: some Scene {
        WindowGroup {
            DuoStage {
                ArrangementView {
                    TrackList(selection: $track)
                } secondary: {
                    NowPlaying(track: track)
                }
                .arrangementViewStyle(.split)
            }
            .toastCenter()
        }
    }
}`;

const FEATURES = [
  {
    n: '01',
    k: 'Built on the real APIs',
    v: 'ReservedRegion, DeviceHinge and ArrangementView do the work. duocn adds presets on top — not a parallel framework you have to learn instead.',
  },
  {
    n: '02',
    k: 'Correct about the fold',
    v: 'A fully open Duo is one continuous canvas with no division region. Only a partially open one splits. Most libraries get this backwards.',
  },
  {
    n: '03',
    k: 'The pose harness Xcode lacks',
    v: 'Pin any of Apple’s five poses in a SwiftUI preview or the simulator. No unfolding a physical device to check a layout.',
  },
  {
    n: '04',
    k: 'Copy the file, own the code',
    v: 'Zero dependencies. If this project is abandoned tomorrow, everything you copied still compiles.',
  },
];

const FEATURED = ['duo-stage', 'companion-pane', 'spanning-scroll', 'cover-carousel', 'liquid-slider', 'duo-preview'];

export default function Home() {
  const featured = FEATURED.map((slug) => {
    const found = COMPONENTS.find((c) => c.slug === slug);
    // Fail the build rather than render undefined if a slug goes stale.
    if (!found) throw new Error('FEATURED references unknown component: ' + slug);
    return found;
  });
  const duoOnly = COMPONENTS.filter((c) => c.duoOnly).length;
  const ticker = [...COMPONENTS, ...COMPONENTS];

  return (
    <main className="relative">
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-line">
        {/* dot grid, faded out toward the edges */}
        <div
          aria-hidden
          className="dotfield pointer-events-none absolute inset-0"
          style={{
            maskImage: 'radial-gradient(70% 55% at 50% 30%, #000 0%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(70% 55% at 50% 30%, #000 0%, transparent 100%)',
          }}
        />
        {/* single overhead spotlight — the only "lighting" in the system */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-220px] h-[520px] w-[900px] -translate-x-1/2"
          style={{
            background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.10), transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        <div className="relative mx-auto max-w-[1100px] px-5 pb-16 pt-20 text-center lg:pt-28">
          <div className="animate-rise">
            <Link
              href="/poses"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-[12px] text-fog transition hover:border-line-strong hover:text-white"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              0.9.0 beta · tracking iOS 27.1
              <span aria-hidden className="text-fog-2">→</span>
            </Link>

            <h1 className="grad-text mx-auto mt-7 max-w-5xl text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.04em]">
              SwiftUI components
              <br />
              that know the phone folds.
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-[17px] leading-relaxed text-fog">
              Development for iPhone Duo. {COMPONENTS.length} components built on{' '}
              <span className="text-white">ReservedRegion</span>,{' '}
              <span className="text-white">DeviceHinge</span> and{' '}
              <span className="text-white">ArrangementView</span> — plus the pose harness Xcode
              doesn’t give you.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/docs"
                className="rounded-full bg-chalk px-5 py-3 text-[14px] font-semibold text-ink transition hover:bg-white"
              >
                Get started
              </Link>
              <Link
                href="/components"
                className="rounded-full border border-line-strong px-5 py-3 text-[14px] font-medium text-white transition hover:bg-white/[0.06]"
              >
                Browse {COMPONENTS.length} components
              </Link>
            </div>

            <div className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-xl border border-line bg-ink-2 px-3 py-2.5 font-mono text-[12.5px]">
              <span className="text-fog-2">$</span>
              <span className="flex-1 truncate text-left text-fog">{ADD}</span>
              <CopyButton text={ADD} />
            </div>
          </div>

          {/* the device */}
          <div className="mt-14 animate-rise">
            <FoldHero />
          </div>
        </div>

        {/* component ticker */}
        <div className="relative overflow-hidden border-t border-line py-3">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                'linear-gradient(90deg, var(--color-ink) 0%, transparent 12%, transparent 88%, var(--color-ink) 100%)',
            }}
          />
          <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
            {ticker.map((c, i) => (
              <span key={c.slug + i} className="font-mono text-[12px] text-fog-2">
                {c.name}
                <span className="pl-8 text-line-strong">/</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Stats                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1100px] grid-cols-2 divide-x divide-line md:grid-cols-4">
          {[
            [String(COMPONENTS.length), 'components'],
            [String(duoOnly), 'need the fold'],
            ['0', 'dependencies'],
            ['MIT', 'licensed'],
          ].map(([v, k]) => (
            <div key={k} className="px-5 py-7 text-center">
              <div className="text-[26px] font-semibold tracking-tight text-white">{v}</div>
              <div className="mt-1 text-[12px] uppercase tracking-[0.14em] text-fog-2">{k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Features                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-[1100px] px-5 py-20">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.k} className="bg-ink p-7 transition hover:bg-ink-2">
              <div className="font-mono text-[11px] text-fog-2">{f.n}</div>
              <div className="mt-3 text-[16px] font-semibold tracking-tight">{f.k}</div>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-fog">{f.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Poses                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-line bg-ink-2/40 py-20">
        <div className="mx-auto max-w-[1300px] px-5">
          <div className="max-w-2xl">
            <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-fog-2">The model</div>
            <h2 className="mt-3 text-[clamp(1.9rem,3.6vw,2.7rem)] font-bold tracking-[-0.03em]">
              Five poses. Three hinge states.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-fog">
              Apple names five poses for people, and exposes three hinge states to code. duocn keeps
              the two vocabularies straight: poses for previews and docs, size classes and hinge
              status for layout.
            </p>
          </div>
          <div className="mt-12">
            <PoseRow />
          </div>
          <Link
            href="/poses"
            className="mt-10 inline-block text-[14px] text-fog transition hover:text-white"
          >
            How the two vocabularies line up →
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Code                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-[1100px] px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
            <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-fog-2">
              The whole setup
            </div>
            <h2 className="mt-3 text-[clamp(1.9rem,3.6vw,2.7rem)] font-bold tracking-[-0.03em]">
              One stage. Then write your app.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-fog">
              Lay out with size classes — that’s Apple’s guidance and it covers most cases.{' '}
              <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-[13px]">DuoStage</code>{' '}
              is the harness for what they don’t cover: resolving the pose, publishing fold geometry,
              and pinning a pose in a preview.
            </p>
            <div className="mt-6 space-y-2">
              <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-fog-2">
                Swift Package Manager
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-line bg-ink-2 px-3 py-2.5 font-mono text-[12px]">
                <span className="min-w-0 flex-1 truncate text-fog">{INSTALL}</span>
                <CopyButton text={INSTALL} />
              </div>
            </div>
          </div>
          <CodeBlock code={EXAMPLE} html={highlightSwift(EXAMPLE)} filename="StudioApp.swift" />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Featured components                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-line py-20">
        <div className="mx-auto max-w-[1300px] px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-fog-2">
                Components
              </div>
              <h2 className="mt-3 text-[clamp(1.9rem,3.6vw,2.7rem)] font-bold tracking-[-0.03em]">
                Things a single screen can’t do.
              </h2>
            </div>
            <Link href="/components" className="text-[14px] text-fog transition hover:text-white">
              All {COMPONENTS.length} →
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <Link
                key={c.slug}
                href={`/docs/${c.slug}`}
                className="group overflow-hidden rounded-2xl border border-line bg-ink-2 transition hover:border-line-strong"
              >
                <div className="border-b border-line bg-ink">
                  <MiniStage slug={c.slug} pose={c.poses.includes('landscape') ? 'landscape' : 'closed'} />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold">{c.name}</span>
                    {c.duoOnly && (
                      <span className="rounded border border-line-strong px-1.5 py-px font-mono text-[9px] text-fog">
                        FOLD
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-fog">{c.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-[1100px] px-5 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-line px-8 py-16 text-center">
          <div
            aria-hidden
            className="dotfield pointer-events-none absolute inset-0"
            style={{
              maskImage: 'radial-gradient(60% 70% at 50% 0%, #000, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(60% 70% at 50% 0%, #000, transparent 100%)',
            }}
          />
          <div className="relative">
            <h2 className="text-[clamp(1.9rem,4vw,2.9rem)] font-bold tracking-[-0.03em]">
              Your app already runs on a Duo.
              <br />
              <span className="grad-text">Make it feel like it was made for one.</span>
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/docs"
                className="rounded-full bg-chalk px-5 py-3 text-[14px] font-semibold text-ink transition hover:bg-white"
              >
                Get started
              </Link>
              <Link
                href="/poses"
                className="rounded-full border border-line-strong px-5 py-3 text-[14px] font-medium transition hover:bg-white/[0.06]"
              >
                Read the pose model
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
