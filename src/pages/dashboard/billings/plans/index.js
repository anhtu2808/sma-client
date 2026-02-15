import { useEffect, useMemo, useState } from "react";
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
  const isCurrent =
    currentPlanId != null ? plan?.id === currentPlanId : Boolean(plan?.isCurrent);
  const description = plan?.description || "";
  const detailsHtml = typeof plan?.planDetails === "string" ? plan.planDetails.trim() : "";
  const isPopular = Boolean(plan?.isPopular);

  if (lifetimePrice) {
    const total = Number(lifetimePrice.salePrice ?? lifetimePrice.originalPrice ?? 0);
    const currency = lifetimePrice.currency || plan.currency || "VND";
    const priceLabel = total === 0 ? "Free" : formatCurrency(total, currency);
    const note = total === 0 ? "Lifetime access" : "Billed once";
    return {
      id: plan?.id,
      code,
      name,
      description,
      current: isCurrent,
      popular: isPopular,
      basePriceLabel: priceLabel,
      baseUnit: "",
      note,
      cta: isCurrent ? "Current Plan" : `Upgrade to ${name}`,
      detailsHtml,
      durations: [],
    };
  }
  const pricesWithMonths = planPrices
    .filter((price) => price?.isActive !== false)
    .map((price) => ({
      id: price.id,
      months: toMonths(price.duration, price.unit),
      total: Number(price.salePrice ?? price.originalPrice ?? 0),
      currency: price.currency || plan.currency || "VND",
      unit: price.unit,
    }))
    .filter((price) => price.months > 0);

  pricesWithMonths.sort((a, b) => a.months - b.months);

  const basePrice = pricesWithMonths[0] || null;
  const baseMonthly =
    basePrice && basePrice.months > 0 ? basePrice.total / basePrice.months : 0;

  const durations = pricesWithMonths.map((price) => {
    const monthly = price.months > 0 ? price.total / price.months : 0;
    const savePercent =
      baseMonthly > 0 ? Math.max(0, Math.round((1 - monthly / baseMonthly) * 100)) : 0;
    return {
      key: String(price.id ?? `${plan.id}-${price.months}m`),
      months: price.months,
      total: formatCurrency(price.total, price.currency),
      monthly: `${formatCurrency(monthly, price.currency)} / month`,
      savePercent,
    };
  });

  const maxSave = durations.reduce((max, item) => Math.max(max, item.savePercent || 0), 0);
  const durationsWithPopular = durations.map((item) => ({
    ...item,
    mostPopular: item.savePercent === maxSave && maxSave > 0,
  }));

  const note =
    durationsWithPopular.length > 1
      ? "Billed monthly or save on longer terms"
      : basePrice
      ? basePrice.unit === "YEAR"
        ? "Billed yearly"
        : "Billed monthly"
      : "Pricing unavailable";

  return {
    id: plan?.id,
    code,
    name,
    description,
    current: isCurrent,
    popular: isPopular,
    basePriceLabel: basePrice ? formatCurrency(baseMonthly, basePrice.currency) : "-",
    baseUnit: "/ month",
    note,
    cta: isCurrent ? "Current Plan" : `Upgrade to ${name}`,
    detailsHtml,
    durations: durationsWithPopular,
  };
};

const Plans = ({ plans = [], currentPlanId = null }) => {
  const [expandedPlanCode, setExpandedPlanCode] = useState(null);
  const [selectedDurationByPlan, setSelectedDurationByPlan] = useState({});

  const sortedPlans = useMemo(() => {
    if (!Array.isArray(plans)) return [];
    const getBaseMonthly = (plan) => {
      const prices = Array.isArray(plan?.planPrices) ? plan.planPrices : [];
      const activePrices = prices.filter((price) => price?.isActive !== false);
      const lifetime = activePrices.find((price) => isLifetimeUnit(price?.unit));
      if (lifetime) {
        return {
          price: Number(lifetime.salePrice ?? lifetime.originalPrice ?? 0),
          hasPrice: true,
        };
      }
      const priced = activePrices
        .map((price) => ({
          months: toMonths(price.duration, price.unit),
          total: Number(price.salePrice ?? price.originalPrice ?? 0),
        }))
        .filter((price) => price.months > 0)
        .sort((a, b) => a.months - b.months);
      if (priced.length === 0) {
        return { price: Number.POSITIVE_INFINITY, hasPrice: false };
      }
      const base = priced[0];
      return {
        price: base.total / base.months,
        hasPrice: true,
      };
    };
    return [...plans].sort((a, b) => {
      const aDefault = Boolean(a?.isDefault);
      const bDefault = Boolean(b?.isDefault);
      if (aDefault !== bDefault) return aDefault ? -1 : 1;
      const aPrice = getBaseMonthly(a);
      const bPrice = getBaseMonthly(b);
      if (aPrice.price !== bPrice.price) return aPrice.price - bPrice.price;
      const aName = String(a?.name || "");
      const bName = String(b?.name || "");
      return aName.localeCompare(bName);
    });
  }, [plans]);

  const mappedPlans = useMemo(() => {
    if (!Array.isArray(sortedPlans)) return [];
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
      {mappedPlans.map((plan) => (
        <PlanCard
          key={plan.code}
          plan={plan}
          isExpanded={expandedPlanCode === plan.code}
          onExpand={() => setExpandedPlanCode(plan.code)}
          onClose={() => setExpandedPlanCode(null)}
          selectedDuration={selectedDurationByPlan[plan.code]}
          onSelectDuration={(durationKey) => onSelectDuration(plan.code, durationKey)}
        />
      ))}
    </div>
  );
};

export default Plans;
