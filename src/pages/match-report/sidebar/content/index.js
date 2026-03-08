import { useSelector } from "react-redux";
import ContentDetail from "./content-detail";

const SidebarContent = () => {
  const activeCriteriaId = useSelector((state) => state.matchingReport.activeCriteriaId);
  const criteria = useSelector((state) => state.matchingReport.criteria);

  const activeCriteria = criteria.find((c) => c.id === activeCriteriaId) || {};
  const details = activeCriteria.details || [];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col">
        {details.map((item, itemIdx) => (
          <ContentDetail
            key={item.id}
            item={item}
            isLast={itemIdx === details.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default SidebarContent;
