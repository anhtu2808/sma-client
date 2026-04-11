import { Extension } from '@tiptap/react';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { findTextInDocFuzzy } from '../utils/prosemirrorSearch';

export const suggestionHighlightKey = new PluginKey('suggestionHighlight');

/**
 * TipTap extension that renders ProseMirror Decorations for AI detail items.
 *
 * Two source-of-truth strategies for the highlight range:
 * 1. **Pinned range** (preferred when available, e.g. right after Apply):
 *    absolute doc positions captured at insertion time. Mapped through every
 *    docChanged transaction so manual edits keep the highlight anchored.
 * 2. **Text search** (fallback for highlights from initial API load):
 *    `findTextInDocFuzzy(item.context)`.
 *
 * Commands:
 * - setHighlights(highlights) — array of { detailId, context, pinnedRange?, status, isFocused, label }
 * - clearHighlights()
 *
 * Decorations are view-only and never serialized to HTML.
 */
const SuggestionHighlight = Extension.create({
  name: 'suggestionHighlight',

  addCommands() {
    return {
      setHighlights:
        (highlights) =>
        ({ tr, dispatch }) => {
          if (dispatch) {
            tr.setMeta(suggestionHighlightKey, { highlights });
          }
          return true;
        },
      clearHighlights:
        () =>
        ({ tr, dispatch }) => {
          if (dispatch) {
            tr.setMeta(suggestionHighlightKey, { highlights: [] });
          }
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: suggestionHighlightKey,

        state: {
          init() {
            return {
              decorationSet: DecorationSet.empty,
              highlights: [],
              pinnedRanges: new Map(), // detailId → {from, to}
            };
          },

          apply(tr, prevState) {
            const meta = tr.getMeta(suggestionHighlightKey);

            if (meta) {
              // Rebuild decorations from new highlight data.
              // Seed pinnedRanges from incoming highlights AND preserve any existing
              // mapped ranges (so a re-render after a manual edit doesn't drop them).
              const newPinned = new Map(prevState.pinnedRanges);
              for (const h of meta.highlights || []) {
                if (h.pinnedRange &&
                    Number.isFinite(h.pinnedRange.from) &&
                    Number.isFinite(h.pinnedRange.to)) {
                  newPinned.set(h.detailId, h.pinnedRange);
                }
              }
              const decorationSet = buildDecorationSet(tr.doc, meta.highlights, newPinned);
              return { decorationSet, highlights: meta.highlights, pinnedRanges: newPinned };
            }

            // If the doc changed, map both decorations and pinned ranges
            if (tr.docChanged) {
              const mappedPinned = new Map();
              for (const [id, r] of prevState.pinnedRanges) {
                const from = tr.mapping.map(r.from, 1);
                const to = tr.mapping.map(r.to, -1);
                if (from < to && to <= tr.doc.content.size) {
                  mappedPinned.set(id, { from, to });
                }
              }
              return {
                decorationSet: prevState.decorationSet.map(tr.mapping, tr.doc),
                highlights: prevState.highlights,
                pinnedRanges: mappedPinned,
              };
            }

            return prevState;
          },
        },

        props: {
          decorations(state) {
            return this.getState(state)?.decorationSet ?? DecorationSet.empty;
          },
        },
      }),
    ];
  },
});

const getHighlightClass = (status, isFocused) => {
  const base = 'suggestion-highlight';
  const normalized = (status || '').toLowerCase();

  let statusClass;
  if (normalized === 'missing' || normalized === 'partial') {
    statusClass = `${base}--missing`;
  } else {
    // MATCHED, FIXED, or any positive status
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

const buildDecorationSet = (doc, highlights, pinnedRanges) => {
  if (!highlights || highlights.length === 0) {
    return DecorationSet.empty;
  }

  const decorations = [];
  let tagNumber = 0;

  for (const item of highlights) {
    let ranges = [];

    // Strategy 1: pinned range from prior apply
    const pinned = pinnedRanges?.get?.(item.detailId);
    if (pinned &&
        Number.isFinite(pinned.from) &&
        Number.isFinite(pinned.to) &&
        pinned.from < pinned.to &&
        pinned.to <= doc.content.size) {
      ranges = [{ from: pinned.from, to: pinned.to }];
    } else if (item.context && typeof item.context === 'string') {
      // Strategy 2: text search fallback
      ranges = findTextInDocFuzzy(doc, item.context);
    }

    if (ranges.length === 0) {
      continue;
    }
    tagNumber++;

    for (const { from, to } of ranges) {
      decorations.push(
        Decoration.inline(from, to, {
          class: `${getHighlightClass(item.status, item.isFocused)} suggestion-has-tag ${getTagStatusClass(item.status)}`,
          'data-detail-id': String(item.detailId),
          'data-tag': 'true',
          'data-tag-number': String(tagNumber),
          style: `--tag-number: "${tagNumber}"`,
        })
      );
    }
  }

  return DecorationSet.create(doc, decorations);
};

export default SuggestionHighlight;
