import { useEffect, useMemo, useState } from "react";
import { useGetPlansQuery } from "@/apis/planApi";
import PlanCard from "./plan-card";

const formatCurrency = (amount, currency) => {
  if (amount == null || Number.isNaN(Number(amount))) return "-";
  const resolvedCurrency = currency || "VND";
  const locale = resolvedCurrency === "VND" ? "vi-VN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: resolvedCurrency,
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

const toMonths = (duration, unit) => {
  if (!duration || !unit) return 0;
  return unit === "YEAR" ? duration * 12 : duration;
};

const mapPlanToCard = (plan) => {
  const planPrices = Array.isArray(plan?.planPrices) ? plan.planPrices : [];
  const pricesWithMonths = planPrices
    .filter((price) => price?.isActive !== false)
    .map((price) => ({
      id: price.id,
      months: toMonths(price.duration, price.unit),
      total: Number(price.salePrice ?? price.originalPrice ?? 0),
      currency: price.currency || plan.currency || "VND",
    }))
    .filter((price) => price.months > 0);

  pricesWithMonths.sort((a, b) => a.months - b.months);

  const basePrice = pricesWithMonths[0] || null;
  const baseMonthly =
    basePrice && basePrice.months > 0 ? basePrice.total / basePrice.months : 0;

  const durations = pricesWithMonths.map((price) => {
    const monthly = price.months > 0 ? price.total / price.months : 0;
    const save =
      baseMonthly > 0 ? Math.max(0, Math.round((1 - monthly / baseMonthly) * 100)) : 0;
    return {
      key: String(price.id ?? `${plan.id}-${price.months}m`),
      label: `${price.months} months`,
      total: formatCurrency(price.total, price.currency),
      perMonth: `${formatCurrency(monthly, price.currency)} / month`,
      save,
    };
  });

  const maxSave = durations.reduce((max, item) => Math.max(max, item.save || 0), 0);
  const durationsWithPopular = durations.map((item) => ({
    ...item,
    mostPopular: item.save === maxSave && maxSave > 0,
  }));

  const name = plan?.name || "Plan";
  const code = name ? name.toUpperCase().replace(/\s+/g, "_") : `PLAN_${plan?.id ?? ""}`;
  const isCurrent = Boolean(plan?.isCurrent);
  const cta = isCurrent ? "Current Plan" : baseMonthly === 0 ? "Get Started" : `Upgrade to ${name}`;

  return {
    id: plan?.id,
    code,
    name,
    description: plan?.description || "",
    price: basePrice ? formatCurrency(baseMonthly, basePrice.currency) : "-",
    unit: "/ month",
    cta,
    current: isCurrent,
    popular: Boolean(plan?.isPopular),
    detailsHtml: typeof plan?.planDetails === "string" ? plan.planDetails.trim() : "",
    durations: durationsWithPopular,
  };
};

const Plans = () => {
  const { data: plans = [], isLoading } = useGetPlansQuery();
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [selectedDurationByPlan, setSelectedDurationByPlan] = useState({});

  const mappedPlans = useMemo(() => {
    if (!Array.isArray(plans)) return [];
    return plans.map(mapPlanToCard);
  }, [plans]);

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

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-stretch">
      {isLoading ? (
        <p className="text-sm text-gray-400">Loading plans...</p>
      ) : mappedPlans.length === 0 ? (
        <p className="text-sm text-gray-400">No plans available.</p>
      ) : (
        mappedPlans.map((plan) => (
          <PlanCard
            key={plan.code}
            plan={plan}
            isExpanded={expandedPlan === plan.code}
            onExpand={() => setExpandedPlan(plan.code)}
            onClose={() => setExpandedPlan(null)}
            selectedDuration={selectedDurationByPlan[plan.code]}
            onSelectDuration={(durationKey) => onSelectDuration(plan.code, durationKey)}
          />
        ))
      )}
    </section>
  );
};

export default Plans;
