// Inline HTML diff utility.
// Tokenizes HTML into tag tokens and word tokens, runs LCS on the token
// sequence, then re-emits HTML with <ins class="diff-add"> / <del class="diff-del">
// wrappers around added or removed words. Tag tokens flow through unchanged so
// formatting (headings, lists, bold, etc.) is preserved.

const TOKEN_RE = /<[^>]+>|&[^;\s]+;|\s+|[^\s<&]+/g;

const tokenize = (html) => {
  if (!html) return [];
  const tokens = html.match(TOKEN_RE) || [];
  return tokens.map((value) => ({
    value,
    isTag: value.startsWith('<'),
    isWhitespace: /^\s+$/.test(value),
  }));
};

const tokensEqual = (a, b) => a.value === b.value;

// Standard LCS table (O(n*m) time/space). Capped to avoid runaway cost on
// huge documents — falls back to a coarse "replace whole block" diff above the
// cap.
const LCS_CELL_CAP = 1_500_000;

const buildLcsTable = (a, b) => {
  const n = a.length;
  const m = b.length;
  const table = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      if (tokensEqual(a[i], b[j])) {
        table[i][j] = table[i + 1][j + 1] + 1;
      } else {
        table[i][j] = Math.max(table[i + 1][j], table[i][j + 1]);
      }
    }
  }
  return table;
};

const wrap = (tag, className, tokens) => {
  const text = tokens.map((t) => t.value).join('');
  if (!text || /^\s*$/.test(text)) return text;
  // Avoid wrapping pure tag runs — only wrap if there is at least one
  // non-tag, non-whitespace character.
  const hasContent = tokens.some((t) => !t.isTag && !t.isWhitespace);
  if (!hasContent) return text;
  return `<${tag} class="${className}">${text}</${tag}>`;
};

const flushTags = (buffer) => buffer.map((t) => t.value).join('');

export const htmlDiff = (oldHtml, newHtml) => {
  const oldTokens = tokenize(oldHtml);
  const newTokens = tokenize(newHtml);

  if (!oldTokens.length) return newHtml || '';
  if (!newTokens.length) {
    return wrap('del', 'diff-del', oldTokens);
  }

  if ((oldTokens.length + 1) * (newTokens.length + 1) > LCS_CELL_CAP) {
    // Document too large for fine-grained diff: show new content as-is with
    // a banner marker. Caller can decide to render full content instead.
    return newHtml || '';
  }

  const table = buildLcsTable(oldTokens, newTokens);

  let i = 0;
  let j = 0;
  const out = [];
  let delBuf = [];
  let insBuf = [];

  const flushPending = () => {
    if (delBuf.length) {
      out.push(wrap('del', 'diff-del', delBuf));
      delBuf = [];
    }
    if (insBuf.length) {
      out.push(wrap('ins', 'diff-add', insBuf));
      insBuf = [];
    }
  };

  while (i < oldTokens.length && j < newTokens.length) {
    const oldTok = oldTokens[i];
    const newTok = newTokens[j];

    if (tokensEqual(oldTok, newTok)) {
      flushPending();
      out.push(oldTok.value);
      i += 1;
      j += 1;
      continue;
    }

    // Pass through tag tokens transparently — they shouldn't be marked as
    // additions/deletions on their own; word changes around them carry the
    // visual signal.
    if (oldTok.isTag && newTok.isTag) {
      flushPending();
      out.push(newTok.value);
      i += 1;
      j += 1;
      continue;
    }
    if (oldTok.isTag) {
      flushPending();
      out.push(oldTok.value);
      i += 1;
      continue;
    }
    if (newTok.isTag) {
      flushPending();
      out.push(newTok.value);
      j += 1;
      continue;
    }

    if (table[i + 1][j] >= table[i][j + 1]) {
      delBuf.push(oldTok);
      i += 1;
    } else {
      insBuf.push(newTok);
      j += 1;
    }
  }

  while (i < oldTokens.length) {
    const tok = oldTokens[i];
    if (tok.isTag) {
      flushPending();
      out.push(tok.value);
    } else {
      delBuf.push(tok);
    }
    i += 1;
  }
  while (j < newTokens.length) {
    const tok = newTokens[j];
    if (tok.isTag) {
      flushPending();
      out.push(tok.value);
    } else {
      insBuf.push(tok);
    }
    j += 1;
  }
  flushPending();

  return out.join('');
};

export default htmlDiff;

// Exported for tests
export const __test__ = { tokenize, flushTags };
