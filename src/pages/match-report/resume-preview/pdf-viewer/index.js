import { startTransition, useCallback, useEffect, useMemo, useRef,
   useState } from "react";
import toastMessage from "@/utils/toastMessage";
import { useDispatch, useSelector } from "react-redux";
import {
  focusItemWithTabSwitch,
  toggleDetailFixed,
  updateSuggestion,
} from "@/store/slices/matchingReportSlice";
import {
  useMarkDetailAsFixedMutation,
  useRegenerateSuggestionMutation,
} from "@/apis/matchingApi";
import { getErrorMessage } from "@/constant/attachment";
import { LayerRenderStatus, Viewer, Worker } from "@react-pdf-viewer/core";
import { Trigger, highlightPlugin } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import Loading from "@/components/Loading";
import SuggestModal from "../suggest-modal";
import {
  buildTextLayerSpanRefs,
  collectHighlightAreasForSegment,
  getDetailPageSegments,
  getHighlightToneClassName,
  getHoverModalStyle,
} from "./highlight-utils";

const PDF_WORKER_URL = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const hasContent = (detail) =>
  !!detail?.description || (Array.isArray(detail?.suggestions) && detail.suggestions.length > 0);

const findHighlightEntry = (highlightEntriesByPage, hoverAnchor) => {
  if (!hoverAnchor) {
    return null;
  }

  const pageEntries = highlightEntriesByPage.get(hoverAnchor.pageIndex) || [];

  return pageEntries.find((entry) => entry.id === hoverAnchor.entryId) || null;
};

const createRenderedPageRegistry = (pageIndex, textLayerElement) => {
  const spans = buildTextLayerSpanRefs(textLayerElement);

  return {
    pageIndex,
    pageText: spans.map((span) => span.textContent).join(""),
    textLayerElement,
    spans,
  };
};

