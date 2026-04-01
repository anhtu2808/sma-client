import { useMemo } from "react";
import { useSelector } from "react-redux";
import ContentDetail from "./content-detail";

const SidebarContent = () => {
  const activeCriteriaId = useSelector((state) => state.matchingReport.ui.activeCriteriaId);
  const criteria = useSelector((state) => state.matchingReport.data?.criteriaScores ?? []);

  const activeCriteria = criteria.find((c) => c.id === activeCriteriaId) || {};
  const details = activeCriteria.details || [];

  // Group details by contextId (for contexts-based data) or treat each as its own group
  const groups = useMemo(() => {
    const map = new Map();
    for (const detail of details) {
      const key = detail.contextId ?? detail.id;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(detail);
    }
    return [...map.values()];
  }, [details]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col">
        {groups.map((groupDetails, groupIdx) => (
          <ContentDetail
            key={groupDetails[0].contextId ?? groupDetails[0].id}
            items={groupDetails}
            isLast={groupIdx === groups.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default SidebarContent;
