import Button from "@/components/Button";

const HeaderBottom = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-1.5 sm:px-6">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <span className="inline-flex items-center gap-2 px-2 text-sm font-medium text-neutral-600">
          <span className="material-icons-round text-[18px] text-primary">check_circle</span>
          <span className="text-neutral-900">AI Suggestions (22/22)</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        <Button mode="ghost" size="sm" btnIcon tooltip="Undo">
          <span className="material-icons-round text-[20px]">undo</span>
        </Button>
        <Button mode="ghost" size="sm" btnIcon tooltip="Redo">
          <span className="material-icons-round text-[20px]">redo</span>
        </Button>
        <div className="mx-1 h-4 w-px bg-neutral-300" />
        <Button mode="ghost" size="sm" btnIcon tooltip="Layout">
          <span className="material-icons-round text-[20px]">view_agenda</span>
        </Button>
        <Button
          mode="primary"
          size="sm"
          shape="rounded"
          iconLeft={<span className="material-icons-round text-[18px]">file_download</span>}
        >
          Download
        </Button>
      </div>
    </div>
  );
};

export default HeaderBottom;