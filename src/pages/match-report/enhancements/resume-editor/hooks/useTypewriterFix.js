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
          const parentStart = resolved.before(depth);
          const parentEnd = resolved.after(depth);

          const sizeBefore = editor.state.doc.content.size;
          editor
            .chain()
            .deleteRange({ from: parentStart, to: parentEnd })
            .insertContentAt(parentStart, suggestionText, { updateSelection: false })
            .run();
          const sizeAfter = editor.state.doc.content.size;

          // New content occupies parentStart .. parentStart + (newContentSize)
          // where newContentSize = (deletedSize) + (delta)
          const deletedLen = parentEnd - parentStart;
          const newLen = deletedLen + (sizeAfter - sizeBefore);
          insertedFrom = parentStart;
          insertedTo = parentStart + newLen;
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
