import type { Metadata } from 'next';
import Link from 'next/link';
import { MiniStage } from '@/components/ComponentStage';
import { COMPONENTS, byCategory } from '@/content/registry';

export const metadata: Metadata = {
  title: 'Components',
  description: `All ${COMPONENTS.length} duocn components, with a live preview of each.`,
};

export default function Gallery() {
  const groups = byCategory();
  return (
    <main className="mx-auto max-w-[1400px] px-5 py-14">
      <h1 className="text-[2.6rem] font-bold tracking-[-0.03em]">Components</h1>
      <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-fog">
        {COMPONENTS.length} components, {COMPONENTS.filter((c) => c.duoOnly).length} of which do
        something a single-screen phone physically cannot. Every preview below is live — open one to
        switch poses.
      </p>

      {groups.map((g) => (
        <section key={g.category} className="mt-14">
          <div className="flex items-baseline gap-3">
            <h2 className="text-[1.4rem] font-bold tracking-[-0.02em]">{g.category}</h2>
            <span className="font-mono text-[12px] text-fog-2">{g.items.length}</span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {g.items.map((c) => (
              <Link
                key={c.slug}
                href={`/docs/${c.slug}`}
                className="group overflow-hidden rounded-2xl border border-line bg-ink-2 transition hover:border-line-strong"
              >
                <div
                  style={{
                    background:
                      'radial-gradient(70% 60% at 50% 0%, rgba(255,255,255,0.06), transparent 70%)',
                  }}
                >
                  <MiniStage slug={c.slug} />
                </div>
                <div className="border-t border-line p-4">
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
                  <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-fog">
                    {c.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
