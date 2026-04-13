import { Decoration, DecorationSet } from 'prosemirror-view';
import { findTextInDocFuzzy } from '../utils/prosemirrorSearch';

const getHighlightKey = (item) => item?.highlightKey || `id:${item?.detailId}`;

const isValidRange = (range, doc) =>
  !!range &&
  Number.isFinite(range.from) &&
  Number.isFinite(range.to) &&
  range.from < range.to &&
  range.to <= doc.content.size;

const getHighlightClass = (status, isFocused) => {
  const base = 'suggestion-highlight';
  const normalized = (status || '').toLowerCase();

  let statusClass;
  if (normalized === 'missing' || normalized === 'partial') {
    statusClass = `${base}--missing`;
  } else {
    statusClass = `${base}--matched`;
  }

  return isFocused ? `${base} ${statusClass} ${base}--focused` : `${base} ${statusClass}`;
};

const getTagStatusClass = (status) => {
  const normalized = (status || '').toLowerCase();
  return normalized === 'missing' || normalized === 'partial'
    ? 'suggestion-tag--missing'
    : 'suggestion-tag--matched';
};

export const buildHighlightMap = (highlights = []) =>
  new Map(highlights.map((item) => [getHighlightKey(item), item]));

export const mapPinnedRangeMap = (mapping, doc, pinnedRanges = new Map()) => {
  const mappedPinned = new Map();

  for (const [highlightKey, range] of pinnedRanges) {
    const from = mapping.map(range.from, 1);
    const to = mapping.map(range.to, -1);
    const mappedRange = { from, to };

    if (isValidRange(mappedRange, doc)) {
      mappedPinned.set(highlightKey, mappedRange);
    }
  }

  return mappedPinned;
};

export const buildPinnedRangeMap = (
  docOrHighlights,
  maybeHighlights,
  prevPinnedRanges = new Map(),
  prevHighlightsByKey = new Map()
) => {
  // Backward-compatible mode used by older tests: extract explicit pinned ranges only.
  if (Array.isArray(docOrHighlights) && maybeHighlights === undefined) {
    const pinnedRanges = new Map();

    for (const item of docOrHighlights) {
      if (
        item?.pinnedRange &&
        Number.isFinite(item.pinnedRange.from) &&
        Number.isFinite(item.pinnedRange.to)
      ) {
        pinnedRanges.set(getHighlightKey(item), item.pinnedRange);
      }
    }

    return pinnedRanges;
  }

  const doc = docOrHighlights;
  const highlights = maybeHighlights || [];
  const pinnedRanges = new Map();

  for (const item of highlights) {
    const highlightKey = getHighlightKey(item);
    const explicitPinned = item?.pinnedRange;
    const previousPinned = prevPinnedRanges.get(highlightKey);
    const previousHighlight = prevHighlightsByKey.get(highlightKey);

    if (isValidRange(explicitPinned, doc)) {
      pinnedRanges.set(highlightKey, explicitPinned);
      continue;
    }

    if (
      isValidRange(previousPinned, doc) &&
      previousHighlight?.context === item.context
    ) {
      pinnedRanges.set(highlightKey, previousPinned);
      continue;
    }

    if (item?.context && typeof item.context === 'string') {
      const [resolvedRange] = findTextInDocFuzzy(doc, item.context);
      if (isValidRange(resolvedRange, doc)) {
        pinnedRanges.set(highlightKey, resolvedRange);
      }
    }
  }

  return pinnedRanges;
};

export const createTagElement = (item, tagIndex) => {
  const tag = document.createElement('span');
  tag.className = `suggestion-tag ${getTagStatusClass(item.status)}`;
  tag.setAttribute('contenteditable', 'false');
  tag.setAttribute('data-tag', 'true');
  tag.setAttribute('data-detail-id', String(item.detailId));
  tag.setAttribute('data-tag-number', String(tagIndex));

  const badge = document.createElement('span');
  badge.className = 'suggestion-tag__badge';
  badge.textContent = String(tagIndex);
  tag.appendChild(badge);

  return tag;
};

export const buildDecorationSet = (doc, highlights, pinnedRanges) => {
  if (!highlights || highlights.length === 0) {
    return DecorationSet.empty;
  }

  const decorations = [];

  for (const item of highlights) {
    const highlightKey = getHighlightKey(item);
    const pinned = pinnedRanges?.get?.(highlightKey);
    if (!isValidRange(pinned, doc)) {
      continue;
    }

    const { from, to } = pinned;
    const tagIndex = Number.isFinite(item.tagIndex) ? item.tagIndex : null;
    if (tagIndex !== null) {
      decorations.push(
        Decoration.widget(from, () => createTagElement(item, tagIndex), {
          side: -1,
          key: `tag-${highlightKey}-${from}`,
        })
      );
    }
    decorations.push(
      Decoration.inline(from, to, {
        class: getHighlightClass(item.status, item.isFocused),
        'data-detail-id': String(item.detailId),
      })
    );
  }

  return DecorationSet.create(doc, decorations);
};
