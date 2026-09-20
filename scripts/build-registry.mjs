// Emits public/registry/*.json from the same registry the site renders, with
// the Swift read straight off disk. One source of truth, three consumers.
import fs from 'node:fs';
import path from 'node:path';
import { COMPONENTS } from '../content/registry.ts';

const root = process.cwd();
const src = path.join(root, 'swift', 'DuoCN', 'Sources', 'DuoCN');
const out = path.join(root, 'public', 'registry');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const index = [];

for (const c of COMPONENTS) {
  const paths = [c.file, ...(c.alsoFiles ?? [])];
  const files = paths.map((p) => ({
    path: path.basename(p),
    content: fs.readFileSync(path.join(src, p), 'utf8'),
  }));
  const item = {
    slug: c.slug,
    name: c.name,
    category: c.category,
    tagline: c.tagline,
    duoOnly: Boolean(c.duoOnly),
    dependsOn: c.dependsOn ?? [],
    files,
  };
  fs.writeFileSync(path.join(out, `${c.slug}.json`), JSON.stringify(item, null, 2));
  index.push({
    slug: c.slug,
    name: c.name,
    category: c.category,
    tagline: c.tagline,
    duoOnly: Boolean(c.duoOnly),
    dependsOn: item.dependsOn,
  });
}

fs.writeFileSync(
  path.join(out, 'index.json'),
  JSON.stringify({ version: '1.0.0', components: index }, null, 2),
);

console.log(`registry: ${index.length} components -> public/registry`);
