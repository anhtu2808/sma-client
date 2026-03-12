import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveCriteriaId } from "@/store/slices/matchingReportSlice";

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
    <div className="relative border-l border-slate-200" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-14 h-full items-center justify-center text-slate-700 transition-all hover:bg-slate-50 hover:text-primary ${
          isOpen ? "bg-slate-100 text-primary" : ""
        }`}
        aria-label="More criteria"
      >
        <span className={`material-icons-round text-[22px] transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
          tune
        </span>
        {items.length > 0 && (
          <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {items.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[100] w-72 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_10px_40px_rgba(0,0,0,0.12)] ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
          <div className="mb-2 flex items-center justify-between px-3 py-1.5">
            <span className="text-xs font-bold  text-slate-400">
              Other Criteria
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
              {items.length} items
            </span>
          </div>
          <div className="max-h-[350px] overflow-y-auto overflow-x-hidden space-y-1 custom-scrollbar">
            {items.map((item) => {
              const isActive = item.id === activeCriteriaId;
              const progress = Math.max(0, Math.min(100, item.aiScore || 0));
              
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    dispatch(setActiveCriteriaId(item.id));
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-all ${
                    isActive 
                      ? "bg-primary text-white shadow-md shadow-primary/20" 
                      : "text-slate-700 hover:bg-orange-50 hover:text-primary"
                  }`}
                >
                  <div className="flex flex-col min-w-0 flex-1 mr-3">
                    <span className={`truncate text-sm ${isActive ? "font-bold" : "font-semibold"}`}>
                      {item.criteriaName || item.criteriaType}
                    </span>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className={`h-1.5 flex-1 overflow-hidden rounded-full ${isActive ? 'bg-white/30' : 'bg-slate-100'}`}>
                        <div 
                          className={`h-full transition-all duration-500 ${
                            isActive 
                              ? "bg-white" 
                              : progress < 50 ? "bg-red-400" : progress < 80 ? "bg-amber-400" : "bg-emerald-400"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-bold tabular-nums ${isActive ? "text-white" : "text-slate-400"}`}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                  {isActive && (
                    <span className="material-icons-round text-white text-[20px] shrink-0">check_circle</span>
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
