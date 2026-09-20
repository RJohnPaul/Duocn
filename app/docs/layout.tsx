import { Sidebar } from '@/components/Sidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[1400px] gap-10 px-5">
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 lg:block">
        <Sidebar />
      </aside>
      <main className="min-w-0 flex-1 py-10">{children}</main>
    </div>
  );
}