const PdfViewer = ({ resumeUrl, activeDetails = [], renderError }) => {
  const [textLayerRegistries, setTextLayerRegistries] = useState(() => new Map());
  const [highlightEntriesByPage, setHighlightEntriesByPage] = useState(() => new Map());
  const [hoveredDetailId, setHoveredDetailId] = useState(null);
  const [hoverAnchor, setHoverAnchor] = useState(null);
  const [regeneratingSuggestionId, setRegeneratingSuggestionId] = useState(null);
  const [markingDetailId, setMarkingDetailId] = useState(null);
  const dispatch = useDispatch();
  const focusedItemId = useSelector((state) => state.matchingReport.ui.focusedItemId);
  const [regenerateSuggestion] = useRegenerateSuggestionMutation();
  const [markDetailAsFixed] = useMarkDetailAsFixedMutation();

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



  const openHoverOverlay = useCallback((entry) => {
    clearHoverCloseTimer();
    setHoveredDetailId(entry.detailId);
    setHoverAnchor({
      entryId: entry.id,
      pageIndex: entry.pageIndex,
    });
  }, [clearHoverCloseTimer]);

  const handleRegenerateSuggestion = async (suggestionId) => {
    if (regeneratingSuggestionId != null || !Number.isFinite(Number(suggestionId))) {
      return;
    }

    setRegeneratingSuggestionId(suggestionId);

    try {
      const updatedSuggestion = await regenerateSuggestion({ suggestionId }).unwrap();
      if (!Number.isFinite(Number(updatedSuggestion?.id)) || typeof updatedSuggestion?.suggestion !== "string") {
        throw new Error("Invalid suggestion response.");
      }
      dispatch(updateSuggestion(updatedSuggestion));
      toastMessage.success("Suggestion regenerated successfully.");
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Unable to regenerate suggestion."));
    } finally {
      setRegeneratingSuggestionId(null);
    }
  };

  const handleMarkAsFixed = async (detail) => {
    if (!detail?.id || detail?.isFixed || markingDetailId != null) {
      return;
    }

    setMarkingDetailId(detail.id);

    try {
      await markDetailAsFixed({ detailId: detail.id }).unwrap();
      dispatch(toggleDetailFixed({ detailId: detail.id }));
      closeHoverOverlay();
      toastMessage.success("Marked as fixed successfully.");
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Unable to mark this item as fixed."));
    } finally {
      setMarkingDetailId(null);
    }
  };

  const registryPlugin = useMemo(
    () => ({
      onDocumentLoad: () => {
        documentLoadRunIdRef.current += 1;
        closeHoverOverlay();
        startTransition(() => {
          setTextLayerRegistries(new Map());
          setHighlightEntriesByPage(new Map());
        });
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
    if (activeDetails.length === 0 || textLayerRegistries.size === 0) {
      startTransition(() => {
        setHighlightEntriesByPage(new Map());
      });
      closeHoverOverlay();
      return;
    }

    const nextHighlightEntriesByPage = new Map();
    const renderedPages = Array.from(textLayerRegistries.values()).sort(
      (leftPage, rightPage) => leftPage.pageIndex - rightPage.pageIndex
    );

    activeDetails.forEach((detail) => {
      renderedPages.forEach((pageRegistry) => {
        if (!pageRegistry.pageText) {
          return;
        }

        const detailSegments = getDetailPageSegments(
          detail,
          [
            {
              pageIndex: pageRegistry.pageIndex,
              pageText: pageRegistry.pageText,
              pageCharStart: 0,
              pageCharEnd: pageRegistry.pageText.length,
            },
          ],
          pageRegistry.pageText
        );

        if (detailSegments.length === 0) {
          return;
        }

        detailSegments.forEach((segment) => {
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
              id: `${detail.id}-${segment.matchIndex}-${segment.globalStart}-${segment.globalEnd}-${segment.pageIndex}-${areaIndex}`,
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
    });

    startTransition(() => {
      setHighlightEntriesByPage(nextHighlightEntriesByPage);
    });
  }, [activeDetails, closeHoverOverlay, textLayerRegistries]);

  useEffect(() => {
    if (!hoverAnchor) {
      return;
    }

    const hoveredEntry = findHighlightEntry(highlightEntriesByPage, hoverAnchor);

    if (!hoveredEntry) {
      closeHoverOverlay();
    }
  }, [closeHoverOverlay, highlightEntriesByPage, hoverAnchor]);

  useEffect(() => {
    if (!focusedItemId) return;

    // Find the first highlight element for this detail ID
    const element = document.querySelector(`[data-detail-id="${focusedItemId}"]`);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [focusedItemId, dispatch]);

  renderHighlightsRef.current = ({ getCssProperties, pageIndex, rotation }) => {
    const pageEntries = highlightEntriesByPage.get(pageIndex) || [];
    const hoveredEntry = findHighlightEntry(highlightEntriesByPage, hoverAnchor);
    const modalEntry = hoveredEntry?.pageIndex === pageIndex ? hoveredEntry : null;
    const pageRegistry = textLayerRegistries.get(pageIndex);

    return (
      <>
        {pageEntries.map((entry) => {
          const isHovered = hoveredDetailId === entry.detailId;
          const isFocused = focusedItemId === entry.detailId;
          const entryHasContent = hasContent(entry.detail);

          return (
            <div
              key={entry.id}
              data-detail-id={entry.detailId}
              className={`rounded-[4px] ring-inset transition-all duration-300 ${
                entryHasContent ? "cursor-pointer" : "pointer-events-none"
              } ${getHighlightToneClassName(entry.detail?.status, isHovered || isFocused)} ${
                isFocused ? "ring-2 scale-[1.02] shadow-lg z-[3]" : ""
              }`}
              style={{
                ...getCssProperties(entry.area, rotation),
                zIndex: isHovered || isFocused ? 2 : 1,
              }}
              title={entry.detail?.label || "Resume highlight"}
              onClick={
                entryHasContent
                  ? (e) => {
                      e.stopPropagation();
                      openHoverOverlay(entry);
                      dispatch(focusItemWithTabSwitch(entry.detailId));
                      
                      // Smoothly scroll the sidebar item into view
                      // We give it a slightly longer timeout so that if the sidebar had to 
                      // switch tabs, React has enough time to mount the new elements first
                      setTimeout(() => {
                        const sidebarItem = document.getElementById(`sidebar-item-${entry.detailId}`);
                        if (sidebarItem) {
                          sidebarItem.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                      }, 250);
                    }
                  : undefined
              }
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
              status={modalEntry.detail?.status}
              isFixed={modalEntry.detail?.isFixed}
              description={modalEntry.detail?.description}
              suggestions={modalEntry.detail?.suggestions || []}
              onRegenerateSuggestion={handleRegenerateSuggestion}
              regeneratingSuggestionId={regeneratingSuggestionId}
              isMarkingFixed={markingDetailId === modalEntry.detail?.id}
              className="w-full"
              onCancel={(e) => { e.stopPropagation(); closeHoverOverlay(); }}
              onConfirm={(e) => {
                e.stopPropagation();
                void handleMarkAsFixed(modalEntry.detail);
              }}
            />
          </div>
        ) : null}
      </>
    );
  };

  return (
    <div className="mx-auto flex h-full w-full flex-col">
      <div 
        className="flex-1 overflow-hidden border border-neutral-200 bg-white shadow-soft"
        onClick={closeHoverOverlay}
      >
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
