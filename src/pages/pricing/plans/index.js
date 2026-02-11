import { useState } from "react";
import PlanCard from "./plan-card";

const PLAN_DATA = [
  {
    code: "FREE",
    name: "Free",
    description: "Start your career journey with basic tools.",
    price: "$0",
    unit: "/mo",
    cta: "Get Started",
    current: false,
    featuresTitle: "What's included",
    features: ["3 AI Resume scans/mo", "Basic Job Search", "Public Profile"],
    durations: [],
  },
  {
    code: "PRO",
    name: "Pro",
    description: "Accelerate your search with AI-powered tools.",
    price: "$25",
    unit: "/mo",
    cta: "Upgrade to Pro",
    current: false,
    popular: true,
    featuresTitle: "Everything in Free, plus",
    features: ["50 AI Resume scans/mo", "Priority Application", "AI Interview Coaching"],
    durations: [
      { key: "PRO_3M", label: "3 months", total: "$75", perMonth: "$25/mo", save: 0 },
      { key: "PRO_6M", label: "6 months", total: "$112.5", perMonth: "$18.75/mo", save: 25 },
      { key: "PRO_12M", label: "12 months", total: "$180", perMonth: "$15/mo", save: 40, mostPopular: true },
    ],
  },
  {
    code: "PREMIUM",
    name: "Premium",
    description: "Comprehensive support for senior roles.",
    price: "$50",
    unit: "/mo",
    cta: "Upgrade to Premium",
    current: false,
    featuresTitle: "Everything in Pro, plus",
    features: ["Unlimited AI Scans", "Personal Career Mentor", "Salary Negotiation Pro"],
    durations: [
      { key: "PREM_3M", label: "3 months", total: "$150", perMonth: "$50/mo", save: 0 },
      { key: "PREM_6M", label: "6 months", total: "$225", perMonth: "$37.5/mo", save: 25 },
      { key: "PREM_12M", label: "12 months", total: "$360", perMonth: "$30/mo", save: 40, mostPopular: true },
    ],
  },
];

const Plans = () => {
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [selectedDurationByPlan, setSelectedDurationByPlan] = useState({
    PRO: "PRO_12M",
    PREMIUM: "PREM_12M",
  });

  const onSelectDuration = (planCode, durationKey) => {
    setSelectedDurationByPlan((prev) => ({ ...prev, [planCode]: durationKey }));
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-stretch">
      {PLAN_DATA.map((plan) => (
        <PlanCard
          key={plan.code}
          plan={plan}
          isExpanded={expandedPlan === plan.code}
          onExpand={() => setExpandedPlan(plan.code)}
          onClose={() => setExpandedPlan(null)}
          selectedDuration={selectedDurationByPlan[plan.code]}
          onSelectDuration={(durationKey) => onSelectDuration(plan.code, durationKey)}
        />
      ))}
    </section>
  );
};

export default Plans;
