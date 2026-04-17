import { Col, Row } from "antd";
import { useMemo } from "react";
import { useGetPlansQuery } from "@/apis/planApi";
import { PLAN_TARGETS, PLAN_TYPES } from "@/constant/plan";
import Button from "@/components/Button";
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

  const handleRefetch = () => {
    refetchPlans();
    refetchAddons();
  };

  const currentPlan = useMemo(() => {
    if (!Array.isArray(plans)) return null;
    return plans.find((plan) => plan?.isCurrent) || null;
  }, [plans]);
  const currentPlanId = currentPlan?.id ?? null;
  const currentPlanName = currentPlan?.name;

  const currentAddons = useMemo(() => {
    if (!Array.isArray(addons)) return [];
    return addons.filter((addon) => addon?.isCurrent);
  }, [addons]);

  if (isPlansLoading || isAddonsLoading) {
    return <Loading className="h-[50vh]" />
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Plans plans={plans} currentPlanId={currentPlanId} onPaymentSuccess={handleRefetch} />
      </Col>
      <Col span={24}>
        <Addons plans={addons} currentPlanId={currentPlanId} onPaymentSuccess={handleRefetch} />
      </Col>

    </Row>
  );
};

export default BillingPlans;
