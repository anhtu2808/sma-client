import { Decoration, DecorationSet } from 'prosemirror-view';
import { findTextInDocFuzzy } from '../utils/prosemirrorSearch';

const getHighlightKey = (item) => item?.highlightKey || `id:${item?.detailId}`;

const isValidRange = (range, doc) =>
  !!range &&
  Number.isFinite(range.from) &&
  Number.isFinite(range.to) &&
  range.from < range.to &&
  range.to <= doc.content.size;

const isNegativeStatus = (status) => {
  const n = (status || '').toLowerCase();
  return n === 'missing' || n === 'partial';
};

const getGroupHighlightClass = (group, focusedItem) => {
  const base = 'suggestion-highlight';
  const hasNeg = group.some((h) => isNegativeStatus(h.status));
  const hasPos = group.some((h) => !isNegativeStatus(h.status));

  const classes = [base];
  if (hasPos) classes.push(`${base}--matched`);
  if (hasNeg) classes.push(`${base}--missing`);
  if (hasPos && hasNeg) classes.push(`${base}--mixed`);
  if (focusedItem) {
    classes.push(`${base}--focused`);
    classes.push(
      isNegativeStatus(focusedItem.status)
        ? `${base}--focus-missing`
        : `${base}--focus-matched`
    );
  }
  return classes.join(' ');
};

const getBadgeStatusClass = (status) =>
  isNegativeStatus(status) ? 'suggestion-tag__badge--missing' : 'suggestion-tag__badge--matched';

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

export const createTagElement = (entries) => {
  const list = Array.isArray(entries) ? entries : [entries];
  const tag = document.createElement('span');
  tag.setAttribute('contenteditable', 'false');
  tag.setAttribute('data-tag', 'true');

  if (list.length === 1) {
    const { item, tagIndex } = list[0];
    const statusClass = isNegativeStatus(item.status)
      ? 'suggestion-tag--missing'
      : 'suggestion-tag--matched';
    tag.className = `suggestion-tag ${statusClass}`;
    tag.setAttribute('data-detail-id', String(item.detailId));
    tag.setAttribute('data-tag-number', String(tagIndex));

    const badge = document.createElement('span');
    badge.className = `suggestion-tag__badge ${getBadgeStatusClass(item.status)}`;
    badge.textContent = String(tagIndex);
    badge.setAttribute('data-detail-id', String(item.detailId));
    tag.appendChild(badge);
    return tag;
  }

  tag.className = 'suggestion-tag suggestion-tag--mixed';
  tag.setAttribute('data-detail-id', String(list[0].item.detailId));
  for (const { item, tagIndex } of list) {
    const badge = document.createElement('span');
    badge.className = `suggestion-tag__badge ${getBadgeStatusClass(item.status)}`;
    badge.textContent = String(tagIndex);
    badge.setAttribute('data-detail-id', String(item.detailId));
    tag.appendChild(badge);
  }
  return tag;
};

export const buildDecorationSet = (doc, highlights, pinnedRanges) => {
  if (!highlights || highlights.length === 0) {
    return DecorationSet.empty;
  }

  // Group highlights that resolve to the same text range so a bullet used
  // as evidence for both MATCHED and MISSING details renders both states.
  const groups = new Map();
  for (const item of highlights) {
    const highlightKey = getHighlightKey(item);
    const pinned = pinnedRanges?.get?.(highlightKey);
    if (!isValidRange(pinned, doc)) continue;

    const rangeKey = `${pinned.from}-${pinned.to}`;
    let group = groups.get(rangeKey);
    if (!group) {
      group = { from: pinned.from, to: pinned.to, items: [] };
      groups.set(rangeKey, group);
    }
    group.items.push(item);
  }

  const decorations = [];
  for (const { from, to, items } of groups.values()) {
    const focusedItem = items.find((i) => i.isFocused) || null;
    const detailIds = items.map((i) => i.detailId).join(',');

    const tagEntries = items
      .filter((i) => Number.isFinite(i.tagIndex))
      .map((i) => ({ item: i, tagIndex: i.tagIndex }))
      // Green (MATCHED) on the left, red (MISSING/PARTIAL) on the right.
      .sort((a, b) => {
        const an = isNegativeStatus(a.item.status) ? 1 : 0;
        const bn = isNegativeStatus(b.item.status) ? 1 : 0;
        return an - bn;
      });
    if (tagEntries.length > 0) {
      const keySig = tagEntries.map((e) => `${e.item.detailId}:${e.item.status}`).join('|');
      decorations.push(
        Decoration.widget(from, () => createTagElement(tagEntries), {
          side: -1,
          key: `tag-${from}-${keySig}`,
        })
      );
    }

    decorations.push(
      Decoration.inline(from, to, {
        class: getGroupHighlightClass(items, focusedItem),
        'data-detail-id': detailIds,
      })
    );
  }

  return DecorationSet.create(doc, decorations);
};
