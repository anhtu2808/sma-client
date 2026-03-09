import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayerRenderStatus, Viewer, Worker } from "@react-pdf-viewer/core";
import { Trigger, highlightPlugin } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import Loading from "@/components/Loading";
import SuggestModal from "../suggest-modal";
import {
  buildPageTextRanges,
  buildTextLayerSpanRefs,
  collectHighlightAreasForSegment,
  getDetailPageSegments,
  getHighlightToneClassName,
  getHoverModalStyle,
} from "./highlight-utils";

const PDF_WORKER_URL = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
const HOVER_CLOSE_DELAY_MS = 140;

const hasSuggestions = (detail) => Array.isArray(detail?.suggestions) && detail.suggestions.length > 0;

const findHighlightEntry = (highlightEntriesByPage, hoverAnchor) => {
  if (!hoverAnchor) {
    return null;
  }

  const pageEntries = highlightEntriesByPage.get(hoverAnchor.pageIndex) || [];

  return (
    pageEntries.find(
      (entry) => entry.detailId === hoverAnchor.detailId && entry.areaIndex === hoverAnchor.areaIndex
    ) || null
  );
};

const extractDocumentPageTexts = async (doc) => {
  const pageTexts = await Promise.all(
    Array.from({ length: doc.numPages }, async (_, pageIndex) => {
      const page = await doc.getPage(pageIndex + 1);
      const textContent = await page.getTextContent();

      return textContent.items.map((item) => item?.str ?? "").join("");
    })
  );

  return buildPageTextRanges(pageTexts);
};

const createRenderedPageRegistry = (pageIndex, textLayerElement) => ({
  pageIndex,
  textLayerElement,
  spans: buildTextLayerSpanRefs(textLayerElement),
});

