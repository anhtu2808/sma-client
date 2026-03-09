const DropDown = () => {
  return (
    <button
      type="button"
      className="relative flex w-14 shrink-0 items-center justify-center text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900 border-l border-neutral-200 py-2"
      aria-label="Filter"
    >
      <i className="fa-solid fa-bars-staggered text-xl"></i>
    </button>
  );
};

export default DropDown;
