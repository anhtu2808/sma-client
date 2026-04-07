import { Extension } from '@tiptap/react';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

/**
 * Self-contained A4 page-break extension for the resume editor.
 *
 * Replaces the previous `tiptap-pagination-plus` integration. That library drew
 * page breaks as 100%-wide `float: left` overlays which caused content blocks
 * landing on a boundary to wrap around them and render as a vertical squashed
 * column (e.g. the `EntryHeader` flex node).
 *
 * This extension uses the same algorithm as the export modal's
 * `distributeHtmlIntoPages`: walk top-level blocks, accumulate natural heights,
 * and insert a `Decoration.widget` *before* any block that does not fit on the
 * current page. The widget renders as a transparent spacer that fills the rest
 * of the previous page plus a gray "page-break" gap and the top padding of the
 * next page — visually identical to a real page break, but with **no floats**
 * so content never wraps around it.
 *
 * Constants below match `ExportEnhancementModal.js` so the editor and the
 * exported PDF have identical page boundaries.
 */

// A4 @ 96 DPI
const A4_HEIGHT_PX = 1123;
const PAGE_PAD_Y = 40;
const PAGE_PAD_X = 50;
// Visible gray gap between pages
const PAGE_GAP_PX = 32;
// Usable content height per page after subtracting top + bottom padding.
const PAGE_USABLE_HEIGHT = A4_HEIGHT_PX - PAGE_PAD_Y * 2;

const smartBreakSpacerKey = new PluginKey('smartBreakSpacer');

// `key` is what makes ProseMirror reuse the SAME widget DOM across updates
// (avoids tearing down and rebuilding spacers on every recompute).
const widgetKey = ({ pos, height }) => `pb:${pos}:${height}`;

const signatureOf = (entries) => entries.map(widgetKey).join('|');

const renderSpacer = (height, prevPageRemainder) => {
  // Layout of the spacer (top → bottom):
  //   [white, prevPageRemainder px]   ← fills end of the previous page's content
  //   [white, PAGE_PAD_Y px]          ← bottom padding of the previous page
  //   [gray,  PAGE_GAP_PX px]         ← the visible page-break gap
  //   [white, PAGE_PAD_Y px]          ← top padding of the next page
  const wrapper = document.createElement('div');
  wrapper.className = 'rm-page-break';
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.style.position = 'relative';
  wrapper.style.height = `${height}px`;
  wrapper.style.width = `calc(100% + ${PAGE_PAD_X * 2}px)`;
  wrapper.style.marginLeft = `-${PAGE_PAD_X}px`;
  wrapper.style.marginRight = `-${PAGE_PAD_X}px`;
  wrapper.style.pointerEvents = 'none';
  wrapper.style.userSelect = 'none';

  const gap = document.createElement('div');
  gap.className = 'rm-page-break-gap';
  gap.style.position = 'absolute';
  gap.style.left = '0';
  gap.style.right = '0';
  gap.style.top = `${prevPageRemainder + PAGE_PAD_Y}px`;
  gap.style.height = `${PAGE_GAP_PX}px`;
  gap.style.background = '#e5e7eb'; // tailwind neutral-200, matches the outer bg
  wrapper.appendChild(gap);

  return wrapper;
};

/**
 * Walk the editor's top-level DOM blocks and decide which ones need a page-break
 * spacer before them. Returns an array of `{ pos, height, prevPageRemainder }`.
 *
 * Important: we measure each block's height with `getBoundingClientRect`, which
 * is independent of what is rendered above the block — so this calculation is
 * stable regardless of any spacers we previously inserted.
 */
const computeSpacerEntries = (view) => {
  const { doc } = view.state;

  // Collect parallel arrays of doc positions and DOM nodes for each top-level child.
  const tops = [];
  doc.forEach((node, pos) => {
    const dom = view.nodeDOM(pos);
    if (!dom || dom.nodeType !== 1) return;
    tops.push({ pos, dom });
  });
  if (tops.length === 0) return [];

  // Measure each block's natural height including its margins.
  const measured = tops.map(({ pos, dom }) => {
    const rect = dom.getBoundingClientRect();
    const cs = window.getComputedStyle(dom);
    const mt = parseFloat(cs.marginTop) || 0;
    const mb = parseFloat(cs.marginBottom) || 0;
    return { pos, height: rect.height + mt + mb };
  });

  const entries = [];
  let pageY = 0; // running natural Y inside the current page
  for (let i = 0; i < measured.length; i += 1) {
    const { pos, height } = measured[i];
    // First block on a page never gets pushed.
    const isFirstOnPage = pageY === 0;
    if (!isFirstOnPage && pageY + height > PAGE_USABLE_HEIGHT && height <= PAGE_USABLE_HEIGHT) {
      // Push this block onto the next page.
      const prevPageRemainder = PAGE_USABLE_HEIGHT - pageY;
      const spacerHeight = prevPageRemainder + PAGE_PAD_Y + PAGE_GAP_PX + PAGE_PAD_Y;
      entries.push({ pos, height: spacerHeight, prevPageRemainder });
      pageY = height;
    } else {
      pageY += height;
    }
  }

  return entries;
};

const buildDecorationSet = (doc, entries) => {
  if (entries.length === 0) return DecorationSet.empty;
  const decos = entries.map((entry) =>
    Decoration.widget(entry.pos, () => renderSpacer(entry.height, entry.prevPageRemainder), {
      side: -1,
      key: widgetKey(entry),
    })
  );
  return DecorationSet.create(doc, decos);
};

const SmartBreakSpacer = Extension.create({
  name: 'smartBreakSpacer',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: smartBreakSpacerKey,
        state: {
          init: () => DecorationSet.empty,
          apply(tr, old) {
            const meta = tr.getMeta(smartBreakSpacerKey);
            if (meta) return meta;
            return old.map(tr.mapping, tr.doc);
          },
        },
        props: {
          decorations(state) {
            return smartBreakSpacerKey.getState(state);
          },
        },
        view(editorView) {
          let raf = 0;
          let lastSig = '';

          const recompute = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
              raf = 0;
              if (editorView.isDestroyed) return;
              const entries = computeSpacerEntries(editorView);
              const sig = signatureOf(entries);
              if (sig === lastSig) return; // converged — no change, skip dispatch
              lastSig = sig;
              const next = buildDecorationSet(editorView.state.doc, entries);
              editorView.dispatch(
                editorView.state.tr.setMeta(smartBreakSpacerKey, next)
              );
            });
          };

          recompute();

          return {
            update() {
              recompute();
            },
            destroy() {
              if (raf) cancelAnimationFrame(raf);
            },
          };
        },
      }),
    ];
  },
});

export default SmartBreakSpacer;