const PdfViewer = ({ resumeUrl, activeDetails = [], renderError }) => {
  const [pageTextRanges, setPageTextRanges] = useState([]);
  const [textLayerRegistries, setTextLayerRegistries] = useState(() => new Map());
  const [highlightEntriesByPage, setHighlightEntriesByPage] = useState(() => new Map());
  const [hoveredDetailId, setHoveredDetailId] = useState(null);
  const [hoverAnchor, setHoverAnchor] = useState(null);

  const closeTimerRef = useRef(null);
  const documentLoadRunIdRef = useRef(0);
  const renderHighlightsRef = useRef(() => null);

  const clearHoverCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeHoverOverlay = useCallback(() => {
    clearHoverCloseTimer();
    setHoveredDetailId(null);
    setHoverAnchor(null);
  }, [clearHoverCloseTimer]);

  const scheduleHoverOverlayClose = useCallback(() => {
    clearHoverCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      closeHoverOverlay();
    }, HOVER_CLOSE_DELAY_MS);
  }, [clearHoverCloseTimer, closeHoverOverlay]);

  const openHoverOverlay = useCallback((entry) => {
    clearHoverCloseTimer();
    setHoveredDetailId(entry.detailId);
    setHoverAnchor({
      detailId: entry.detailId,
      pageIndex: entry.pageIndex,
      areaIndex: entry.areaIndex,
    });
  }, [clearHoverCloseTimer]);

  const registryPlugin = useMemo(
    () => ({
      onDocumentLoad: async ({ doc }) => {
        const runId = ++documentLoadRunIdRef.current;

        closeHoverOverlay();
        startTransition(() => {
          setPageTextRanges([]);
          setTextLayerRegistries(new Map());
          setHighlightEntriesByPage(new Map());
        });

        try {
          const nextPageTextRanges = await extractDocumentPageTexts(doc);

          if (runId !== documentLoadRunIdRef.current) {
            return;
          }

          startTransition(() => {
            setPageTextRanges(nextPageTextRanges);
          });
        } catch {
          if (runId !== documentLoadRunIdRef.current) {
            return;
          }

          startTransition(() => {
            setPageTextRanges([]);
          });
        }
      },
      onTextLayerRender: ({ ele, pageIndex, status }) => {
        if (status !== LayerRenderStatus.DidRender) {
          return;
        }

        startTransition(() => {
          setTextLayerRegistries((previousRegistries) => {
            const nextRegistries = new Map(previousRegistries);
            nextRegistries.set(pageIndex, createRenderedPageRegistry(pageIndex, ele));
            return nextRegistries;
          });
        });
      },
    }),
    [closeHoverOverlay]
  );

  const highlightPluginInstance = highlightPlugin({
    trigger: Trigger.None,
    renderHighlights: (props) => renderHighlightsRef.current(props),
  });

  useEffect(() => {
    return () => {
      clearHoverCloseTimer();
      documentLoadRunIdRef.current += 1;
    };
  }, [clearHoverCloseTimer]);

  useEffect(() => {
    if (activeDetails.length === 0 || pageTextRanges.length === 0 || textLayerRegistries.size === 0) {
      startTransition(() => {
        setHighlightEntriesByPage(new Map());
      });
      closeHoverOverlay();
      return;
    }

    const nextHighlightEntriesByPage = new Map();

    activeDetails.forEach((detail) => {
      const detailSegments = getDetailPageSegments(detail, pageTextRanges);

      detailSegments.forEach((segment) => {
        const pageRegistry = textLayerRegistries.get(segment.pageIndex);

        if (!pageRegistry) {
          return;
        }

        const highlightAreas = collectHighlightAreasForSegment({
          pageIndex: segment.pageIndex,
          localStart: segment.localStart,
          localEnd: segment.localEnd,
          pageRegistry,
        });

        if (highlightAreas.length === 0) {
          return;
        }

        const pageEntries = nextHighlightEntriesByPage.get(segment.pageIndex) || [];

        highlightAreas.forEach((area, areaIndex) => {
          pageEntries.push({
            area,
            areaIndex,
            detail,
            detailId: detail.id,
            pageIndex: segment.pageIndex,
          });
        });

        nextHighlightEntriesByPage.set(segment.pageIndex, pageEntries);
      });
    });

    startTransition(() => {
      setHighlightEntriesByPage(nextHighlightEntriesByPage);
    });
  }, [activeDetails, closeHoverOverlay, pageTextRanges, textLayerRegistries]);

  useEffect(() => {
    if (!hoverAnchor) {
      return;
    }

    const hoveredEntry = findHighlightEntry(highlightEntriesByPage, hoverAnchor);

    if (!hoveredEntry) {
      closeHoverOverlay();
    }
  }, [closeHoverOverlay, highlightEntriesByPage, hoverAnchor]);

  renderHighlightsRef.current = ({ getCssProperties, pageIndex, rotation }) => {
    const pageEntries = highlightEntriesByPage.get(pageIndex) || [];
    const hoveredEntry = findHighlightEntry(highlightEntriesByPage, hoverAnchor);
    const modalEntry = hoveredEntry?.pageIndex === pageIndex ? hoveredEntry : null;
    const pageRegistry = textLayerRegistries.get(pageIndex);

    return (
      <>
        {pageEntries.map((entry) => {
          const isHovered = hoveredDetailId === entry.detailId;
          const entryHasSuggestions = hasSuggestions(entry.detail);

          return (
            <div
              key={`${entry.detailId}-${entry.pageIndex}-${entry.areaIndex}`}
              className={`rounded-[4px] ring-inset transition-colors ${
                entryHasSuggestions ? "cursor-pointer" : "pointer-events-none"
              } ${getHighlightToneClassName(entry.detail?.status, isHovered)}`}
              style={{
                ...getCssProperties(entry.area, rotation),
                zIndex: isHovered ? 2 : 1,
              }}
              title={entry.detail?.label || "Resume highlight"}
              onMouseEnter={entryHasSuggestions ? () => openHoverOverlay(entry) : undefined}
              onMouseLeave={entryHasSuggestions ? scheduleHoverOverlayClose : undefined}
            />
          );
        })}

        {modalEntry ? (
          <div
            className="absolute z-10"
            style={getHoverModalStyle({
              area: modalEntry.area,
              textLayerElement: pageRegistry?.textLayerElement,
            })}
          >
            <SuggestModal
              suggestions={modalEntry.detail?.suggestions || []}
              className="w-full"
              onCancel={closeHoverOverlay}
              onConfirm={closeHoverOverlay}
              onMouseEnter={clearHoverCloseTimer}
              onMouseLeave={scheduleHoverOverlayClose}
            />
          </div>
        ) : null}
      </>
    );
  };

  return (
    <div className="mx-auto flex h-full w-full flex-col">
      <div className="flex-1 overflow-hidden border border-neutral-200 bg-white shadow-soft">
        <div className="h-full w-full">
          <Worker workerUrl={PDF_WORKER_URL}>
            <Viewer
              fileUrl={resumeUrl}
              plugins={[registryPlugin, highlightPluginInstance]}
              renderLoader={() => <Loading size={88} className="h-full py-0" />}
              renderError={renderError}
            />
          </Worker>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
