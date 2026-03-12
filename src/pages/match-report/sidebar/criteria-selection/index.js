import { useSelector } from "react-redux";
import Tab from "./tab";
import DropDown from "./drop-down";

const CriteriaSelection = () => {
  const criteria = useSelector((state) => state.matchingReport.data?.criteriaScores ?? []);
  
  const visibleTabs = criteria.slice(0, 4);
  const overflowItems = criteria.slice(4);

  return (
    <div className="flex items-stretch justify-between border-b border-neutral-200">
      <div className="relative flex-1 overflow-hidden">
        <div 
          className="flex overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide space-x-2 px-1 scroll-smooth"
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
        >
          {visibleTabs.map((item) => (
            <Tab key={item.id} tab={item} />
          ))}
        </div>
        
        {/* Right side gradient overlay for smooth visual scrolling */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent" />
      </div>

      <DropDown items={overflowItems} />
    </div>
  );
};

export default CriteriaSelection;
