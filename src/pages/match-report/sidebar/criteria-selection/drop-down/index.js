import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "antd";
import { setActiveCriteriaId } from "@/store/slices/matchingReportSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSliders } from '../../../../../utils/icons';
import { getFixProgress, getScoreColor } from "../utils";
import { formatScore } from "@/utils/formatScore";

const DropDown = ({ items = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const activeCriteriaId = useSelector((state) => state.matchingReport.ui.activeCriteriaId);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="relative border-l border-neutral-200" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-14 h-full items-center justify-center text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900 ${
          isOpen ? "bg-neutral-100" : ""
        }`}
        aria-label="More criteria"
      >
        <FontAwesomeIcon icon={faSliders} className={`text-[22px] transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        {items.length > 0 && (
          <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {items.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-[100] mt-1 w-72 origin-top-right rounded-xl border border-neutral-200 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
          <div className="mb-2 flex items-center justify-between px-3 py-1.5">
            <span className="text-xs font-bold text-neutral-400">
              Other Criteria
            </span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-500">
              {items.length} items
            </span>
          </div>
          <div className="max-h-[350px] overflow-y-auto overflow-x-hidden space-y-1 custom-scrollbar">
            {items.map((item) => {
              const isActive = item.id === activeCriteriaId;
              const { fixed, total, percent } = getFixProgress(item.details);
              const aiScore = formatScore(item.aiScore);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    dispatch(setActiveCriteriaId(item.id));
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all ${
                    isActive
                      ? "bg-primary/5 text-primary ring-1 ring-inset ring-primary/20"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex flex-col min-w-0 flex-1 mr-3">
                    <Tooltip title="AI matching score for this criterion">
                      <span className={`truncate text-sm ${isActive ? "font-bold" : "font-semibold"}`}>
                        {item.criteriaName || item.criteriaType}
                        <span className={`ml-1 font-bold ${getScoreColor(aiScore)}`}>({aiScore})</span>
                      </span>
                    </Tooltip>
                    <Tooltip title={total === 0 ? "No gaps to fix" : `${fixed} of ${total} issues fixed`}>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-neutral-100">
                          <div
                            className={`h-full transition-[width] duration-500 ease-out ${percent < 50 ? "bg-red-400" : percent < 80 ? "bg-amber-400" : "bg-emerald-400"}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold tabular-nums text-neutral-400">
                          {total === 0 ? "—" : `${fixed}/${total}`}
                        </span>
                      </div>
                    </Tooltip>
                  </div>
                  {isActive && (
                    <FontAwesomeIcon icon={faCheck} className="text-primary text-[20px] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDown;
