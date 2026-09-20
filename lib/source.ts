import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(process.cwd(), 'swift', 'DuoCN', 'Sources', 'DuoCN');

/** Read a component's Swift source. The package on disk is the only copy — the
 *  docs never hold a second, drifting version of the code. */
export function readSwift(file: string): string {
  return fs.readFileSync(path.join(ROOT, file), 'utf8').trimEnd();
}

export function lineCount(file: string): number {
  return readSwift(file).split('\n').length;
}
