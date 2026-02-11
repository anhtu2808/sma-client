import Plans from "./plans";
import FeaturesTable from "./features";
import PricingFAQ from "./faq";

const PricingPage = () => {
  return (
    <div className="bg-white text-gray-900">
      <main className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Choose the right plan for your career
            </h1>
          </section>

          <Plans />

          <FeaturesTable />

          <PricingFAQ />

          <section className="bg-primary rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <span className="material-icons-round text-[120px]">group_add</span>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Not ready to subscribe?</h2>
              <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto">
                Join our Talent Pool to get discovered by recruiters and receive curated job alerts based on your profile.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg"
                >
                  Join Talent Pool
                </button>
                <button
                  type="button"
                  className="bg-primary-dark/30 hover:bg-primary-dark/50 border border-white/20 px-8 py-4 rounded-xl font-bold text-lg transition-all"
                >
                  Learn more
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PricingPage;
