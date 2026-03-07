import { useDispatch, useSelector } from "react-redux";
import { toggleExpandedSidebarKey } from "@/store/slices/matchingReportSlice";
import Suggestions from "../suggestions";

const getStatusConfig = (status) => {
  if (status === "missing") {
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

const ContentDetail = ({ item, sectionKey, isLast }) => {
  const dispatch = useDispatch();
  const expandedSidebarKeys = useSelector((state) => state.matchingReport.expandedSidebarKeys);

  const statusConfig = getStatusConfig(item.status);
  const itemKey = `${sectionKey}:${item.key}`;
  const hasSuggestions = Array.isArray(item.suggestions) && item.suggestions.length > 0;
  const isExpanded = expandedSidebarKeys.includes(itemKey);

  const rowContent = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <span className={`material-icons-round text-[18px] ${statusConfig.iconClassName}`}>
          {statusConfig.icon}
        </span>
        {item.asTag ? (
          <span className={statusConfig.tagClassName}>{item.label}</span>
        ) : (
          <span className="text-sm font-medium text-neutral-900">{item.label}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className={statusConfig.progressClassName}>
          <span>{item.progressLabel}</span>
        </div>
        {hasSuggestions ? (
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
    <div className={`${isLast ? "" : "border-b border-neutral-200"}`}>
      {hasSuggestions ? (
        <button
          type="button"
          onClick={() => dispatch(toggleExpandedSidebarKey(itemKey))}
          className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-neutral-50"
        >
          {rowContent}
        </button>
      ) : (
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          {rowContent}
        </div>
      )}

      {hasSuggestions && isExpanded ? (
        <Suggestions itemKey={item.key} suggestions={item.suggestions} />
      ) : null}
    </div>
  );
};

export default ContentDetail;
