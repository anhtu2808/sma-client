import { useContext, useMemo, useState } from "react";
import toastMessage from "@/utils/toastMessage";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleExpandedItemId,
  setFocusedItemId,
  setDetailFixed,
  updateSuggestion,
  updateScoresAfterFixed,
} from "@/store/slices/matchingReportSlice";
import {
  useMarkDetailAsFixedMutation,
  useRegenerateSuggestionMutation,
} from "@/apis/matchingApi";
import { getErrorMessage } from "@/constant/attachment";
import EditorContext from "@/pages/match-report/enhancements/EditorContext";
import { findTextInDoc } from "@/pages/match-report/enhancements/resume-editor/utils/prosemirrorSearch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faChevronDown, faCircleCheck, faCirclePlus, faCircleXmark } from '../../../../../utils/icons';
import Suggestions from "../suggestions";

const getStatusConfig = (status) => {
  if (status === "MISSING" || status === "missing") {
    return {
      icon: faCircleXmark,
      iconClassName: "text-red-500",
      tagClassName: "text-sm font-medium text-neutral-900",
      progressClassName:
        "inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600",
    };
  }

  return {
    icon: faCircleCheck,
    iconClassName: "text-emerald-500",
    tagClassName:
      "rounded border border-emerald-200 bg-emerald-100 px-2 py-1 text-sm font-medium text-emerald-700",
    progressClassName: "inline-flex items-center gap-1 text-xs text-neutral-500",
  };
};

