import { ConfigProvider, Tabs } from "antd";
import { useMemo } from "react";
import { useGetPlansQuery } from "@/apis/planApi";
import { PLAN_TARGETS, PLAN_TYPES } from "@/constant/plan";
import Plans from "@/pages/dashboard/billings/plans";
import Addons from "@/pages/dashboard/billings/addons";
import Loading from "@/components/Loading";

const BillingPlans = () => {
  const { data: plans = [], isLoading: isPlansLoading, refetch: refetchPlans } = useGetPlansQuery({
    planType: PLAN_TYPES.MAIN,
    planTarget: PLAN_TARGETS.CANDIDATE,
  });

  const { data: addons = [], isLoading: isAddonsLoading, refetch: refetchAddons } = useGetPlansQuery({
    planType: PLAN_TYPES.ADDONS_QUOTA,
    planTarget: PLAN_TARGETS.CANDIDATE,
  });

  const { data: addonsFeature = [], isLoading: isAddonsFeatureLoading, refetch: refetchAddonsFeature } = useGetPlansQuery({
    planType: PLAN_TYPES.ADDONS_FEATURE,
    planTarget: PLAN_TARGETS.CANDIDATE,
  });

  const handleRefetch = () => {
    refetchPlans();
    refetchAddons();
    refetchAddonsFeature();
  };

  const currentPlan = useMemo(() => {
    if (!Array.isArray(plans)) return null;
    return plans.find((plan) => plan?.isCurrent) || null;
  }, [plans]);
  const currentPlanId = currentPlan?.id ?? null;

  if (isPlansLoading || isAddonsLoading || isAddonsFeatureLoading) {
    return <Loading className="h-[50vh]" />
  }

  const items = [
    {
      key: '1',
      label: 'Main Plans',
      children: (
        <div className="w-full mt-4">
          <Plans plans={plans} currentPlanId={currentPlanId} onPaymentSuccess={handleRefetch} />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Extras',
      children: (
        <div className="w-full mt-4">
          <Addons
            quotaPlans={addons}
            featurePlans={addonsFeature}
            onPaymentSuccess={handleRefetch}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#ff6b00',
          },
        }}
      >
        <Tabs defaultActiveKey="1" items={items} />
      </ConfigProvider>
    </div>
  );
};

export default BillingPlans;
