#!/usr/bin/env node
// duocn — pull one component's Swift source into your project.
//   npx duocn add hinge-split [--dest Sources/App/UI] [--registry URL]
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.DUOKIT_REGISTRY ?? 'https://duocn.dev/registry';
const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

const [command, ...names] = argv.filter((a) => !a.startsWith('--') && argv[argv.indexOf(a) - 1]?.startsWith('--') !== true);
const registry = flag('registry', BASE);
const dest = flag('dest', 'Sources/duocn');

const get = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
};

async function add(slug, seen = new Set()) {
  if (seen.has(slug)) return 0;
  seen.add(slug);
  const item = await get(`${registry}/${slug}.json`);
  let written = 0;
  // Dependencies first, so the file you asked for compiles on arrival.
  for (const dep of item.dependsOn ?? []) written += await add(dep, seen);
  fs.mkdirSync(dest, { recursive: true });
  for (const file of item.files) {
    const target = path.join(dest, file.path);
    fs.writeFileSync(target, file.content);
    console.log(`  + ${target}`);
    written++;
  }
  return written;
}

const usage = () => {
  console.log(`duocn — SwiftUI components for iPhone Duo

  npx duocn add <component...>   copy components into your project
  npx duocn list                 show everything available

Options
  --dest <dir>       where to write (default: Sources/duocn)
  --registry <url>   registry base (default: ${BASE})`);
};

try {
  if (command === 'list') {
    const { components } = await get(`${registry}/index.json`);
    const pad = Math.max(...components.map((c) => c.slug.length));
    for (const c of components) {
      console.log(`${c.slug.padEnd(pad)}  ${c.duoOnly ? '[duo] ' : '      '}${c.tagline}`);
    }
  } else if (command === 'add' && names.length) {
    const seen = new Set();
    let total = 0;
    for (const n of names) total += await add(n, seen);
    console.log(`\ndone — ${total} file${total === 1 ? '' : 's'} in ${dest}`);
  } else {
    usage();
    process.exit(command ? 1 : 0);
  }
} catch (err) {
  console.error(`duocn: ${err.message}`);
  process.exit(1);
}
