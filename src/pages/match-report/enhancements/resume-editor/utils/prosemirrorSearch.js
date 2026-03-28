/**
 * Search for text in a ProseMirror document, handling text that spans
 * across multiple inline nodes (bold, italic, links, etc.).
 *
 * Returns array of { from, to } absolute positions in the doc.
 */
export const findTextInDoc = (doc, searchText) => {
  if (!doc || !searchText || typeof searchText !== 'string') return [];

  const normalizedSearch = searchText.trim().toLowerCase();
  if (normalizedSearch.length === 0) return [];

  // Build a flat text string with position mapping.
  // We concatenate text content of all text nodes, inserting a space
  // at block boundaries so "end of paragraph" + "start of next" don't merge.
  const chunks = []; // { text, pos } — pos = absolute position in doc
  let flatText = '';

  doc.descendants((node, pos) => {
    if (node.isBlock && flatText.length > 0 && !flatText.endsWith(' ')) {
      // Insert separator at block boundaries
      flatText += ' ';
      chunks.push({ text: ' ', pos: -1 }); // -1 = synthetic separator
    }
    if (node.isText) {
      chunks.push({ text: node.text, pos });
      flatText += node.text;
    }
    return true; // keep descending
  });

  if (flatText.length === 0) return [];

  // Case-insensitive search on the flat text
  const normalizedFlat = flatText.toLowerCase();
  const results = [];
  let searchFrom = 0;

  while (searchFrom <= normalizedFlat.length - normalizedSearch.length) {
    const idx = normalizedFlat.indexOf(normalizedSearch, searchFrom);
    if (idx === -1) break;

    const startOffset = idx;
    const endOffset = idx + normalizedSearch.length;

    // Map flat-text offsets back to ProseMirror positions
    const from = flatOffsetToDocPos(chunks, startOffset);
    const to = flatOffsetToDocPos(chunks, endOffset);

    if (from !== null && to !== null && from < to) {
      results.push({ from, to });
    }

    searchFrom = idx + 1;
  }

  return results;
};

/**
 * Convert a flat-text character offset to an absolute ProseMirror doc position.
 */
const flatOffsetToDocPos = (chunks, offset) => {
  let cursor = 0;

  for (const chunk of chunks) {
    const chunkLen = chunk.text.length;

    if (offset <= cursor + chunkLen) {
      if (chunk.pos === -1) {
        // Synthetic separator — advance cursor and continue to next real chunk
        cursor += chunkLen;
        continue;
      }
      return chunk.pos + (offset - cursor);
    }

    cursor += chunkLen;
  }

  // If we ran past, try the end of the last real chunk
  for (let i = chunks.length - 1; i >= 0; i--) {
    if (chunks[i].pos !== -1) {
      return chunks[i].pos + chunks[i].text.length;
    }
  }

  return null;
};
