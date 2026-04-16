import { useCallback, useState } from 'react';
import { findTextInDocFuzzy } from '../utils/prosemirrorSearch';

// Block-level HTML tags. If a suggestion contains any of these, we treat it
// as a "block suggestion" and replace the entire containing block — this is
// the only reliable way to preserve structures like <ul><li>..</li></ul> or
// a styled <h2>..</h2> without corrupting neighbouring blocks.
const BLOCK_TAGS_RE = /<(ul|ol|li|h[1-6]|p|div|blockquote|pre|table|section|article)[\s>]/i;

/**
 * Hook that provides apply-suggestion logic for a TipTap editor.
 *
 * Behaviour (no typewriter animation — instant, correct replacement):
 * - Block HTML suggestion (h2/ul/li/...): replace the entire containing block.
 *   Preserves heading style, inserts lists as proper list nodes.
 * - Inline/plain suggestion: replace just the matched text range.
 *
 * Returns:
 * - applyFix(editor, context, suggestionText, detailId) →
 *     Promise<{ success: boolean, range?: { from: number, to: number } }>
 *   The `range` is the absolute doc position of the inserted content; callers
 *   pin this so the highlight decoration is anchored at the actual location
 *   instead of relying on a fragile text re-search.
 * - fixingDetailId — currently fixing detail ID (or null)
 * - cancelAnimation() — no-op stub kept for API compatibility
 */
const useTypewriterFix = () => {
  const [fixingDetailId, setFixingDetailId] = useState(null);

  const cancelAnimation = useCallback(() => {
    setFixingDetailId(null);
  }, []);

  const applyFix = useCallback((editor, context, suggestionText, detailId) => {
    return new Promise((resolve) => {
      if (!editor || editor.isDestroyed) {
        resolve({ success: false });
        return;
      }

      // Find context text in the document
      const ranges = findTextInDocFuzzy(editor.state.doc, context);
      if (ranges.length === 0) {
        resolve({ success: false });
        return;
      }

      const { from, to } = ranges[0]; // Replace first occurrence
      const isBlockHtml = typeof suggestionText === 'string' && BLOCK_TAGS_RE.test(suggestionText);

      setFixingDetailId(detailId);
      editor.setEditable(false);

      try {
        let insertedFrom;
        let insertedTo;

        if (isBlockHtml) {
          // Block-level HTML → replace the entire innermost containing block.
          const resolved = editor.state.doc.resolve(from);
          const depth = resolved.depth; // innermost block depth

          // Strip empty list items that the AI occasionally appends.
          // Use DOM parsing instead of regex to handle any internal structure
          // (e.g. <li></li>, <li><p></p></li>, <li>&nbsp;</li>, etc.)
          const _tmpDiv = document.createElement('div');
          _tmpDiv.innerHTML = suggestionText.trim();
          _tmpDiv.querySelectorAll('li').forEach((li) => {
            if (!li.textContent.trim()) li.remove();
          });

          // Special case: if the matched position is inside a listItem's paragraph,
          // we must NOT delete the whole block. Deleting the paragraph but leaving
          // the listItem shell causes ProseMirror to add empty paragraphs to satisfy
          // the schema → extra empty bullets. Instead, replace only the paragraph's
          // text content, which preserves the existing list structure cleanly.
          const innerNode = resolved.node(depth);
          const outerNode = depth > 0 ? resolved.node(depth - 1) : null;
          const isInListItem =
            innerNode?.type.name === 'paragraph' &&
            (outerNode?.type.name === 'listItem' || outerNode?.type.name === 'taskItem');

          if (isInListItem) {
            // Extract the first <li>'s inner HTML as the replacement content.
            const liEl = _tmpDiv.querySelector('li');
            const innerHtml = liEl ? liEl.innerHTML.trim() : _tmpDiv.textContent.trim();

            // Replace only the content inside the existing paragraph, keeping the
            // listItem/bulletList structure intact.
            const paraContentStart = resolved.start(depth);
            const paraContentEnd = resolved.end(depth);

            const sizeBefore = editor.state.doc.content.size;
            editor
              .chain()
              .deleteRange({ from: paraContentStart, to: paraContentEnd })
              .insertContentAt(paraContentStart, innerHtml, { updateSelection: false })
              .run();
            const sizeAfter = editor.state.doc.content.size;

            const newLen = (paraContentEnd - paraContentStart) + (sizeAfter - sizeBefore);
            let textFrom = paraContentStart;
            let foundFirst = false;
            editor.state.doc.nodesBetween(paraContentStart, paraContentStart + newLen, (node, pos) => {
              if (foundFirst) return false;
              if (node.isText) { textFrom = pos; foundFirst = true; return false; }
              return true;
            });
            insertedFrom = textFrom;
            insertedTo = paraContentStart + newLen;
          } else {
            // Standard block replacement: delete the entire containing block and
            // insert the suggestion HTML in its place.
            const parentStart = resolved.before(depth);
            const parentEnd = resolved.after(depth);
            const cleanedSuggestion = _tmpDiv.innerHTML;

            const sizeBefore = editor.state.doc.content.size;
            editor
              .chain()
              .deleteRange({ from: parentStart, to: parentEnd })
              .insertContentAt(parentStart, cleanedSuggestion, {
                updateSelection: false,
                parseOptions: { preserveWhitespace: false },
              })
              .run();
            const sizeAfter = editor.state.doc.content.size;

            const deletedLen = parentEnd - parentStart;
            const newLen = deletedLen + (sizeAfter - sizeBefore);

            // Find the first text-node position inside the newly inserted content
            // so the badge widget renders inline with text rather than between blocks.
            let textFrom = parentStart + 1; // safe fallback
            let foundFirst = false;
            editor.state.doc.nodesBetween(parentStart, parentStart + newLen, (node, pos) => {
              if (foundFirst) return false;
              if (node.isText) { textFrom = pos; foundFirst = true; return false; }
              return true;
            });
            insertedFrom = textFrom;
            insertedTo = parentStart + newLen - 1;
          }
        } else {
          // Inline / plain text suggestion → replace just the matched range.
          let plainText = suggestionText;
          if (typeof suggestionText === 'string' && /<[^>]+>/.test(suggestionText)) {
            const div = document.createElement('div');
            div.innerHTML = suggestionText;
            plainText = (div.textContent || div.innerText || '').trim();
          }

          const sizeBefore = editor.state.doc.content.size;
          editor
            .chain()
            .deleteRange({ from, to })
            .insertContentAt(from, plainText, { updateSelection: false })
            .run();
          const sizeAfter = editor.state.doc.content.size;

          const deletedLen = to - from;
          const newLen = deletedLen + (sizeAfter - sizeBefore);
          insertedFrom = from;
          insertedTo = from + newLen;
        }

        editor.setEditable(true);
        setFixingDetailId(null);
        resolve({ success: true, range: { from: insertedFrom, to: insertedTo } });
      } catch (err) {
        console.error('applyFix error:', err);
        editor.setEditable(true);
        setFixingDetailId(null);
        resolve({ success: false });
      }
    });
  }, []);

  return { applyFix, fixingDetailId, cancelAnimation };
};

export default useTypewriterFix;
