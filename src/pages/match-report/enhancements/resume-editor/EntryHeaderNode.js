import { Node, mergeAttributes } from '@tiptap/core';

/**
 * Custom Tiptap node: renders a flex row with title (left) and date (right).
 * HTML: <div data-type="entryHeader" data-date="Aug 2025 - Present"><strong>Company - Title</strong></div>
 * Renders: [bold title on left] [date on right, via CSS flex]
 */
const EntryHeader = Node.create({
  name: 'entryHeader',
  group: 'block',
  content: 'inline*',

  addAttributes() {
    return {
      date: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-date'),
        renderHTML: (attrs) => {
          if (!attrs.date) return {};
          return { 'data-date': attrs.date };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="entryHeader"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const { date, ...rest } = HTMLAttributes;
    const attrs = mergeAttributes({ 'data-type': 'entryHeader' }, rest);
    if (date) {
      attrs['data-date'] = date;
    }

    // Render: <div data-type="entryHeader" data-date="...">
    //   <span class="entry-title">[inline content]</span>
    //   <span class="entry-date">[date text]</span>
    // </div>
    // The date is rendered via CSS ::after or via NodeView
    return ['div', attrs, 0];
  },

  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      const dom = document.createElement('div');
      Object.entries(mergeAttributes({ 'data-type': 'entryHeader' }, HTMLAttributes)).forEach(
        ([key, value]) => {
          if (value !== null && value !== undefined && value !== false) {
            dom.setAttribute(key, value);
          }
        }
      );

      const titleSpan = document.createElement('span');
      titleSpan.classList.add('entry-title');
      dom.appendChild(titleSpan);

      if (node.attrs.date) {
        const dateSpan = document.createElement('span');
        dateSpan.classList.add('entry-date');
        dateSpan.textContent = node.attrs.date;
        dom.appendChild(dateSpan);
      }

      return {
        dom,
        contentDOM: titleSpan,
      };
    };
  },
});

export default EntryHeader;