const ContentDetail = ({ items, isLast }) => {
  // Support both old format (single item via `items` array of 1) and context groups
  const isContextGroup = items.length > 0 && items[0].contextId != null;
  const primaryItem = items[0];
  const groupId = primaryItem.contextId ?? primaryItem.id;

  const dispatch = useDispatch();
  const { editor } = useContext(EditorContext);
  const expandedItemIds = useSelector((state) => state.matchingReport.ui.expandedItemIds);
  const isFocused = useSelector((state) => {
    const focusedId = state.matchingReport.ui.focusedItemId;
    return items.some((item) => item.id === focusedId);
  });
  const [regenerateSuggestion] = useRegenerateSuggestionMutation();
  const [markDetailAsFixed] = useMarkDetailAsFixedMutation();
  const [regeneratingSuggestionId, setRegeneratingSuggestionId] = useState(null);
  const [isMarkingFixed, setIsMarkingFixed] = useState(false);

  // If context text is findable in editor, hide "Mark as Fix" — user should use "Rewrite in Editor" instead
  const hasContextInEditor = useMemo(() => {
    if (!editor || !primaryItem.context || editor.isDestroyed) return false;
    try {
      return findTextInDoc(editor.state.doc, primaryItem.context).length > 0;
    } catch {
      return false;
    }
  }, [editor, primaryItem.context, editor?.state?.doc]);

  const allFixed = items.every((item) => item.isFixed);
  const anyPositive = items.some(
    (item) => item.isFixed || item.status === "FIXED" || item.status === "fixed" || item.status === "MATCHED" || item.status === "matched"
  );
  const statusConfig = getStatusConfig(allFixed || anyPositive ? "MATCHED" : primaryItem.status);
  const hasSuggestions = Array.isArray(primaryItem.suggestions) && primaryItem.suggestions.length > 0;
  const isExpanded = expandedItemIds.includes(groupId);
  const canMarkAsFixed = hasSuggestions && !allFixed && !isMarkingFixed;
  const canRegenerate = !allFixed;

  const handleRegenerateSuggestion = async (suggestionId) => {
    if (!canRegenerate || regeneratingSuggestionId != null || !Number.isFinite(Number(suggestionId))) {
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

  const handleMarkAsFixed = async (event) => {
    event.stopPropagation();

    if (!canMarkAsFixed) {
      return;
    }

    setIsMarkingFixed(true);

    try {
      // Mark all details in the group as fixed
      for (const item of items) {
        if (item.isFixed) continue;
        const response = await markDetailAsFixed({ detailId: item.id }).unwrap();
        dispatch(setDetailFixed({ detailId: item.id }));

        if (response) {
          dispatch(updateScoresAfterFixed({
            afterOverallScore: response.afterOverallScore,
            criteriaScoreId: response.criteriaScoreId,
            afterCriteriaScore: response.afterCriteriaScore,
          }));
        }
      }

      toastMessage.success("Marked as fixed successfully.");
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Unable to mark this item as fixed."));
    } finally {
      setIsMarkingFixed(false);
    }
  };

  const getFocusClasses = () => {
    if (!isFocused) return { bg: "bg-white", text: "text-neutral-900" };
    return anyPositive
      ? { bg: "bg-emerald-50/80 shadow-[inset_4px_0_0_0_rgba(16,185,129,1)]", text: "text-emerald-700" }
      : { bg: "bg-orange-50/80 shadow-[inset_4px_0_0_0_rgba(249,115,22,1)]", text: "text-primary" };
  };

  const focusStyles = getFocusClasses();

  // For context groups with multiple items, show labels as chips
  const renderLabel = () => {
    if (isContextGroup && items.length > 1) {
      return (
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap gap-1">
            {[...items].sort((a, b) => a.label.length - b.label.length).map((item) => (
              <span
                key={item.id}
                className={`inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-semibold ${
                  allFixed
                    ? "border-emerald-200 bg-emerald-50 text-emerald-600 line-through decoration-emerald-300"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
              >
                {item.label}
              </span>
            ))}
          </div>
          {primaryItem.context && (
            <p className={`text-sm line-clamp-2 italic ${allFixed ? "text-emerald-500/60" : "text-neutral-600"}`}>
              &ldquo;{primaryItem.context}&rdquo;
            </p>
          )}
        </div>
      );
    }

    // Single item — show label + optional context quote for context-based items
    return (
      <div className="flex min-w-0 flex-col gap-1">
        <span className={`text-sm font-medium ${
          allFixed
            ? "text-emerald-600 line-through decoration-emerald-300"
            : isFocused ? focusStyles.text : "text-neutral-900"
        }`}>
          {primaryItem.label}
        </span>
        {isContextGroup && primaryItem.context && (
          <p className={`text-xs line-clamp-2 italic ${allFixed ? "text-emerald-500/60" : "text-neutral-500"}`}>
            &ldquo;{primaryItem.context}&rdquo;
          </p>
        )}
      </div>
    );
  };

  const rowContent = (
    <>
      <div className="flex min-w-0 items-start gap-3">
        <FontAwesomeIcon
          icon={statusConfig.icon}
          className={`mt-0.5 text-[18px] ${statusConfig.iconClassName}`}
        />
        {renderLabel()}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {hasSuggestions && isExpanded && !hasContextInEditor && (
          <button
            type="button"
            disabled={!canMarkAsFixed}
            onClick={handleMarkAsFixed}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold transition-all ring-1 ring-inset disabled:cursor-not-allowed disabled:opacity-70 ${
              allFixed
                ? "bg-emerald-50 text-emerald-600 ring-emerald-600/20"
                : "bg-white text-neutral-500 ring-neutral-200 hover:bg-neutral-50 hover:text-neutral-900"
            }`}
          >
            <FontAwesomeIcon
              icon={isMarkingFixed ? faArrowsRotate : allFixed ? faCircleCheck : faCirclePlus}
              className={`text-[14px] ${isMarkingFixed ? "animate-spin" : ""}`}
            />
            <span className="whitespace-nowrap">{allFixed ? "Fixed" : "Fix"}</span>
          </button>
        )}

        {(hasSuggestions || items.some((i) => i.description)) ? (
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`text-sm text-neutral-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        ) : null}
      </div>
    </>
  );

  // Collect descriptions from all items in the group
  const descriptions = items
    .filter((item) => item.description)
    .map((item) => ({ id: item.id, label: item.label, description: item.description }));

  return (
    <div
      id={`sidebar-item-${groupId}`}
      className={`transition-all duration-500 ${isLast ? "" : "border-b border-neutral-200"} ${
        isFocused ? focusStyles.bg : allFixed ? "bg-emerald-50/40" : "bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() => {
          const willExpand = !isExpanded;
          dispatch(toggleExpandedItemId(groupId));
          if (willExpand) {
            dispatch(setFocusedItemId(primaryItem.id));
          }
        }}
        className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors ${
          isFocused ? "" : "hover:bg-neutral-50"
        }`}
      >
        {rowContent}
      </button>

      {descriptions.length > 0 && isExpanded ? (
        <div className={`px-4 pb-3 pl-11 ${isFocused ? "bg-transparent" : "bg-white"}`}>
          {descriptions.map((desc) => (
            <div key={desc.id} className="mb-2 last:mb-0">
              {descriptions.length > 1 && (
                <p className="text-sm font-semibold text-neutral-700 mb-0.5">{desc.label}</p>
              )}
              <p className="text-sm text-neutral-800 leading-relaxed">{desc.description}</p>
            </div>
          ))}
        </div>
      ) : null}

      {hasSuggestions && isExpanded ? (
        <Suggestions
          itemKey={groupId}
          suggestions={primaryItem.suggestions}
          isFocused={isFocused}
          canRegenerate={canRegenerate}
          regeneratingSuggestionId={regeneratingSuggestionId}
          onRegenerateSuggestion={handleRegenerateSuggestion}
          context={primaryItem.context}
          detailId={primaryItem.id}
          allDetailIds={items.map((i) => i.id)}
        />
      ) : null}
    </div>
  );
};

export default ContentDetail;
