import {
  buildPageTextRanges,
  buildTextLayerSpanRefs,
  bucketSpanMetricsIntoLines,
  collectHighlightAreasForSegment,
  getDetailPageSegments,
  getOverlappingSpanSegments,
} from "./highlight-utils";

const mockRect = ({ left, top, width, height }) => ({
  left,
  top,
  width,
  height,
});

const createTextLayer = (spans) => {
  const textLayer = document.createElement("div");
  textLayer.getBoundingClientRect = jest.fn(() =>
    mockRect({
      left: 100,
      top: 50,
      width: 200,
      height: 400,
    })
  );

  spans.forEach((spanConfig, index) => {
    const span = document.createElement("span");
    span.className = "rpv-core__text-layer-text";
    span.textContent = spanConfig.text;
    span.getBoundingClientRect = jest.fn(() =>
      mockRect({
        left: 100 + (spanConfig.left ?? index * 40),
        top: 50 + (spanConfig.top ?? 0),
        width: spanConfig.width ?? Math.max(12, spanConfig.text.length * 8),
        height: spanConfig.height ?? 18,
      })
    );
    textLayer.appendChild(span);
  });

  return textLayer;
};

describe("highlight-utils", () => {
  it("builds cumulative page text ranges", () => {
    expect(buildPageTextRanges(["Hello", "World", "!"])).toEqual([
      { pageIndex: 0, pageText: "Hello", pageCharStart: 0, pageCharEnd: 5 },
      { pageIndex: 1, pageText: "World", pageCharStart: 5, pageCharEnd: 10 },
      { pageIndex: 2, pageText: "!", pageCharStart: 10, pageCharEnd: 11 },
    ]);
  });

  it("maps a detail range across multiple pages", () => {
    const pageRanges = buildPageTextRanges(["Hello", "World", "Again"]);
    const detail = { id: 42, startIndex: 3, endIndex: 11 };

    expect(getDetailPageSegments(detail, pageRanges)).toEqual([
      {
        detailId: 42,
        pageIndex: 0,
        globalStart: 3,
        globalEnd: 5,
        localStart: 3,
        localEnd: 5,
      },
      {
        detailId: 42,
        pageIndex: 1,
        globalStart: 5,
        globalEnd: 10,
        localStart: 0,
        localEnd: 5,
      },
      {
        detailId: 42,
        pageIndex: 2,
        globalStart: 10,
        globalEnd: 11,
        localStart: 0,
        localEnd: 1,
      },
    ]);
  });

  it("ignores invalid and out-of-bounds ranges", () => {
    const pageRanges = buildPageTextRanges(["Hello", "World"]);

    expect(getDetailPageSegments({ id: 1, startIndex: -1, endIndex: 3 }, pageRanges)).toEqual([]);
    expect(getDetailPageSegments({ id: 2, startIndex: 2, endIndex: 2 }, pageRanges)).toEqual([]);
    expect(getDetailPageSegments({ id: 3, startIndex: 0, endIndex: 20 }, pageRanges)).toEqual([]);
  });

  it("buckets spans into the same visual line when vertical drift is small", () => {
    const lines = bucketSpanMetricsIntoLines([
      { domIndex: 0, top: 12, left: 140, height: 20 },
      { domIndex: 1, top: 10, left: 20, height: 20 },
      { domIndex: 2, top: 15, left: 220, height: 20 },
      { domIndex: 3, top: 48, left: 30, height: 20 },
    ]);

    expect(lines).toHaveLength(2);
    expect(lines[0].items).toHaveLength(3);
    expect(lines[1].items).toHaveLength(1);
  });

  it("creates span refs from the text layer in visual reading order", () => {
    const textLayer = createTextLayer([
      { text: "SUMMARY", left: 0, top: 160 },
      { text: "ĐẶNG", left: 160, top: 8 },
      { text: " MAI", left: 240, top: 10 },
      { text: " ANH TÚ", left: 320, top: 11 },
    ]);

    expect(buildTextLayerSpanRefs(textLayer).map((span) => ({
      text: span.textContent,
      lineKey: span.lineKey,
      start: span.spanStart,
      end: span.spanEnd,
    }))).toEqual([
      { text: "ĐẶNG", lineKey: 0, start: 0, end: 4 },
      { text: " MAI", lineKey: 0, start: 4, end: 8 },
      { text: " ANH TÚ", lineKey: 0, start: 8, end: 15 },
      { text: "SUMMARY", lineKey: 1, start: 15, end: 22 },
    ]);
  });

  it("maps range zero to the first visual text even when DOM order is wrong", () => {
    const textLayer = createTextLayer([
      { text: "SUMMARY", left: 0, top: 160 },
      { text: "ĐẶNG", left: 160, top: 8 },
      { text: " MAI", left: 240, top: 10 },
    ]);
    const spans = buildTextLayerSpanRefs(textLayer);
    const firstRange = {
      setStart: jest.fn(),
      setEnd: jest.fn(),
      getClientRects: jest.fn(() => [mockRect({ left: 260, top: 60, width: 48, height: 24 })]),
      getBoundingClientRect: jest.fn(() => mockRect({ left: 260, top: 60, width: 48, height: 24 })),
    };
    const secondRange = {
      setStart: jest.fn(),
      setEnd: jest.fn(),
      getClientRects: jest.fn(() => [mockRect({ left: 308, top: 60, width: 64, height: 24 })]),
      getBoundingClientRect: jest.fn(() => mockRect({ left: 308, top: 60, width: 64, height: 24 })),
    };
    const createRange = jest.fn().mockReturnValueOnce(firstRange).mockReturnValueOnce(secondRange);

    collectHighlightAreasForSegment({
      pageIndex: 0,
      localStart: 0,
      localEnd: 8,
      pageRegistry: {
        textLayerElement: textLayer,
        spans,
      },
      createRange,
    });

    expect(createRange).toHaveBeenCalledTimes(2);
    expect(firstRange.setStart).toHaveBeenCalledWith(spans[0].textNode, 0);
    expect(firstRange.setEnd).toHaveBeenCalledWith(spans[0].textNode, spans[0].textContent.length);
    expect(secondRange.setStart).toHaveBeenCalledWith(spans[1].textNode, 0);
    expect(secondRange.setEnd).toHaveBeenCalledWith(spans[1].textNode, spans[1].textContent.length);
    expect(spans[0].textContent).toBe("ĐẶNG");
  });

  it("collects overlapping span segments without crossing unrelated DOM nodes", () => {
    const spans = [
      { textContent: "ĐẶNG", spanStart: 0, spanEnd: 4 },
      { textContent: " MAI", spanStart: 4, spanEnd: 8 },
      { textContent: "SUMMARY", spanStart: 8, spanEnd: 15 },
    ];

    expect(getOverlappingSpanSegments(spans, 0, 8)).toEqual([
      {
        span: spans[0],
        startOffsetInSpan: 0,
        endOffsetInSpan: 4,
      },
      {
        span: spans[1],
        startOffsetInSpan: 0,
        endOffsetInSpan: 4,
      },
    ]);
  });

  it("collects highlight areas across multiple spans and client rects", () => {
    const textLayer = createTextLayer([
      { text: "Hello", left: 20, top: 20 },
      { text: "World", left: 80, top: 22 },
    ]);
    const spans = buildTextLayerSpanRefs(textLayer);
    const firstRange = {
      setStart: jest.fn(),
      setEnd: jest.fn(),
      getClientRects: jest.fn(() => [
        mockRect({ left: 110, top: 70, width: 40, height: 18 }),
      ]),
      getBoundingClientRect: jest.fn(() => mockRect({ left: 110, top: 70, width: 40, height: 18 })),
    };
    const secondRange = {
      setStart: jest.fn(),
      setEnd: jest.fn(),
      getClientRects: jest.fn(() => [
        mockRect({ left: 110, top: 94, width: 68, height: 18 }),
      ]),
    };
    const createRange = jest.fn().mockReturnValueOnce(firstRange).mockReturnValueOnce(secondRange);

    const areas = collectHighlightAreasForSegment({
      pageIndex: 0,
      localStart: 2,
      localEnd: 7,
      pageRegistry: {
        textLayerElement: textLayer,
        spans,
      },
      createRange,
    });

    expect(createRange).toHaveBeenCalledTimes(2);
    expect(firstRange.setStart).toHaveBeenCalledWith(spans[0].textNode, 2);
    expect(firstRange.setEnd).toHaveBeenCalledWith(spans[0].textNode, spans[0].textContent.length);
    expect(secondRange.setStart).toHaveBeenCalledWith(spans[1].textNode, 0);
    expect(secondRange.setEnd).toHaveBeenCalledWith(spans[1].textNode, 2);
    expect(areas).toHaveLength(2);
    expect(areas[0].pageIndex).toBe(0);
    expect(areas[0].left).toBeCloseTo(5);
    expect(areas[0].top).toBeCloseTo(5);
    expect(areas[0].width).toBeCloseTo(20);
    expect(areas[0].height).toBeCloseTo(4.5);
    expect(areas[1].top).toBeCloseTo(11);
  });
});
