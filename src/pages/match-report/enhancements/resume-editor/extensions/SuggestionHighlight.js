import { Extension } from '@tiptap/react';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { DecorationSet } from '@tiptap/pm/view';
import {
  buildDecorationSet,
  buildHighlightMap,
  buildPinnedRangeMap,
  mapPinnedRangeMap,
} from './suggestionDecorationUtils';

export const suggestionHighlightKey = new PluginKey('suggestionHighlight');

/**
 * TipTap extension that renders ProseMirror Decorations for AI detail items.
 *
 * Two source-of-truth strategies for the highlight range:
 * 1. **Pinned range** (preferred when available, e.g. right after Apply):
 *    absolute doc positions captured at insertion time. Mapped through every
 *    docChanged transaction so manual edits keep the highlight anchored.
 * 2. **Text search** (fallback for highlights from initial API load):
 *    used only once to seed the initial pinned range.
 *
 * Commands:
 * - setHighlights(highlights) — array of
 *   { detailId, highlightKey, context, pinnedRange?, tagIndex?, status, isFocused, label }
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
              pinnedRanges: new Map(), // highlightKey → {from, to}
            };
          },

          apply(tr, prevState) {
            const meta = tr.getMeta(suggestionHighlightKey);

            if (meta) {
              const previousHighlightsByKey = buildHighlightMap(prevState.highlights);
              const newPinned = buildPinnedRangeMap(
                tr.doc,
                meta.highlights,
                prevState.pinnedRanges,
                previousHighlightsByKey
              );
              const decorationSet = buildDecorationSet(tr.doc, meta.highlights, newPinned);
              return { decorationSet, highlights: meta.highlights, pinnedRanges: newPinned };
            }

            if (tr.docChanged) {
              const mappedPinned = mapPinnedRangeMap(tr.mapping, tr.doc, prevState.pinnedRanges);
              return {
                decorationSet: buildDecorationSet(tr.doc, prevState.highlights, mappedPinned),
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

export default SuggestionHighlight;
