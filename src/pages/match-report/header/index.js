const MatchReportHeader = ({
  documentTabs = [],
  activeDocumentTab,
  onDocumentTabChange,
  editorStatus,
}) => {
  return (
    <div className="flex-shrink-0 border-b border-neutral-200 bg-white">
      <header className="border-b border-neutral-200 px-4 py-3 sm:px-6">
        <nav className="flex flex-wrap items-end gap-4 sm:gap-6">
          {documentTabs.map((tab) => {
            const isActive = tab.key === activeDocumentTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onDocumentTabChange(tab.key)}
                className={`border-b-2 pb-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 sm:px-4 lg:px-6">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            <span className="material-icons-round text-[18px] text-primary">check_circle</span>
            <span className="text-neutral-900">{editorStatus.aiSuggestionsLabel}</span>
            <span className="material-icons-round text-[18px]">chevron_right</span>
          </button>

          <div className="hidden h-4 w-px bg-neutral-300 sm:block" />

          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
              {editorStatus.editStepValue}
            </span>
            {editorStatus.editStepLabel}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            title="Undo"
            aria-label="Undo"
          >
            <span className="material-icons-round text-[20px]">undo</span>
          </button>
          <button
            type="button"
            className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            title="Redo"
            aria-label="Redo"
          >
            <span className="material-icons-round text-[20px]">redo</span>
          </button>
          <div className="mx-1 h-4 w-px bg-neutral-300" />
          <button
            type="button"
            className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            title="Layout"
            aria-label="Layout"
          >
            <span className="material-icons-round text-[20px]">view_agenda</span>
          </button>
          <button
            type="button"
            className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            title="Copy"
            aria-label="Copy"
          >
            <span className="material-icons-round text-[20px]">content_copy</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <span className="material-icons-round text-[18px]">file_download</span>
            {editorStatus.downloadLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchReportHeader;
