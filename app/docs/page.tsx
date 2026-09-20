import Link from 'next/link';
import { CodeBlock, CopyButton } from '@/components/CodeBlock';
import { COMPONENTS, byCategory } from '@/content/registry';
import { highlightSwift } from '@/lib/highlight';

const SPM = `// Package.swift
dependencies: [
    .package(url: "https://github.com/duocn/duocn", from: "1.0.0")
],
targets: [
    .target(name: "App", dependencies: ["duocn"])
]`;

const FIRST = `import SwiftUI
import duocn

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            DuoStage {          // 1. one stage at the root
                RootView()
            }
            .toastCenter()      // 2. optional, install once
        }
    }
}

struct RootView: View {
    var body: some View {
        // Size classes first. This is Apple's guidance and it covers most cases.
        ArrangementView {
            Sidebar()
        } secondary: {
            Detail()
        }
        .arrangementViewStyle(.split)
    }
}`;

const OWN = `struct BoardView: View {
    var body: some View {
        GeometryReader { proxy in
            // The real API: ask the system where the fold is, rather than
            // guessing from the window's aspect ratio.
            let divisions = proxy.reservedRegions(kind: .division)
                .filter(\\.isActive)

            ZStack {
                board

                // Keep interactive elements clear of the fold. Scrollable
                // content is allowed to cross it — only hit targets are not.
                ForEach(divisions, id: \\.id) { region in
                    Color.clear
                        .frame(width: region.frame.width, height: region.frame.height)
                        .position(x: region.frame.midX, y: region.frame.midY)
                        .allowsHitTesting(false)
                }
            }
        }
    }
}`;

export default function DocsIndex() {
  const groups = byCategory();
  return (
    <article className="max-w-3xl">
      <h1 className="text-[2.4rem] font-bold tracking-[-0.03em]">Introduction</h1>
      <p className="mt-3 text-[17px] leading-relaxed text-fog">
        duocn is {COMPONENTS.length} SwiftUI components for the iPhone Duo. It exists because the
        interesting problems on a folding phone are not new buttons — they are the seam, the second
        panel, the reserved regions the hardware carves out, and the five poses Apple names.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          ['iOS 27.1 beta', 'Needs the iOS 27.1 SDK'],
          ['0 dependencies', 'Nothing but SwiftUI'],
          ['MIT', 'Copy files or use the package'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-line bg-ink-2 p-4">
            <div className="text-[15px] font-semibold">{k}</div>
            <div className="mt-1 text-[12px] text-fog">{v}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-[1.5rem] font-bold tracking-[-0.02em]">Install</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-fog">
        Take the whole package, or pull a single component into your own sources and own it outright.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-fog-2">
            Swift Package Manager
          </div>
          <CodeBlock code={SPM} html={highlightSwift(SPM)} filename="Package.swift" />
        </div>
        <div>
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-fog-2">
            Or one file at a time
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-line bg-ink-2 px-3 py-2.5 font-mono text-[12.5px]">
            <span className="text-fog-2">$</span>
            <span className="flex-1 truncate text-fog">npx duocn add companion-pane --dest Sources/App/UI</span>
            <CopyButton text="npx duocn add companion-pane --dest Sources/App/UI" />
          </div>
          <p className="mt-2 text-[13px] text-fog-2">
            Writes the Swift file and anything it depends on. No lockfile, no runtime, nothing to
            update — it is your code from that point.
          </p>
        </div>
      </div>

      <h2 className="mt-14 text-[1.5rem] font-bold tracking-[-0.02em]">Your first Duo screen</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-fog">
        Three steps, and only the first is mandatory.
      </p>
      <div className="mt-5">
        <CodeBlock code={FIRST} html={highlightSwift(FIRST)} filename="MyApp.swift" />
      </div>

      <h2 className="mt-14 text-[1.5rem] font-bold tracking-[-0.02em]">Using it in your own views</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-fog">
        The environment values are public. Your components can be pose-aware without importing
        anything else from the kit — though size classes should be your first tool.
      </p>
      <div className="mt-5">
        <CodeBlock code={OWN} html={highlightSwift(OWN)} filename="BoardView.swift" />
      </div>

      <div className="mt-8 rounded-xl border border-line bg-ink-2 p-5">
        <div className="text-[14px] font-semibold">Three rules the kit follows</div>
        <ol className="mt-3 space-y-2 text-[13.5px] leading-relaxed text-fog">
          <li><b className="text-white">1.</b> Scrollable content may cross the fold. Interactive elements may not.</li>
          <li><b className="text-white">2.</b> A fully open Duo is one continuous canvas. Only a partially open one divides.</li>
          <li><b className="text-white">3.</b> Every open layout has a defined closed fallback. No pose is a dead end.</li>
        </ol>
      </div>

      <h2 className="mt-14 text-[1.5rem] font-bold tracking-[-0.02em]">Everything in the kit</h2>
      <div className="mt-5 space-y-7">
        {groups.map((g) => (
          <div key={g.category}>
            <div className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-fog-2">
              {g.category}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {g.items.map((c) => (
                <Link
                  key={c.slug}
                  href={`/docs/${c.slug}`}
                  className="rounded-xl border border-line bg-ink-2 p-3.5 transition hover:border-line-strong"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold">{c.name}</span>
                    {c.duoOnly && (
                      <span
                                                style={{ background: 'rgba(255,255,255,0.10)' }}
                      >
                        FOLD
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-fog">{c.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
