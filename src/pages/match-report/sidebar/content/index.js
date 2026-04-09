import { useMemo } from "react";
import { useSelector } from "react-redux";
import ContentDetail from "./content-detail";

const SidebarContent = () => {
  const activeCriteriaId = useSelector((state) => state.matchingReport.ui.activeCriteriaId);
  const criteria = useSelector((state) => state.matchingReport.data?.criteriaScores ?? []);

  const activeCriteria = criteria.find((c) => c.id === activeCriteriaId) || {};
  const details = activeCriteria.details || [];

  const siblingsByContext = useMemo(() => {
    const map = new Map();
    for (const detail of details) {
      const key = detail.contextId ?? `id:${detail.id}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(detail.id);
    }
    return map;
  }, [details]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col">
        {details.map((detail, idx) => {
          const key = detail.contextId ?? `id:${detail.id}`;
          const siblingDetailIds = siblingsByContext.get(key) || [detail.id];
          return (
            <ContentDetail
              key={detail.id}
              item={detail}
              siblingDetailIds={siblingDetailIds}
              isLast={idx === details.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SidebarContent;
