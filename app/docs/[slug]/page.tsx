import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CodeBlock, CopyButton } from '@/components/CodeBlock';
import { ComponentStage } from '@/components/ComponentStage';
import { COMPONENTS, bySlug } from '@/content/registry';
import { highlightSwift } from '@/lib/highlight';
import { readSwift } from '@/lib/source';

export function generateStaticParams() {
  return COMPONENTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const c = bySlug((await params).slug);
  return c ? { title: c.name, description: c.tagline } : {};
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = bySlug(slug);
  if (!c) notFound();

  const source = readSwift(c.file);
  const index = COMPONENTS.findIndex((x) => x.slug === slug);
  const prev = COMPONENTS[index - 1];
  const next = COMPONENTS[index + 1];
  const addCommand = `npx duocn add ${c.slug}`;

  return (
    <article className="max-w-3xl">
      <div className="flex items-center gap-2 text-[12px] text-fog-2">
        <Link href="/docs" className="hover:text-white">Docs</Link>
        <span>/</span>
        <span>{c.category}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-[2.4rem] font-bold tracking-[-0.03em]">{c.name}</h1>
        {c.duoOnly && (
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white/90"
            style={{ background: 'rgba(255,255,255,0.10)' }}
          >
            NEEDS THE FOLD
          </span>
        )}
      </div>
      <p className="mt-2 text-[17px] text-fog">{c.tagline}</p>
      <p className="mt-4 text-[15px] leading-relaxed text-fog">{c.description}</p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-line bg-ink-2 px-3 py-2 font-mono text-[12px]">
          <span className="text-fog-2">$</span>
          <span className="text-fog">{addCommand}</span>
          <CopyButton text={addCommand} />
        </div>
        {c.dependsOn?.map((d) => (
          <Link
            key={d}
            href={`/docs/${d}`}
            className="rounded-lg border border-line px-2.5 py-2 text-[12px] text-fog-2 transition hover:text-white"
          >
            requires {bySlug(d)?.name ?? d}
          </Link>
        ))}
      </div>

      <h2 className="mb-3 mt-12 text-[13px] font-semibold uppercase tracking-[0.14em] text-fog-2">
        Preview
      </h2>
      <ComponentStage
        slug={c.slug}
        poses={c.poses}
        initial={c.poses.includes('landscape') ? 'landscape' : c.poses[0]}
      />

      <h2 className="mb-3 mt-12 text-[13px] font-semibold uppercase tracking-[0.14em] text-fog-2">
        Usage
      </h2>
      <CodeBlock code={c.usage} html={highlightSwift(c.usage)} />

      <h2 className="mb-3 mt-12 text-[13px] font-semibold uppercase tracking-[0.14em] text-fog-2">
        API
      </h2>
      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-white/[0.04] text-[11px] uppercase tracking-wide text-fog-2">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Name</th>
              <th className="px-4 py-2.5 font-semibold">Type</th>
              <th className="px-4 py-2.5 font-semibold">Default</th>
            </tr>
          </thead>
          <tbody>
            {c.api.map((row) => (
              <tr key={row.name} className="border-t border-line align-top">
                <td className="px-4 py-3 font-mono text-[12px] text-white">{row.name}</td>
                <td className="px-4 py-3 font-mono text-[12px] text-[#7fd3ff]">{row.type}</td>
                <td className="px-4 py-3 font-mono text-[12px] text-fog-2">{row.default ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dl className="mt-4 space-y-2 text-[13px]">
        {c.api.map((row) => (
          <div key={row.name} className="flex gap-3">
            <dt className="w-44 shrink-0 font-mono text-[12px] text-fog-2">{row.name}</dt>
            <dd className="text-fog">{row.description}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mb-3 mt-12 text-[13px] font-semibold uppercase tracking-[0.14em] text-fog-2">
        Source
      </h2>
      <CodeBlock
        code={source}
        html={highlightSwift(source)}
        filename={`Sources/duocn/${c.file}`}
        collapsible
      />

      <nav className="mt-14 flex justify-between gap-4 border-t border-line pt-6 text-[13px]">
        {prev ? (
          <Link href={`/docs/${prev.slug}`} className="text-fog transition hover:text-white">
            ← {prev.name}
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/docs/${next.slug}`} className="text-fog transition hover:text-white">
            {next.name} →
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
