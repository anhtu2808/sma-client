import { useMemo, useState, useCallback } from "react";
import { useGetPlansQuery } from "@/apis/planApi";
import { PLAN_TYPES, PLAN_TARGETS } from "@/constant/plan";
import Plans from "./plans";
import Addons from "./addons";
import Loading from "@/components/Loading";
import PaymentModal from "@/pages/checkout/components/PaymentModal";

const PricingPage = () => {
  const { data: mainRes, isLoading: isMainLoading, refetch: refetchMain } = useGetPlansQuery({
    planType: PLAN_TYPES.MAIN,
    planTarget: PLAN_TARGETS.CANDIDATE,
  });

  const { data: quotaRes, isLoading: isQuotaLoading, refetch: refetchQuota } = useGetPlansQuery({
    planType: PLAN_TYPES.ADDONS_QUOTA,
    planTarget: PLAN_TARGETS.CANDIDATE,
  });

  const { data: featureRes, isLoading: isFeatureLoading, refetch: refetchFeature } = useGetPlansQuery({
    planType: PLAN_TYPES.ADDONS_FEATURE,
    planTarget: PLAN_TARGETS.CANDIDATE,
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);
  const [selectedDurationForPayment, setSelectedDurationForPayment] = useState(null);


  const mainPlansData = useMemo(() => {
    const list = mainRes?.data?.content || mainRes?.data || mainRes || [];
    const arrayList = Array.isArray(list) ? list : [];

    return arrayList.filter(p => p.planType === PLAN_TYPES.MAIN);
  }, [mainRes]);

  const quotaPlansData = useMemo(() => {
    const list = quotaRes?.data?.content || quotaRes?.data || quotaRes || [];
    const arrayList = Array.isArray(list) ? list : [];
    return arrayList.filter(p => p.planType === PLAN_TYPES.ADDONS_QUOTA);
  }, [quotaRes]);

  const featurePlansData = useMemo(() => {
    const list = featureRes?.data?.content || featureRes?.data || featureRes || [];
    const arrayList = Array.isArray(list) ? list : [];
    return arrayList.filter(p => p.planType === PLAN_TYPES.ADDONS_FEATURE);
  }, [featureRes]);

  const currentPlan = useMemo(() => {
    return mainPlansData.find((p) => p?.isCurrent) || null;
  }, [mainPlansData]);

  const handleOpenPaymentModal = useCallback((plan, duration) => {
    setSelectedPlanForPayment(plan);
    setSelectedDurationForPayment(duration);
    setIsPaymentModalOpen(true);
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    refetchMain();
    refetchQuota();
    refetchFeature();
  }, [refetchMain, refetchQuota, refetchFeature]);

  if (isMainLoading) return <Loading />;

  return (
    <div className="bg-white min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Choose the right plan for your career
          </h1>
          <p className="text-gray-500 text-lg">Upgrade to unlock premium features and boost your profile</p>
        </section>

        {/* Section 1: Subscription Plans */}
        <div className="w-full">
          <Plans
            plans={mainPlansData}
            currentPlanId={currentPlan?.id}
            onOpenPaymentModal={handleOpenPaymentModal}
          />
        </div>

        {/* Section 2: Add-ons */}
        <div className="w-full">
          {(isQuotaLoading || isFeatureLoading) ? (
            <div className="text-center py-10">Loading addons...</div>
          ) : (
            <Addons
              quotaPlans={quotaPlansData}
              featurePlans={featurePlansData}
              onOpenPaymentModal={handleOpenPaymentModal}
            />
          )}
        </div>

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          plan={selectedPlanForPayment}
          selectedDuration={selectedDurationForPayment}
          onSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
};

export default PricingPage;