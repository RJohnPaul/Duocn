// Swift highlighter. ~40 lines beats pulling in a 300kb grammar engine for one
// language we control the input of.
const KEYWORDS = new Set([
  'associatedtype', 'async', 'await', 'break', 'case', 'catch', 'class', 'continue', 'default',
  'defer', 'deinit', 'do', 'else', 'enum', 'extension', 'fallthrough', 'false', 'fileprivate',
  'for', 'func', 'guard', 'if', 'import', 'in', 'indirect', 'init', 'inout', 'internal', 'is',
  'let', 'mutating', 'nil', 'nonisolated', 'open', 'operator', 'private', 'protocol', 'public',
  'repeat', 'required', 'return', 'self', 'Self', 'some', 'static', 'struct', 'subscript',
  'super', 'switch', 'throw', 'throws', 'true', 'try', 'typealias', 'var', 'where', 'while',
  'package', 'any', 'consuming', 'borrowing', 'lazy', 'weak', 'unowned', 'convenience', 'final',
  'override', 'set', 'get', 'willSet', 'didSet', 'precedencegroup', 'rethrows',
]);

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const TOKEN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*")|(@[A-Za-z_]\w*)|(\b\d[\d_]*(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/g;

export function highlightSwift(code: string): string {
  const src = escapeHtml(code);
  return src.replace(TOKEN, (match, comment, str, attr, num, word, offset: number) => {
    if (comment) return `<span class="tok-com">${comment}</span>`;
    if (str) return `<span class="tok-str">${str}</span>`;
    if (attr) return `<span class="tok-attr">${attr}</span>`;
    if (num) return `<span class="tok-num">${num}</span>`;
    if (!word) return match;
    if (KEYWORDS.has(word)) return `<span class="tok-key">${word}</span>`;
    if (/^[A-Z]/.test(word)) return `<span class="tok-type">${word}</span>`;
    // A bare identifier immediately followed by "(" is a call site.
    if (src[offset + word.length] === '(') return `<span class="tok-fn">${word}</span>`;
    return word;
  });
}
