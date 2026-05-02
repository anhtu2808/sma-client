// Inline HTML diff utility.
//
// Strategy: keep the new version's tag skeleton intact (so the rendered HTML
// is always well-formed and headings/lists/etc. close where they should),
// then run LCS only on the text tokens between tags. Added text gets wrapped
// in <ins class="diff-add">, removed text from the old version gets stitched
// back in as <del class="diff-del"> next to the surrounding kept text.
//
// Tags from the old version are never emitted — only their inner text — so
// the output structure mirrors `newHtml` exactly.

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

const LCS_CELL_CAP = 1_500_000;

const buildLcsTable = (a, b) => {
  const n = a.length;
  const m = b.length;
  const table = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      if (a[i].value === b[j].value) {
        table[i][j] = table[i + 1][j + 1] + 1;
      } else {
        table[i][j] = Math.max(table[i + 1][j], table[i][j + 1]);
      }
    }
  }
  return table;
};

const wrap = (tag, className, tokens) => {
  if (!tokens.length) return '';
  const text = tokens.map((t) => t.value).join('');
  if (!text) return '';
  const hasContent = tokens.some((t) => !t.isWhitespace);
  if (!hasContent) return text;
  return `<${tag} class="${className}">${text}</${tag}>`;
};

// Walk LCS table to produce a merged stream of {type, token} items in order:
//   - 'keep': token present in both (use newText token)
//   - 'ins':  token only in new
//   - 'del':  token only in old
const buildMergedStream = (oldText, newText) => {
  const stream = [];
  if (!oldText.length) {
    newText.forEach((t) => stream.push({ type: 'ins', token: t }));
    return stream;
  }
  if (!newText.length) {
    oldText.forEach((t) => stream.push({ type: 'del', token: t }));
    return stream;
  }
  const table = buildLcsTable(oldText, newText);
  let i = 0;
  let j = 0;
  while (i < oldText.length && j < newText.length) {
    if (oldText[i].value === newText[j].value) {
      stream.push({ type: 'keep', token: newText[j] });
      i += 1;
      j += 1;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      stream.push({ type: 'del', token: oldText[i] });
      i += 1;
    } else {
      stream.push({ type: 'ins', token: newText[j] });
      j += 1;
    }
  }
  while (i < oldText.length) {
    stream.push({ type: 'del', token: oldText[i] });
    i += 1;
  }
  while (j < newText.length) {
    stream.push({ type: 'ins', token: newText[j] });
    j += 1;
  }
  return stream;
};

export const htmlDiff = (oldHtml, newHtml) => {
  const oldTokens = tokenize(oldHtml);
  const newTokens = tokenize(newHtml);

  if (!oldTokens.length) return newHtml || '';
  if (!newTokens.length) {
    const oldText = oldTokens.filter((t) => !t.isTag);
    return wrap('del', 'diff-del', oldText);
  }

  const oldText = oldTokens.filter((t) => !t.isTag);
  const newText = newTokens.filter((t) => !t.isTag);

  if ((oldText.length + 1) * (newText.length + 1) > LCS_CELL_CAP) {
    const banner =
      '<div class="diff-too-large" role="note">' +
      'Document is too large to render a fine-grained diff. Showing the latest version content only.' +
      '</div>';
    return banner + (newHtml || '');
  }

  const stream = buildMergedStream(oldText, newText);

  const out = [];
  let delBuf = [];
  let insBuf = [];

  const flushIns = () => {
    if (insBuf.length) {
      out.push(wrap('ins', 'diff-add', insBuf));
      insBuf = [];
    }
  };
  const flushDel = () => {
    if (delBuf.length) {
      out.push(wrap('del', 'diff-del', delBuf));
      delBuf = [];
    }
  };

  let cursor = 0;
  const drainLeadingDels = () => {
    while (cursor < stream.length && stream[cursor].type === 'del') {
      delBuf.push(stream[cursor].token);
      cursor += 1;
    }
  };

  for (let k = 0; k < newTokens.length; k += 1) {
    const tok = newTokens[k];
    if (tok.isTag) {
      flushIns();
      drainLeadingDels();
      flushDel();
      out.push(tok.value);
      continue;
    }

    drainLeadingDels();
    const item = stream[cursor];
    cursor += 1;

    if (!item) {
      out.push(tok.value);
      continue;
    }

    if (item.type === 'keep') {
      flushIns();
      flushDel();
      out.push(tok.value);
    } else {
      flushDel();
      insBuf.push(tok);
    }
  }

  while (cursor < stream.length) {
    if (stream[cursor].type === 'del') {
      delBuf.push(stream[cursor].token);
    }
    cursor += 1;
  }
  flushIns();
  flushDel();

  return out.join('');
};

export default htmlDiff;

export const __test__ = { tokenize, buildMergedStream };
