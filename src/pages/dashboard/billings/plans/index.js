import { useState } from "react";
import PlanCard from "./plan-card";

const MOCK_PLAN_DATA = [
  {
    id: 1,
    code: "FREE",
    name: "Free",
    description: "Perfect for individuals just starting their job search journey.",
    current: true,
    popular: false,
    basePriceLabel: "$0",
    baseUnit: "/ month",
    note: "Forever free",
    cta: "Current Plan",
    featuresTitle: "Features included",
    features: ["10 AI Resume scans/mo", "Basic Job Applications", "Limited Support"],
    durations: [],
  },
  {
    id: 2,
    code: "PRO",
    name: "Pro",
    description: "Designed for active job seekers needing more visibility.",
    current: false,
    popular: true,
    basePriceLabel: "$25",
    baseUnit: "/ month",
    note: "Billed monthly or save on longer terms",
    cta: "Upgrade to Pro",
    featuresTitle: "Everything in Free, plus:",
    features: [
      "100 AI Resume scans/mo",
      "Priority Applications",
      "Cover Letter Generator",
      "Interview Prep AI",
    ],
    durations: [
      { key: "PRO_3M", months: 3, total: "$75", monthly: "$25.0 / month", savePercent: 0 },
      { key: "PRO_6M", months: 6, total: "$112.5", monthly: "$18.75 / month", savePercent: 25 },
      { key: "PRO_12M", months: 12, total: "$180", monthly: "$15.0 / month", savePercent: 40, mostPopular: true },
    ],
  },
  {
    id: 3,
    code: "PREMIUM",
    name: "Premium",
    description: "Ultimate power for power users and serious career growth.",
    current: false,
    popular: false,
    basePriceLabel: "$50",
    baseUnit: "/ month",
    note: "Billed monthly or save on longer terms",
    cta: "Upgrade to Premium",
    featuresTitle: "Everything in Pro, plus:",
    features: [
      "Unlimited AI Scans",
      "Direct HR Messaging",
      "Personal Career Coach",
      "Salary Negotiation Assist",
    ],
    durations: [
      { key: "PREM_3M", months: 3, total: "$150", monthly: "$50.0 / month", savePercent: 0 },
      { key: "PREM_6M", months: 6, total: "$225", monthly: "$37.5 / month", savePercent: 25 },
      { key: "PREM_12M", months: 12, total: "$360", monthly: "$30.0 / month", savePercent: 40, mostPopular: true },
    ],
  },
];

const Plans = () => {
  const [expandedPlanCode, setExpandedPlanCode] = useState(null);
  const [selectedDurationByPlan, setSelectedDurationByPlan] = useState(() => ({
    PRO: "PRO_12M",
    PREMIUM: "PREM_12M",
  }));

  const onSelectDuration = (planCode, durationKey) => {
    setSelectedDurationByPlan((prev) => ({ ...prev, [planCode]: durationKey }));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
      {MOCK_PLAN_DATA.map((plan) => (
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
