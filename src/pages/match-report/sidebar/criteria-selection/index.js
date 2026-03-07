import { useSelector } from "react-redux";
import Tab from "./tab";
import DropDown from "./drop-down";

const CriteriaSelection = () => {
  const sidebarTabs = useSelector((state) => state.matchingReport.sidebarTabs);

  return (
    <div className="flex justify-between border-b border-neutral-200">
      <div className="flex flex-1">
        {sidebarTabs.map((tab) => (
          <Tab key={tab.key} tab={tab} />
        ))}
      </div>

      <DropDown />
    </div>
  );
};

export default CriteriaSelection;
