import { useState, useEffect } from "react";
import Button from "@/components/Button";
import PaymentModal from "@/pages/checkout/components/PaymentModal";
import formatCurrency from "@/utils/formatCurrency";

const Addons = ({ quotaPlans = [], featurePlans = [], onPaymentSuccess }) => {
  const [selectedAddon, setSelectedAddon] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAddonForModal, setSelectedAddonForModal] = useState(null);

  useEffect(() => {
    if (!selectedAddon) {
      if (quotaPlans.length > 0) {
        setSelectedAddon(quotaPlans[0]);
      } else if (featurePlans.length > 0) {
        setSelectedAddon(featurePlans[0]);
      }
    }
  }, [quotaPlans, featurePlans, selectedAddon]);

  if (quotaPlans.length === 0 && featurePlans.length === 0) return null;

  const getAddonPrice = (addon) => {
    const prices = Array.isArray(addon?.planPrices) ? addon.planPrices : [];
    const priceObj = prices.find((p) => p?.isActive !== false) || {};
    return {
      priceAmount: priceObj.salePrice ?? priceObj.originalPrice ?? 0,
      priceObj,
    };
  };

  const handleAddonClick = (addon) => {
    const { priceAmount, priceObj } = getAddonPrice(addon);
    const addonPlan = {
      ...addon,
      basePriceLabel: formatCurrency(priceAmount),
      baseUnit: "",
      priceId: priceObj.id,
      durations: [],
    };
    setSelectedAddonForModal(addonPlan);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedAddonForModal(null);
  };

  const renderNavList = (title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 px-3 bg-gray-50 py-2 rounded-md">
          {title}
        </h3>
        <div className="space-y-1">
          {items.map((addon) => {
            const isSelected = selectedAddon?.id === addon.id;
            const { priceAmount } = getAddonPrice(addon);
            return (
              <div
                key={addon.id}
                onClick={() => setSelectedAddon(addon)}
                className={`cursor-pointer border-l-4 p-3 rounded-r-md transition-all ${isSelected
                  ? "border-orange-500 bg-orange-50 shadow-sm"
                  : "border-transparent hover:bg-gray-50"
                  }`}
              >
                <div className="flex flex-col">
                  <span className={`text-sm font-semibold ${isSelected ? 'text-orange-600' : 'text-gray-700'}`}>
                    {addon.name}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 font-medium">
                      {priceAmount > 0 ? formatCurrency(priceAmount) : "Free"}
                    </span>
                    {addon.isCurrent && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSelectedDetails = () => {
    if (!selectedAddon) return null;
    const { priceAmount } = getAddonPrice(selectedAddon);
    const usageLimits = selectedAddon?.usageLimits || [];
    const isAdded = Boolean(selectedAddon.isCurrent);

    return (
      <div className="bg-white rounded-xl flex flex-col h-full border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <h2 className="text-2xl font-bold text-gray-900">{selectedAddon.name}</h2>
        </div>

        <div className="p-6 flex-1 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Product Description:</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              {selectedAddon.description || "No description available."}
            </p>
          </div>

          {selectedAddon.planDetails && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Details:</h3>
              <div
                className="text-lg text-gray-600 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedAddon.planDetails }}
              />
            </div>
          )}

          {usageLimits.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 bg-gray-50 p-2 rounded">Includes:</h3>
              <ul className="space-y-4">
                {usageLimits.map((limit, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg text-gray-600">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{limit.featureName}: <strong>+{limit.maxQuota}</strong></span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-between gap-4 bg-gray-50/50 rounded-b-xl">
          <span className="self-center text-xl font-bold text-orange-600">
            Total: {priceAmount > 0 ? formatCurrency(priceAmount) : "Free"}
          </span>
          <Button
            mode={isAdded ? "secondary" : "primary"}
            size="lg"
            className="min-w-[160px]"
            onClick={() => handleAddonClick(selectedAddon)}
          >
            {isAdded ? "Manage Plan" : "Buy Now"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 items-stretch mt-4 min-h-[500px] md:h-[calc(100vh-260px)]">
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-1/3 shrink-0 bg-white rounded-xl border border-gray-200 p-2 shadow-sm overflow-y-auto max-h-[800px] scrollbar-thin">
          {renderNavList("Usage Quotas", quotaPlans)}
          {renderNavList("Premium Features", featurePlans)}
        </div>

        {/* Right Details Pane */}
        <div className="w-full md:w-2/3 flex-1">
          {renderSelectedDetails()}
        </div>
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        plan={selectedAddonForModal}
        selectedDuration={null}
        onSuccess={onPaymentSuccess}
      />
    </>
  );
};

export default Addons;