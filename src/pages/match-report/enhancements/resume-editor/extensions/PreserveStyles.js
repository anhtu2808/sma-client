import { Extension } from '@tiptap/core';

/**
 * TipTap extension that preserves inline `style` attributes on block-level nodes.
 * Without this, TipTap strips styles it doesn't know about when parsing HTML,
 * causing content to lose formatting (colors, font-size, etc.) after re-serialization.
 */
const PreserveStyles = Extension.create({
  name: 'preserveStyles',

  addGlobalAttributes() {
    return [
      {
        types: [
          'heading',
          'paragraph',
          'bulletList',
          'orderedList',
          'listItem',
          'horizontalRule',
          'blockquote',
          'image',
        ],
        attributes: {
          style: {
            default: null,
            parseHTML: (element) => element.getAttribute('style') || null,
            renderHTML: (attributes) => {
              if (!attributes.style) return {};
              return { style: attributes.style };
            },
          },
        },
      },
    ];
  },
});

export default PreserveStyles;
