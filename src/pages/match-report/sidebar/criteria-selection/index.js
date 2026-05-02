import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { setActiveCriteriaId } from "@/store/slices/matchingReportSlice";
import Tab from "./tab";

const CriteriaSelection = () => {
  const dispatch = useDispatch();
  const criteria = useSelector((state) => state.matchingReport.data?.criteriaScores ?? []);
  const activeCriteriaId = useSelector((state) => state.matchingReport.ui.activeCriteriaId);
  const scrollRef = useRef(null);
  const tabRefs = useRef({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => ro.disconnect();
  }, [criteria.length]);

  useEffect(() => {
    if (!activeCriteriaId) return;
    const node = tabRefs.current[activeCriteriaId];
    node?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
  }, [activeCriteriaId]);

  const activeIndex = criteria.findIndex((c) => c.id === activeCriteriaId);

  const goTo = (index) => {
    if (index < 0 || index >= criteria.length) return;
    const target = criteria[index];
    dispatch(setActiveCriteriaId(target.id));
    const node = tabRefs.current[target.id];
    node?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
  };

  const handlePrev = () => {
    const current = activeIndex < 0 ? 0 : activeIndex;
    goTo(current - 1);
  };

  const handleNext = () => {
    const current = activeIndex < 0 ? -1 : activeIndex;
    goTo(current + 1);
  };

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < criteria.length - 1;

  return (
    <div className="flex items-stretch border-b border-neutral-200">
      <button
        type="button"
        onClick={handlePrev}
        disabled={!canPrev}
        className={`flex w-7 shrink-0 items-center justify-center border-r border-neutral-200 text-neutral-700 transition-colors ${
          canPrev ? "hover:bg-neutral-50" : "cursor-not-allowed opacity-40"
        }`}
        aria-label="Previous criteria"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
      </button>

      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          className="flex h-full overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
          onScroll={updateScrollState}
        >
          {criteria.map((item) => (
            <Tab
              key={item.id}
              tab={item}
              ref={(el) => {
                if (el) tabRefs.current[item.id] = el;
                else delete tabRefs.current[item.id];
              }}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={!canNext}
        className={`flex w-7 shrink-0 items-center justify-center border-l border-neutral-200 text-neutral-700 transition-colors ${
          canNext ? "hover:bg-neutral-50" : "cursor-not-allowed opacity-40"
        }`}
        aria-label="Next criteria"
      >
        <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
      </button>
    </div>
  );
};

export default CriteriaSelection;
