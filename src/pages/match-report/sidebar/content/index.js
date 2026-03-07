import { useSelector } from "react-redux";
import ContentDetail from "./content-detail";

const SidebarContent = () => {
  const activeSidebarTab = useSelector((state) => state.matchingReport.activeSidebarTab);
  const sidebarContentByTab = useSelector((state) => state.matchingReport.sidebarContentByTab);
  const sections = sidebarContentByTab[activeSidebarTab] || [];

  return (
    <div className="flex-1 overflow-y-auto">
      {sections.map((section) => (
        <section key={section.key} className="border-b border-neutral-200">
          <div>
            {section.items.map((item, itemIndex) => (
              <ContentDetail
                key={item.key}
                item={item}
                sectionKey={section.key}
                isLast={itemIndex === section.items.length - 1}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default SidebarContent;
