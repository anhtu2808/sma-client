import FaqItem from "./FaqItem";

const FAQ_ITEMS = [
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access to pro features until the end of your current billing period.",
  },
  {
    question: "Do you offer discounts for students?",
    answer: "Yes. We offer a 50% discount for students after verification with a valid student ID.",
  },
  {
    question: "What is AI Resume Optimization?",
    answer:
      "Our AI analyzes your resume against job descriptions and suggests updates to improve ATS matching and recruiter visibility.",
  },
];

const PricingFAQ = () => {
  return (
    <section className="max-w-3xl mx-auto mb-24">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {FAQ_ITEMS.map((faq) => (
          <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
};

export default PricingFAQ;
