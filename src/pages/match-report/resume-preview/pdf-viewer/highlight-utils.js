const TEXT_LAYER_SELECTOR = ".rpv-core__text-layer-text";
const TEXT_NODE_TYPE = typeof Node === "undefined" ? 3 : Node.TEXT_NODE;

export const HOVER_MODAL_WIDTH_PX = 400;
export const HOVER_MODAL_MIN_WIDTH_PX = 220;
export const HOVER_MODAL_ESTIMATED_HEIGHT_PX = 280;
export const HOVER_MODAL_GAP_PX = 12;
export const HOVER_MODAL_SIDE_PADDING_PX = 8;

const clamp = (value, min, max) => {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
};

const getMedian = (values = []) => {
  if (!Array.isArray(values) || values.length === 0) {
    return 0;
  }

  const sortedValues = [...values].sort((left, right) => left - right);
  const middleIndex = Math.floor(sortedValues.length / 2);

  if (sortedValues.length % 2 === 0) {
    return (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
  }

  return sortedValues[middleIndex];
};

export const getVisualLineTolerance = (spanMetrics = []) => {
  const heights = spanMetrics
    .map((spanMetric) => Number(spanMetric?.height) || 0)
    .filter((height) => height > 0);

  return Math.max(2, getMedian(heights) * 0.35);
};

const sortByVisualTop = (leftSpan, rightSpan) =>
  leftSpan.top - rightSpan.top || leftSpan.left - rightSpan.left || leftSpan.domIndex - rightSpan.domIndex;

const sortByVisualLeft = (leftSpan, rightSpan) =>
  leftSpan.left - rightSpan.left || leftSpan.top - rightSpan.top || leftSpan.domIndex - rightSpan.domIndex;

export const normalizeDetailRange = (detail) => {
  const startIndex = Number.parseInt(detail?.startIndex, 10);
  const endIndex = Number.parseInt(detail?.endIndex, 10);

  if (!Number.isInteger(startIndex) || !Number.isInteger(endIndex)) {
    return null;
  }

  if (startIndex < 0 || endIndex <= startIndex) {
    return null;
  }

  return { startIndex, endIndex };
};

export const buildPageTextRanges = (pageTexts = []) => {
  let cursor = 0;

  return pageTexts.map((pageText = "", pageIndex) => {
    const normalizedText = typeof pageText === "string" ? pageText : "";
    const pageCharStart = cursor;
    const pageCharEnd = pageCharStart + normalizedText.length;

    cursor = pageCharEnd;

    return {
      pageIndex,
      pageText: normalizedText,
      pageCharStart,
      pageCharEnd,
    };
  });
};

export const getDetailPageSegments = (detail, pageTextRanges = []) => {
  const normalizedRange = normalizeDetailRange(detail);

  if (!normalizedRange || pageTextRanges.length === 0) {
    return [];
  }

  const documentLength = pageTextRanges[pageTextRanges.length - 1]?.pageCharEnd ?? 0;

  if (normalizedRange.endIndex > documentLength) {
    return [];
  }

  return pageTextRanges.reduce((segments, pageRange) => {
    const overlapStart = Math.max(normalizedRange.startIndex, pageRange.pageCharStart);
    const overlapEnd = Math.min(normalizedRange.endIndex, pageRange.pageCharEnd);

    if (overlapEnd <= overlapStart) {
      return segments;
    }

    segments.push({
      detailId: detail.id,
      pageIndex: pageRange.pageIndex,
      globalStart: overlapStart,
      globalEnd: overlapEnd,
      localStart: overlapStart - pageRange.pageCharStart,
      localEnd: overlapEnd - pageRange.pageCharStart,
    });

    return segments;
  }, []);
};

const getSpanTextNode = (spanElement) => {
  if (!spanElement) return null;

  return Array.from(spanElement.childNodes).find((node) => node.nodeType === TEXT_NODE_TYPE) || null;
};

export const bucketSpanMetricsIntoLines = (spanMetrics = [], tolerance = getVisualLineTolerance(spanMetrics)) => {
  const sortedSpanMetrics = [...spanMetrics].sort(sortByVisualTop);

  return sortedSpanMetrics.reduce((lines, spanMetric) => {
    const lastLine = lines[lines.length - 1];

    if (!lastLine || Math.abs(spanMetric.top - lastLine.top) > tolerance) {
      lines.push({
        top: spanMetric.top,
        items: [spanMetric],
      });
      return lines;
    }

    const nextCount = lastLine.items.length + 1;
    lastLine.top = (lastLine.top * lastLine.items.length + spanMetric.top) / nextCount;
    lastLine.items.push(spanMetric);
    return lines;
  }, []);
};

export const buildTextLayerSpanRefs = (textLayerElement) => {
  if (!textLayerElement) {
    return [];
  }

  const textLayerRect = textLayerElement.getBoundingClientRect();
  const spanMetrics = Array.from(textLayerElement.querySelectorAll(TEXT_LAYER_SELECTOR)).reduce(
    (metrics, spanElement, domIndex) => {
      const textNode = getSpanTextNode(spanElement);
      const textContent = textNode?.textContent ?? spanElement.textContent ?? "";
      const spanLength = textContent.length;

      if (!textNode || spanLength === 0) {
        return metrics;
      }

      const spanRect = spanElement.getBoundingClientRect();

      metrics.push({
        domIndex,
        element: spanElement,
        height: spanRect.height,
        left: spanRect.left - textLayerRect.left,
        textContent,
        textNode,
        top: spanRect.top - textLayerRect.top,
        width: spanRect.width,
      });

      return metrics;
    },
    []
  );

  const visualLines = bucketSpanMetricsIntoLines(spanMetrics);
  let cursor = 0;

  return visualLines.flatMap((line, lineIndex) =>
    [...line.items].sort(sortByVisualLeft).map((spanMetric) => {
      const spanLength = spanMetric.textContent.length;
      const spanRef = {
        element: spanMetric.element,
        height: spanMetric.height,
        left: spanMetric.left,
        lineKey: lineIndex,
        textContent: spanMetric.textContent,
        textNode: spanMetric.textNode,
        top: spanMetric.top,
        width: spanMetric.width,
        spanStart: cursor,
        spanEnd: cursor + spanLength,
      };

      cursor += spanLength;
      return spanRef;
    })
  );
};

export const resolvePageOffsetBoundary = (spans, pageOffset) => {
  if (!Array.isArray(spans) || spans.length === 0) {
    return null;
  }

  const pageLength = spans[spans.length - 1].spanEnd;
  const clampedOffset = clamp(pageOffset, 0, pageLength);

  for (const span of spans) {
    if (clampedOffset <= span.spanEnd) {
      return {
        span,
        textNode: span.textNode,
        offsetInSpan: clampedOffset - span.spanStart,
      };
    }
  }

  const lastSpan = spans[spans.length - 1];
  return {
    span: lastSpan,
    textNode: lastSpan.textNode,
    offsetInSpan: lastSpan.textContent.length,
  };
};

const normalizeRectToArea = ({ rect, containerRect, pageIndex }) => {
  if (!rect || rect.width <= 0 || rect.height <= 0 || containerRect.width <= 0 || containerRect.height <= 0) {
    return null;
  }

  return {
    pageIndex,
    left: ((rect.left - containerRect.left) / containerRect.width) * 100,
    top: ((rect.top - containerRect.top) / containerRect.height) * 100,
    width: (rect.width / containerRect.width) * 100,
    height: (rect.height / containerRect.height) * 100,
  };
};

export const getOverlappingSpanSegments = (spans, localStart, localEnd) => {
  if (!Array.isArray(spans) || spans.length === 0 || localEnd <= localStart) {
    return [];
  }

  return spans.reduce((segments, span) => {
    const overlapStart = Math.max(localStart, span.spanStart);
    const overlapEnd = Math.min(localEnd, span.spanEnd);

    if (overlapEnd <= overlapStart) {
      return segments;
    }

    segments.push({
      span,
      startOffsetInSpan: overlapStart - span.spanStart,
      endOffsetInSpan: overlapEnd - span.spanStart,
    });

    return segments;
  }, []);
};

export const collectHighlightAreasForSegment = ({
  pageIndex,
  localStart,
  localEnd,
  pageRegistry,
  createRange = () => document.createRange(),
}) => {
  if (!pageRegistry?.textLayerElement || !Array.isArray(pageRegistry.spans) || pageRegistry.spans.length === 0) {
    return [];
  }

  if (!Number.isInteger(localStart) || !Number.isInteger(localEnd) || localEnd <= localStart) {
    return [];
  }

  const containerRect = pageRegistry.textLayerElement.getBoundingClientRect();
  const overlappingSpanSegments = getOverlappingSpanSegments(pageRegistry.spans, localStart, localEnd);

  if (overlappingSpanSegments.length === 0) {
    return [];
  }

  return overlappingSpanSegments.flatMap((segment) => {
    if (!segment.span?.textNode) {
      return [];
    }

    const range = createRange();

    try {
      range.setStart(segment.span.textNode, segment.startOffsetInSpan);
      range.setEnd(segment.span.textNode, segment.endOffsetInSpan);

      const clientRects = Array.from(range.getClientRects?.() || []);
      const rectsToRender =
        clientRects.length > 0 ? clientRects : [range.getBoundingClientRect?.()].filter(Boolean);

      return rectsToRender
        .map((rect) => normalizeRectToArea({ rect, containerRect, pageIndex }))
        .filter(Boolean);
    } catch {
      return [];
    }
  });
};

export const getHighlightToneClassName = (status, isHovered) => {
  if (status === "missing") {
    return isHovered
      ? "bg-red-300/55 ring-2 ring-red-500/80"
      : "bg-red-300/35 ring-1 ring-red-400/70";
  }

  return isHovered
    ? "bg-emerald-300/50 ring-2 ring-emerald-500/80"
    : "bg-emerald-300/30 ring-1 ring-emerald-500/60";
};

export const getHoverModalStyle = ({ area, textLayerElement }) => {
  if (!area || !textLayerElement) {
    return {
      left: `${HOVER_MODAL_SIDE_PADDING_PX}px`,
      top: `${HOVER_MODAL_SIDE_PADDING_PX}px`,
      width: `${HOVER_MODAL_WIDTH_PX}px`,
    };
  }

  const pageRect = textLayerElement.getBoundingClientRect();
  const maxModalWidth = Math.max(
    HOVER_MODAL_MIN_WIDTH_PX,
    pageRect.width - HOVER_MODAL_SIDE_PADDING_PX * 2
  );
  const modalWidth = Math.min(HOVER_MODAL_WIDTH_PX, maxModalWidth);
  const anchorCenterX = ((area.left + area.width / 2) / 100) * pageRect.width;
  const defaultTop = ((area.top + area.height) / 100) * pageRect.height + HOVER_MODAL_GAP_PX;
  const estimatedTopAbove =
    (area.top / 100) * pageRect.height - HOVER_MODAL_ESTIMATED_HEIGHT_PX - HOVER_MODAL_GAP_PX;

  const left = clamp(
    anchorCenterX - modalWidth / 2,
    HOVER_MODAL_SIDE_PADDING_PX,
    pageRect.width - modalWidth - HOVER_MODAL_SIDE_PADDING_PX
  );
  const top =
    defaultTop + HOVER_MODAL_ESTIMATED_HEIGHT_PX <= pageRect.height - HOVER_MODAL_SIDE_PADDING_PX
      ? defaultTop
      : clamp(
          estimatedTopAbove,
          HOVER_MODAL_SIDE_PADDING_PX,
          pageRect.height - HOVER_MODAL_SIDE_PADDING_PX
        );

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${modalWidth}px`,
  };
};
