/**
 * Search for text in a ProseMirror document, handling text that spans
 * across multiple inline nodes (bold, italic, links, etc.).
 *
 * Returns array of { from, to } absolute positions in the doc.
 */
export const findTextInDoc = (doc, searchText) => {
  if (!doc || !searchText || typeof searchText !== 'string') return [];

  // Strip HTML tags if context contains them
  if (/<[^>]+>/.test(searchText)) {
    const div = document.createElement('div');
    div.innerHTML = searchText;
    searchText = div.textContent || div.innerText || '';
  }

  const normalizedSearch = searchText.trim().toLowerCase().replace(/\s+/g, ' ');
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

  const normalizedFlat = flatText.toLowerCase();

  // Build a whitespace-tolerant regex from the search text.
  // Each whitespace in the search becomes \s+ in the regex, allowing it to match
  // any whitespace sequence (spaces, double spaces, newlines) in the flat text.
  const escapedParts = normalizedSearch.split(' ').map(escapeRegex);
  const regexPattern = escapedParts.join('\\s+');
  let regex;
  try {
    regex = new RegExp(regexPattern, 'g');
  } catch {
    // Fallback to indexOf if regex fails
    return findTextByIndexOf(normalizedFlat, normalizedSearch, chunks);
  }

  const results = [];
  let match;
  while ((match = regex.exec(normalizedFlat)) !== null) {
    const startOffset = match.index;
    const endOffset = match.index + match[0].length;

    const from = flatOffsetToDocPos(chunks, startOffset);
    const to = flatOffsetToDocPos(chunks, endOffset);

    if (from !== null && to !== null && from < to) {
      results.push({ from, to });
    }

    // Advance past current match to avoid infinite loop
    regex.lastIndex = match.index + 1;
  }

  // Fallback: if regex found nothing, try plain indexOf
  if (results.length === 0) {
    return findTextByIndexOf(normalizedFlat, normalizedSearch, chunks);
  }

  return results;
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const findTextByIndexOf = (normalizedFlat, normalizedSearch, chunks) => {
  const results = [];
  let searchFrom = 0;
  while (searchFrom <= normalizedFlat.length - normalizedSearch.length) {
    const idx = normalizedFlat.indexOf(normalizedSearch, searchFrom);
    if (idx === -1) break;
    const from = flatOffsetToDocPos(chunks, idx);
    const to = flatOffsetToDocPos(chunks, idx + normalizedSearch.length);
    if (from !== null && to !== null && from < to) {
      results.push({ from, to });
    }
    searchFrom = idx + 1;
  }
  return results;
};

/**
 * Fuzzy search for text in a ProseMirror document.
 * Falls back to normalized whitespace matching, then first-N-words matching.
 *
 * Returns array of { from, to } absolute positions in the doc.
 */
export const findTextInDocFuzzy = (doc, searchText) => {
  if (!doc || !searchText) return [];

  // 1. Try exact match first
  const exactResults = findTextInDoc(doc, searchText);
  if (exactResults.length > 0) return exactResults;

  // 2. Try with normalized whitespace (collapse all whitespace to single space)
  const normalizedSearch = normalizeWhitespace(searchText);
  if (normalizedSearch !== searchText) {
    const normalizedResults = findTextInDoc(doc, normalizedSearch);
    if (normalizedResults.length > 0) return normalizedResults;
  }

  // 3. Try progressively shorter SUBSTRINGS from the start of the text.
  //    This preserves punctuation (colons, commas, periods) unlike word-based matching.
  if (normalizedSearch.length >= 25) {
    const maxLen = Math.min(normalizedSearch.length, 100);
    for (let len = maxLen; len >= 25; len -= 10) {
      const partial = normalizedSearch.substring(0, len);
      const partialResults = findTextInDoc(doc, partial);
      if (partialResults.length > 0) return partialResults;
    }
  }

  // 4. Try each LINE separately (split on newlines)
  const lines = normalizedSearch.split(/[\n\r]+/).map((l) => l.trim()).filter((l) => l.length >= 15);
  for (const line of lines) {
    const lineResults = findTextInDoc(doc, line);
    if (lineResults.length > 0) return lineResults;
  }

  // 5. Strip leading date patterns (e.g., "Aug 2022 - Present") and retry
  const dateStripped = normalizedSearch.replace(
    /^(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4}\s*[-–—]+\s*(?:\w+\s+\d{4}|present)\s*/i,
    ''
  ).trim();
  if (dateStripped.length >= 20 && dateStripped !== normalizedSearch) {
    const dateStrippedResults = findTextInDoc(doc, dateStripped);
    if (dateStrippedResults.length > 0) return dateStrippedResults;
    const firstLine = dateStripped.split(/[\n\r]+/)[0]?.trim();
    if (firstLine && firstLine.length >= 15) {
      const firstLineResults = findTextInDoc(doc, firstLine);
      if (firstLineResults.length > 0) return firstLineResults;
    }
  }

  // 6. If context starts with "Skills: ", try the content after prefix
  if (normalizedSearch.toLowerCase().startsWith('skills:')) {
    const skillContent = normalizedSearch.substring(7).trim();
    if (skillContent.length >= 10) {
      const skillResults = findTextInDoc(doc, skillContent);
      if (skillResults.length > 0) return skillResults;
    }
  }

  // 7. Try each sentence separately (split on periods)
  const sentences = normalizedSearch.split(/\.\s+/).filter((s) => s.length >= 20);
  for (const sentence of sentences) {
    const sentenceResults = findTextInDoc(doc, sentence);
    if (sentenceResults.length > 0) return sentenceResults;
    if (sentence.length >= 30) {
      const partial = sentence.substring(0, Math.min(sentence.length, 60));
      const partialResults = findTextInDoc(doc, partial);
      if (partialResults.length > 0) return partialResults;
    }
  }

  return [];
};

const normalizeWhitespace = (text) => {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
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
