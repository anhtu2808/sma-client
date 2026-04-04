import { Extension } from '@tiptap/react';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { findTextInDocFuzzy } from '../utils/prosemirrorSearch';

export const suggestionHighlightKey = new PluginKey('suggestionHighlight');

/**
 * TipTap extension that renders ProseMirror Decorations for AI detail items.
 *
 * Commands:
 * - setHighlights(highlights) — array of { detailId, context, status, isFocused, label }
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
            return { decorationSet: DecorationSet.empty, highlights: [] };
          },

          apply(tr, prevState) {
            const meta = tr.getMeta(suggestionHighlightKey);

            if (meta) {
              // Rebuild decorations from new highlight data
              const decorationSet = buildDecorationSet(tr.doc, meta.highlights);
              return { decorationSet, highlights: meta.highlights };
            }

            // If the doc changed, map existing decorations
            if (tr.docChanged) {
              return {
                decorationSet: prevState.decorationSet.map(tr.mapping, tr.doc),
                highlights: prevState.highlights,
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
  if (normalized === 'missing') {
    statusClass = `${base}--missing`;
  } else {
    // MATCHED, FIXED, or any positive status
    statusClass = `${base}--matched`;
  }

  return isFocused ? `${base} ${statusClass} ${base}--focused` : `${base} ${statusClass}`;
};

const getTagStatusClass = (status) => {
  const normalized = (status || '').toLowerCase();
  return normalized === 'missing' ? 'suggestion-tag--missing' : 'suggestion-tag--matched';
};

const buildDecorationSet = (doc, highlights) => {
  if (!highlights || highlights.length === 0) {
    return DecorationSet.empty;
  }

  // Debug: log flat text length to verify editor content is loaded
  let flatTextLen = 0;
  doc.descendants((node) => {
    if (node.isText) flatTextLen += node.text.length;
    return true;
  });
  console.log(`[SuggestionHighlight] Building decorations: ${highlights.length} highlights, doc text length: ${flatTextLen}`);

  const decorations = [];
  let tagNumber = 0;

  for (const item of highlights) {
    if (!item.context || typeof item.context !== 'string') continue;

    const ranges = findTextInDocFuzzy(doc, item.context);
    if (ranges.length === 0) {
      console.warn('[SuggestionHighlight] No match for:', item.label, '| context:', item.context.substring(0, 60));
      continue;
    }
    tagNumber++;

    for (const { from, to } of ranges) {
      // Inline decoration for the highlighted text + tag overlay via CSS ::before
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
