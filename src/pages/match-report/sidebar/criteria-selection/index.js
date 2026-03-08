import { useSelector } from "react-redux";
import Tab from "./tab";
import DropDown from "./drop-down";

const CriteriaSelection = () => {
  const criteria = useSelector((state) => state.matchingReport.criteria);

  return (
    <div className="flex justify-between border-b border-neutral-200">
      <div className="flex flex-1 overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide space-x-2 px-1">
        {criteria.map((item) => (
          <Tab key={item.id} tab={item} />
        ))}
      </div>

      <DropDown />
    </div>
  );
};

export default CriteriaSelection;
