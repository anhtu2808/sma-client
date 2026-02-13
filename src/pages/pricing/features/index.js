import { useMemo } from "react";
import { useGetPlansQuery } from "@/apis/planApi";

const FeaturesTable = () => {
  const { data: plans = [], isLoading } = useGetPlansQuery();

  const orderedPlans = useMemo(() => {
    if (!Array.isArray(plans)) return [];
    return [...plans].sort((a, b) => {
      if (a?.isPopular && !b?.isPopular) return -1;
      if (!a?.isPopular && b?.isPopular) return 1;
      return (a?.id ?? 0) - (b?.id ?? 0);
    });
  }, [plans]);

  return (
    <section className="mb-24 overflow-x-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900">Compare Features</h2>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading plan features...</p>
      ) : orderedPlans.length === 0 ? (
        <p className="text-sm text-gray-400">No plan data available.</p>
      ) : (
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr>
              <th className="p-4 bg-gray-50/50 rounded-tl-2xl border-b border-gray-100 text-sm font-bold text-gray-400 uppercase tracking-wider">
                Plan
              </th>
              {orderedPlans.map((plan, index) => (
                <th
                  key={plan?.id ?? plan?.name ?? index}
                  className={`p-4 bg-gray-50/50 border-b border-gray-100 text-sm font-bold text-gray-900 text-center ${
                    index === orderedPlans.length - 1 ? "rounded-tr-2xl" : ""
                  }`}
                >
                  {plan?.name || "Plan"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="p-4 bg-gray-50/30 text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                Details
              </td>
              {orderedPlans.map((plan) => (
                <td key={plan?.id ?? plan?.name} className="p-4 align-top">
                  {plan?.planDetails ? (
                    <div dangerouslySetInnerHTML={{ __html: plan.planDetails }} />
                  ) : (
                    <span className="text-xs text-gray-400">No details available</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </section>
  );
};

export default FeaturesTable;
