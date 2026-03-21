import { useState } from "react";
import toastMessage from "@/utils/toastMessage";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleExpandedItemId,
  setFocusedItemId,
  toggleDetailFixed,
  updateSuggestion,
  updateScoresAfterFixed,
} from "@/store/slices/matchingReportSlice";
import {
  useMarkDetailAsFixedMutation,
  useRegenerateSuggestionMutation,
} from "@/apis/matchingApi";
import { getErrorMessage } from "@/constant/attachment";
import Suggestions from "../suggestions";

const getStatusConfig = (status) => {
  if (status === "MISSING" || status === "missing") {
    return {
      icon: "cancel",
      iconClassName: "text-red-500",
      tagClassName: "text-sm font-medium text-neutral-900",
      progressClassName:
        "inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600",
    };
  }

  return {
    icon: "check_circle",
    iconClassName: "text-emerald-500",
    tagClassName:
      "rounded border border-emerald-200 bg-emerald-100 px-2 py-1 text-sm font-medium text-emerald-700",
    progressClassName: "inline-flex items-center gap-1 text-xs text-neutral-500",
  };
};

const ContentDetail = ({ item, isLast }) => {
  const dispatch = useDispatch();
  const expandedItemIds = useSelector((state) => state.matchingReport.ui.expandedItemIds);
  const isFocused = useSelector((state) => state.matchingReport.ui.focusedItemId === item.id);
  const [regenerateSuggestion] = useRegenerateSuggestionMutation();
  const [markDetailAsFixed] = useMarkDetailAsFixedMutation();
  const [regeneratingSuggestionId, setRegeneratingSuggestionId] = useState(null);
  const [isMarkingFixed, setIsMarkingFixed] = useState(false);

  const statusConfig = getStatusConfig(item.status);
  const hasSuggestions = Array.isArray(item.suggestions) && item.suggestions.length > 0;
  const isExpanded = expandedItemIds.includes(item.id);
  const isPositiveStatus = item.status === "FIXED" || item.status === "fixed" || item.status === "MATCHED" || item.status === "matched" || item.isFixed;
  const canMarkAsFixed = hasSuggestions && !item.isFixed && !isPositiveStatus && !isMarkingFixed;
  const canRegenerate = !item.isFixed && !isPositiveStatus;

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
      const response = await markDetailAsFixed({ detailId: item.id }).unwrap();
      dispatch(toggleDetailFixed({ detailId: item.id }));
      
      // Update scores if response contains score data
      if (response) {
        dispatch(updateScoresAfterFixed({
          afterOverallScore: response.afterOverallScore,
          criteriaScoreId: response.criteriaScoreId,
          afterCriteriaScore: response.afterCriteriaScore,
        }));
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
    return isPositiveStatus
      ? { bg: "bg-emerald-50/80 shadow-[inset_4px_0_0_0_rgba(16,185,129,1)]", text: "text-emerald-700" }
      : { bg: "bg-orange-50/80 shadow-[inset_4px_0_0_0_rgba(249,115,22,1)]", text: "text-primary" };
  };

  const focusStyles = getFocusClasses();

  const rowContent = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <span className={`material-icons-round text-[18px] ${statusConfig.iconClassName}`}>
          {statusConfig.icon}
        </span>
        {item.status === "FIXED" || item.status === "fixed" ? (
          <span className={statusConfig.tagClassName}>{item.label}</span>
        ) : (
          <span className={`text-sm font-medium ${isFocused ? focusStyles.text : "text-neutral-900"}`}>{item.label}</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {hasSuggestions && (
          <button
            type="button"
            disabled={!canMarkAsFixed}
            onClick={handleMarkAsFixed}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold transition-all ring-1 ring-inset disabled:cursor-not-allowed disabled:opacity-70 ${
              item.isFixed
                ? "bg-emerald-50 text-emerald-600 ring-emerald-600/20"
                : "bg-white text-neutral-500 ring-neutral-200 hover:bg-neutral-50 hover:text-neutral-900"
            }`}
          >
            <span className={`material-icons-round text-[14px] ${isMarkingFixed ? "animate-spin" : ""}`}>
              {isMarkingFixed ? "autorenew" : item.isFixed ? "check_circle" : "check_circle_outline"}
            </span>
            <span className="whitespace-nowrap">{item.isFixed ? "Fixed" : "Fix"}</span>
          </button>
        )}
        
        {(hasSuggestions || item.description) ? (
          <span
            className={`material-icons-round text-sm text-neutral-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        ) : null}
      </div>
    </>
  );

  return (
    <div 
      id={`sidebar-item-${item.id}`} 
      className={`transition-all duration-500 ${isLast ? "" : "border-b border-neutral-200"} ${
        isFocused ? focusStyles.bg : "bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() => {
          const willExpand = !isExpanded;
          dispatch(toggleExpandedItemId(item.id));
          if (willExpand) {
            dispatch(setFocusedItemId(item.id));
          }
        }}
        className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors ${
          isFocused ? "" : "hover:bg-neutral-50"
        }`}
      >
        {rowContent}
      </button>

      {item.description && isExpanded ? (
        <div className={`px-4 pb-3 pl-11 text-[13.5px] text-neutral-700 leading-relaxed ${isFocused ? "bg-transparent" : "bg-white"}`}>
          {item.description}
        </div>
      ) : null}

      {hasSuggestions && isExpanded ? (
        <Suggestions 
          itemKey={item.id} 
          suggestions={item.suggestions} 
          isFocused={isFocused}
          canRegenerate={canRegenerate}
          regeneratingSuggestionId={regeneratingSuggestionId}
          onRegenerateSuggestion={handleRegenerateSuggestion}
        />
      ) : null}
    </div>
  );
};

export default ContentDetail;
