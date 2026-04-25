import { useEffect, useMemo, useState } from "react";
import PlanCard from "./plan-card";
import formatCurrency from "@/utils/formatCurrency";

const isLifetimeUnit = (unit) => String(unit || "").toUpperCase() === "LIFETIME";

const toMonths = (duration, unit) => {
  if (!duration || !unit) return 0;
  if (isLifetimeUnit(unit)) return 0;
  return unit === "YEAR" ? duration * 12 : duration;
};

const mapPlanToCard = (plan, currentPlanId) => {
  const planPrices = Array.isArray(plan?.planPrices) ? plan.planPrices : [];
  const lifetimePrice = planPrices.find(
    (price) => price?.isActive !== false && isLifetimeUnit(price?.unit)
  );

  const name = plan?.name || "Plan";
  const code = name ? name.toUpperCase().replace(/\s+/g, "_") : `PLAN_${plan?.id ?? ""}`;

  // Kiểm tra current plan dựa trên ID truyền từ PricingPage xuống
  const isCurrent = currentPlanId != null ? plan?.id === currentPlanId : Boolean(plan?.isCurrent);

  const description = plan?.description || "";
  const detailsHtml = typeof plan?.planDetails === "string" ? plan.planDetails.trim() : "";
  const isPopular = Boolean(plan?.isPopular);

  if (lifetimePrice) {
    const total = Number(lifetimePrice.salePrice ?? lifetimePrice.originalPrice ?? 0);
    const priceLabel = total === 0 ? "Free" : formatCurrency(total);
    const cta = isCurrent ? "Current Plan" : total === 0 ? "Get Started" : `Upgrade to ${name}`;
    const isDefault = Boolean(plan?.isDefault);
    return {
      id: plan?.id,
      priceId: lifetimePrice.id,
      code,
      name,
      description,
      price: priceLabel,
      unit: "",
      cta,
      current: isCurrent,
      popular: isPopular,
      detailsHtml,
      durations: [],
      isDefault,
    };
  }

  const pricesWithMonths = planPrices
    .filter((price) => price?.isActive !== false)
    .map((price) => ({
      id: price.id,
      months: toMonths(price.duration, price.unit),
      total: Number(price.salePrice ?? price.originalPrice ?? 0),
    }))
    .filter((price) => price.months > 0);

  pricesWithMonths.sort((a, b) => a.months - b.months);

  const basePrice = pricesWithMonths[0] || null;
  const baseMonthly = basePrice && basePrice.months > 0 ? basePrice.total / basePrice.months : 0;

  const durations = pricesWithMonths.map((price) => {
    const monthly = price.months > 0 ? price.total / price.months : 0;
    const save = baseMonthly > 0 ? Math.max(0, Math.round((1 - monthly / baseMonthly) * 100)) : 0;
    return {
      key: String(price.id),
      label: `${price.months} months`,
      months: price.months,
      total: formatCurrency(price.total),
      perMonth: `${formatCurrency(monthly)} / month`,
      save,
    };
  });

  const maxSave = durations.reduce((max, item) => Math.max(max, item.save || 0), 0);
  const durationsWithPopular = durations.map((item) => ({
    ...item,
    mostPopular: item.save === maxSave && maxSave > 0,
  }));

  const cta = isCurrent ? "Current Plan" : baseMonthly === 0 ? "Get Started" : `Upgrade to ${name}`;
  const isDefault = Boolean(plan?.isDefault);

  return {
    id: plan?.id,
    code,
    name,
    description,
    price: basePrice ? formatCurrency(baseMonthly) : "-",
    unit: "/ month",
    cta,
    current: isCurrent,
    popular: isPopular,
    detailsHtml,
    durations: durationsWithPopular,
    isDefault,
  };
};

/**
 * Component Plans nhận data từ PricingPage truyền xuống 
 * để đảm bảo không bị lấy nhầm dữ liệu chưa lọc.
 */
const Plans = ({ plans = [], currentPlanId = null, onOpenPaymentModal }) => {
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [selectedDurationByPlan, setSelectedDurationByPlan] = useState({});
  const [selectedPlanCode, setSelectedPlanCode] = useState(null);

  const sortedPlans = useMemo(() => {
    if (!Array.isArray(plans)) return [];
    return [...plans].sort((a, b) => {
      const aDefault = Boolean(a?.isDefault);
      const bDefault = Boolean(b?.isDefault);
      if (aDefault !== bDefault) return aDefault ? -1 : 1;
      const aLevel = a?.planLevel ?? Number.MAX_SAFE_INTEGER;
      const bLevel = b?.planLevel ?? Number.MAX_SAFE_INTEGER;
      if (aLevel !== bLevel) return aLevel - bLevel;
      return String(a?.name || "").localeCompare(String(b?.name || ""));
    });
  }, [plans]);

  const mappedPlans = useMemo(() => {
    return sortedPlans.map((plan) => mapPlanToCard(plan, currentPlanId));
  }, [sortedPlans, currentPlanId]);

  useEffect(() => {
    if (mappedPlans.length === 0) return;
    setSelectedDurationByPlan((prev) => {
      const next = { ...prev };
      for (const plan of mappedPlans) {
        if (!next[plan.code] && plan.durations.length > 0) {
          next[plan.code] = plan.durations[0].key;
        }
      }
      return next;
    });
  }, [mappedPlans]);

  const onSelectDuration = (planCode, durationKey) => {
    setSelectedDurationByPlan((prev) => ({ ...prev, [planCode]: durationKey }));
  };

  if (plans.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-10">No plans available.</p>;
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-stretch">
      {mappedPlans.map((plan) => (
        <PlanCard
          key={plan.code}
          plan={plan}
          isSelected={selectedPlanCode === plan.code}
          onClick={() => setSelectedPlanCode(plan.code)}
          isExpanded={expandedPlan === plan.code}
          onExpand={() => setExpandedPlan(plan.code)}
          onClose={() => setExpandedPlan(null)}
          selectedDuration={selectedDurationByPlan[plan.code]}
          onSelectDuration={(durationKey) => onSelectDuration(plan.code, durationKey)}
          onOpenPaymentModal={onOpenPaymentModal}
        />
      ))}
    </section>
  );
};

export default Plans;