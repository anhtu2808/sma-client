import { Schema } from 'prosemirror-model';
import { Transform } from 'prosemirror-transform';
import {
  buildDecorationSet,
  buildHighlightMap,
  buildPinnedRangeMap,
  mapPinnedRangeMap,
} from './suggestionDecorationUtils';

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: {
      content: 'inline*',
      group: 'block',
      toDOM: () => ['p', 0],
    },
    text: { group: 'inline' },
  },
  marks: {
    strong: {
      toDOM: () => ['strong', 0],
    },
  },
});

const createDoc = (paragraphs) =>
  schema.node(
    'doc',
    null,
    paragraphs.map((parts) =>
      schema.node(
        'paragraph',
        null,
        parts.map(({ text, marks = [] }) => schema.text(text, marks))
      )
    )
  );

const getWidgetDecorations = (decorationSet) =>
  decorationSet.find().filter((decoration) => typeof decoration.type.toDOM === 'function');

const getInlineDecorations = (decorationSet) =>
  decorationSet.find().filter((decoration) => typeof decoration.type.toDOM !== 'function');

describe('SuggestionHighlight decorations', () => {
  it('renders exactly one tag widget for a logical highlight spanning marked text nodes', () => {
    const strong = schema.marks.strong.create();
    const doc = createDoc([
      [
        { text: 'Tools & ', marks: [strong] },
        { text: 'Technologies: Git, Maven, Figma' },
      ],
    ]);
    const highlights = [
      {
        detailId: 1,
        highlightKey: 'id:1',
        context: 'Tools & Technologies',
        tagIndex: 7,
        status: 'PARTIAL',
        isFocused: false,
      },
    ];
    const pinnedRanges = buildPinnedRangeMap(doc, highlights, new Map(), buildHighlightMap());

    const decorationSet = buildDecorationSet(
      doc,
      highlights,
      pinnedRanges
    );

    const widgets = getWidgetDecorations(decorationSet);

    expect(widgets).toHaveLength(1);
    expect(widgets[0].spec.key).toBeTruthy();

    const tagElement = widgets[0].type.toDOM();
    expect(tagElement.className).toContain('suggestion-tag');
    expect(tagElement.dataset.detailId).toBe('1');
    expect(tagElement.dataset.tagNumber).toBe('7');
  });

  it('renders one widget per resolved range without duplicating the same range', () => {
    const doc = createDoc([
      [{ text: 'Git, Maven, Figma' }],
      [{ text: 'Postman, Jira, Git' }],
    ]);
    const highlights = [
      {
        detailId: 5,
        highlightKey: 'id:5',
        context: 'Git',
        tagIndex: 3,
        status: 'MATCHED',
        isFocused: false,
      },
    ];
    const pinnedRanges = new Map([
      ['id:5', { from: 1, to: 4 }],
      ['id:5:second', { from: 21, to: 24 }],
    ]);

    const decorationSet = buildDecorationSet(
      doc,
      [
        highlights[0],
        { ...highlights[0], highlightKey: 'id:5:second' },
      ],
      pinnedRanges
    );

    const widgets = getWidgetDecorations(decorationSet);

    expect(widgets).toHaveLength(2);
    expect(new Set(widgets.map((widget) => widget.spec.key)).size).toBe(2);
    expect(
      widgets.every((widget) => widget.type.toDOM().dataset.tagNumber === '3')
    ).toBe(true);
  });

  it('keeps per-highlight numbers instead of reusing the last number for every widget', () => {
    const doc = createDoc([
      [{ text: 'Full-Stack Software Engineer' }],
      [{ text: 'Software Engineering' }],
    ]);
    const highlights = [
      {
        detailId: 10,
        highlightKey: 'id:10',
        context: 'Full-Stack Software Engineer',
        tagIndex: 1,
        status: 'PARTIAL',
        isFocused: false,
      },
      {
        detailId: 20,
        highlightKey: 'id:20',
        context: 'Software Engineering',
        tagIndex: 4,
        status: 'PARTIAL',
        isFocused: false,
      },
    ];
    const pinnedRanges = buildPinnedRangeMap(doc, highlights, new Map(), buildHighlightMap());

    const decorationSet = buildDecorationSet(
      doc,
      highlights,
      pinnedRanges
    );

    const widgets = getWidgetDecorations(decorationSet);
    const renderedNumbers = widgets.map((widget) => widget.type.toDOM().dataset.tagNumber);

    expect(renderedNumbers).toEqual(['1', '4']);
  });

  it('renders underline only when tagIndex is missing', () => {
    const doc = createDoc([
      [{ text: 'Java' }],
    ]);
    const highlights = [
      {
        detailId: 30,
        highlightKey: 'id:30',
        context: 'Java',
        tagIndex: null,
        status: 'MATCHED',
        isFocused: false,
      },
    ];
    const pinnedRanges = buildPinnedRangeMap(doc, highlights, new Map(), buildHighlightMap());

    const decorationSet = buildDecorationSet(
      doc,
      highlights,
      pinnedRanges
    );

    const decorations = decorationSet.find();
    const widgets = getWidgetDecorations(decorationSet);

    expect(widgets).toHaveLength(0);
    expect(decorations).toHaveLength(1);
    expect(typeof decorations[0].type.toDOM).not.toBe('function');
  });

  it('drops pinned ranges that are no longer present in the latest highlight payload', () => {
    const withPinned = buildPinnedRangeMap([
      {
        detailId: 10,
        highlightKey: 'id:10',
        pinnedRange: { from: 3, to: 9 },
      },
    ]);
    const rebuilt = buildPinnedRangeMap([
      {
        detailId: 10,
        highlightKey: 'id:10',
        pinnedRange: null,
      },
    ]);

    expect(withPinned.get('id:10')).toEqual({ from: 3, to: 9 });
    expect(rebuilt.has('id:10')).toBe(false);
  });

  it('keeps the same pinned highlight anchored after deleting text before it', () => {
    const doc = createDoc([
      [{ text: 'Alpha Beta Gamma' }],
    ]);
    const highlights = [
      {
        detailId: 10,
        highlightKey: 'id:10',
        context: 'Beta',
        tagIndex: 10,
        status: 'PARTIAL',
        isFocused: false,
      },
    ];

    const pinnedRanges = buildPinnedRangeMap(doc, highlights, new Map(), buildHighlightMap());
    const transform = new Transform(doc);
    transform.delete(1, 3);

    const mappedPinned = mapPinnedRangeMap(transform.mapping, transform.doc, pinnedRanges);
    const decorationSet = buildDecorationSet(transform.doc, highlights, mappedPinned);
    const inlineDecorations = getInlineDecorations(decorationSet);

    expect(mappedPinned.get('id:10')).toEqual({ from: 5, to: 9 });
    expect(inlineDecorations).toHaveLength(1);
    expect(inlineDecorations[0].from).toBe(5);
    expect(inlineDecorations[0].to).toBe(9);
  });

  it('does not let highlight 9 reuse highlight 10 range after editing inside highlight 10', () => {
    const doc = createDoc([
      [{ text: 'Frontend Development DevOps' }],
    ]);
    const highlights = [
      {
        detailId: 10,
        highlightKey: 'id:10',
        context: 'Frontend Development',
        tagIndex: 10,
        status: 'PARTIAL',
        isFocused: false,
      },
      {
        detailId: 9,
        highlightKey: 'id:9',
        context: 'DevOps',
        tagIndex: 9,
        status: 'PARTIAL',
        isFocused: false,
      },
    ];

    const initialPinned = buildPinnedRangeMap(doc, highlights, new Map(), buildHighlightMap());
    const transform = new Transform(doc);
    transform.delete(10, 16);

    const mappedPinned = mapPinnedRangeMap(transform.mapping, transform.doc, initialPinned);

    expect(mappedPinned.get('id:10')).toEqual({ from: 1, to: 15 });
    expect(mappedPinned.get('id:9')).toEqual({ from: 16, to: 22 });
    expect(mappedPinned.get('id:9').from).toBeGreaterThan(mappedPinned.get('id:10').to);
  });

  it('drops a highlight instead of re-searching elsewhere when its pinned range is deleted', () => {
    const doc = createDoc([
      [{ text: 'Java' }],
    ]);
    const highlights = [
      {
        detailId: 30,
        highlightKey: 'id:30',
        context: 'Java',
        tagIndex: 1,
        status: 'MATCHED',
        isFocused: false,
      },
    ];

    const initialPinned = buildPinnedRangeMap(doc, highlights, new Map(), buildHighlightMap());
    const transform = new Transform(doc);
    transform.delete(1, 5);

    const mappedPinned = mapPinnedRangeMap(transform.mapping, transform.doc, initialPinned);
    const decorationSet = buildDecorationSet(transform.doc, highlights, mappedPinned);

    expect(mappedPinned.has('id:30')).toBe(false);
    expect(decorationSet.find()).toHaveLength(0);
  });

  it('re-resolves a pinned range when the same highlight key gets a new context', () => {
    const doc = createDoc([
      [{ text: 'Old Text New Text' }],
    ]);
    const previousHighlights = [
      {
        detailId: 10,
        highlightKey: 'id:10',
        context: 'Old Text',
        tagIndex: 1,
        status: 'PARTIAL',
        isFocused: false,
      },
    ];
    const nextHighlights = [
      {
        detailId: 10,
        highlightKey: 'id:10',
        context: 'New Text',
        tagIndex: 1,
        status: 'PARTIAL',
        isFocused: false,
      },
    ];

    const previousPinned = buildPinnedRangeMap(doc, previousHighlights, new Map(), buildHighlightMap());
    const rebuilt = buildPinnedRangeMap(
      doc,
      nextHighlights,
      previousPinned,
      buildHighlightMap(previousHighlights)
    );

    expect(previousPinned.get('id:10')).toEqual({ from: 1, to: 9 });
    expect(rebuilt.get('id:10')).toEqual({ from: 10, to: 18 });
  });
});
