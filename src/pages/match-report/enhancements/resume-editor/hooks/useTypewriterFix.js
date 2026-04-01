import { useCallback, useRef, useState } from 'react';
import { findTextInDoc } from '../utils/prosemirrorSearch';

const TYPING_DELAY = 8; // ms per character
const CHARS_PER_TICK = 3; // characters inserted per animation frame

/**
 * Hook that provides a typewriter-style text replacement in a TipTap editor.
 *
 * Returns:
 * - applyFix(editor, context, suggestionText) → Promise<boolean>
 * - fixingDetailId — currently animating detail ID (or null)
 * - cancelAnimation() — stops any running animation
 */
const useTypewriterFix = () => {
  const [fixingDetailId, setFixingDetailId] = useState(null);
  const animationRef = useRef(null);

  const cancelAnimation = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current.timer);
      const { editor, remainingText, insertPos } = animationRef.current;

      // Insert any remaining text immediately
      if (remainingText && editor && !editor.isDestroyed) {
        editor.chain().insertContentAt(insertPos, remainingText, { updateSelection: false }).run();
        editor.setEditable(true);
      }

      animationRef.current = null;
      setFixingDetailId(null);
    }
  }, []);

  const applyFix = useCallback(
    (editor, context, suggestionText, detailId) => {
      return new Promise((resolve) => {
        if (!editor || editor.isDestroyed) {
          resolve(false);
          return;
        }

        // Cancel any in-progress animation
        cancelAnimation();

        // Find context text in the document
        const ranges = findTextInDoc(editor.state.doc, context);
        if (ranges.length === 0) {
          resolve(false);
          return;
        }

        const { from, to } = ranges[0]; // Replace first occurrence

        setFixingDetailId(detailId);
        editor.setEditable(false);

        // Delete the original text
        editor.chain().deleteRange({ from, to }).run();

        // Typewriter: insert accumulated substring to avoid position math issues
        let charIndex = 0;

        const typeNextChar = () => {
          if (charIndex >= suggestionText.length || !animationRef.current) {
            // Done
            editor.setEditable(true);
            animationRef.current = null;
            setFixingDetailId(null);
            resolve(true);
            return;
          }

          charIndex = Math.min(charIndex + CHARS_PER_TICK, suggestionText.length);
          const textSoFar = suggestionText.slice(0, charIndex);

          try {
            // Replace the entire growing range each tick to avoid position drift
            editor
              .chain()
              .deleteRange({ from, to: from + charIndex - 1 })
              .insertContentAt(from, textSoFar, { updateSelection: false })
              .run();
          } catch {
            // On any error, insert remaining text and unlock
            try {
              editor
                .chain()
                .insertContentAt(from + charIndex - 1, suggestionText.slice(charIndex - 1), { updateSelection: false })
                .run();
            } catch { /* best effort */ }
            editor.setEditable(true);
            animationRef.current = null;
            setFixingDetailId(null);
            resolve(true);
            return;
          }

          // Track state for cancellation
          animationRef.current = {
            timer: null,
            editor,
            remainingText: suggestionText.slice(charIndex),
            insertPos: from + charIndex,
          };

          animationRef.current.timer = setTimeout(typeNextChar, TYPING_DELAY);
        };

        // Initialize animation ref
        animationRef.current = {
          timer: null,
          editor,
          remainingText: suggestionText,
          insertPos: from,
        };

        // Start the animation
        animationRef.current.timer = setTimeout(typeNextChar, TYPING_DELAY);
      });
    },
    [cancelAnimation]
  );

  return { applyFix, fixingDetailId, cancelAnimation };
};

export default useTypewriterFix;
