import SidebarHeader from "./header";
import CriteriaSelection from "./criteria-selection";
import SidebarContent from "./content";

const MatchReportSidebar = () => {
  return (
    <aside className="flex w-full flex-shrink-0 flex-col border-b border-neutral-200 bg-white xl:h-screen xl:w-[520px] 2xl:w-[680px] xl:border-b-0 xl:border-r">
      <SidebarHeader />
      <CriteriaSelection />
      <SidebarContent />
    </aside>
  );
};

export default MatchReportSidebar;
