const SCORE_RING_RADIUS = 32;
const SCORE_RING_CIRCUMFERENCE = 2 * Math.PI * SCORE_RING_RADIUS;

const ScoreRing = ({ score }) => {
  const normalizedScore = Math.max(0, Math.min(100, Number(score || 0)));
  const offset = SCORE_RING_CIRCUMFERENCE * (1 - normalizedScore / 100);

  const getScoreColor = (s) => {
    if (s >= 80) return { stroke: "#10B981", text: "text-emerald-600" };
    if (s >= 60) return { stroke: "#F59E0B", text: "text-amber-600" };
    return { stroke: "#EF4444", text: "text-red-600" };
  };

  const { stroke, text } = getScoreColor(normalizedScore);

  return (
    <div className="relative h-[76px] w-[76px] flex-shrink-0">
      <svg viewBox="0 0 76 76" className="h-full w-full -rotate-90">
        <circle
          cx="38"
          cy="38"
          r={SCORE_RING_RADIUS}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="5"
        />
        <circle
          cx="38"
          cy="38"
          r={SCORE_RING_RADIUS}
          fill="none"
          stroke={stroke}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={SCORE_RING_CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-2xl font-extrabold ${text}`}>{normalizedScore}</span>
      </div>
    </div>
  );
};

const metricToneClassMap = {
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-red-100 text-red-600",
  warning: "bg-amber-100 text-amber-700",
};

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

const MatchReportSidebar = ({
  scoreCard,
  sidebarTabs,
  activeSidebarTab,
  onSidebarTabChange,
  sections,
  expandedSkillKeys,
  onToggleSkill,
}) => {
  return (
    <aside className="flex w-full flex-shrink-0 flex-col border-b border-neutral-200 bg-white xl:h-screen xl:w-[380px] xl:border-b-0 xl:border-r">
      <div className="border-b border-neutral-200 px-4 py-5">
        <div className="flex items-center gap-4">
          <ScoreRing score={scoreCard.score} />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm font-bold text-neutral-900">
              <span className="max-w-[140px] truncate">{scoreCard.companyName}</span>
              <span className="text-neutral-300">/</span>
              <span className="max-w-[140px] truncate">{scoreCard.jobTitle}</span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
              <span className="material-icons-round text-[14px]">description</span>
              <span className="truncate">{scoreCard.resumeTitle}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex border-b border-neutral-200">
        {sidebarTabs.map((tab) => {
          const isActive = tab.key === activeSidebarTab;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSidebarTabChange(tab.key)}
              className={`relative flex-1 border-b-2 px-2 py-3 text-center transition-colors ${
                isActive
                  ? "border-primary"
                  : "border-transparent hover:bg-neutral-50"
              }`}
            >
              <p
                className={`text-sm ${
                  isActive ? "font-semibold text-neutral-900" : "font-medium text-neutral-500"
                }`}
              >
                {tab.label}
              </p>
              <div className="mx-auto mt-1 h-1 w-12 overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.max(0, Math.min(100, tab.progress || 0))}%` }}
                />
              </div>
              {tab.badgeCount ? (
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                  {tab.badgeCount}
                </span>
              ) : null}
            </button>
          );
        })}

        <button
          type="button"
          className="flex w-12 items-center justify-center border-l border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
          aria-label="Filter"
        >
          <span className="material-icons-round">filter_list</span>
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {sections.map((section) => (
          <section
            key={section.key}
            className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm"
          >
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 p-3">
              <div className="flex items-center gap-1 text-sm text-neutral-500">
                <span>{section.title}</span>
                <span className="material-icons-round text-[14px]">info</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {section.metrics.map((metric) => (
                  <div key={metric.label} className="flex items-center gap-1">
                    <span className="text-[11px] text-neutral-500">{metric.label}</span>
                    <span
                      className={`rounded-sm px-1.5 py-0.5 text-xs font-bold ${
                        metricToneClassMap[metric.tone] || "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </header>

            <div>
              {section.items.map((item, itemIndex) => {
                const statusConfig = getStatusConfig(item.status);
                const itemKey = `${section.key}:${item.key}`;
                const hasSuggestions = Array.isArray(item.suggestions) && item.suggestions.length > 0;
                const isExpanded = expandedSkillKeys.includes(itemKey);

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
                        <span className="material-icons-round text-[14px]">flag</span>
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
                  <div
                    key={item.key}
                    className={`${itemIndex === section.items.length - 1 ? "" : "border-b border-neutral-200"}`}
                  >
                    {hasSuggestions ? (
                      <button
                        type="button"
                        onClick={() => onToggleSkill(itemKey)}
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
                      <div className="space-y-2 border-t border-neutral-200 bg-white p-3">
                        <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-neutral-900">
                          <span className="material-icons-round text-[16px] text-primary">
                            auto_awesome
                          </span>
                          Phrase suggestions
                        </div>
                        {item.suggestions.map((suggestion, suggestionIndex) => (
                          <div
                            key={`${item.key}-${suggestionIndex}`}
                            className="cursor-pointer rounded border border-neutral-200 bg-white p-3 text-sm leading-relaxed text-neutral-700 shadow-sm transition-shadow hover:shadow"
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
};

export default MatchReportSidebar;
