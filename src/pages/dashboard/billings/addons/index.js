import { useState, useEffect } from "react";
import Button from "@/components/Button";
import PaymentModal from "@/pages/checkout/components/PaymentModal";
import formatCurrency from "@/utils/formatCurrency";
import { formatDateTime } from "@/utils/dateTimeUtils";

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

  const getOwnedQuotaState = (addon) => {
    const empty = { isOwnedAndUsable: false, endDate: null, used: 0, max: 0, featureName: null };
    const info = addon?.activeAddonSubscription;
    if (!info || !info.endDate) return empty;
    const used = Number(info.used ?? 0);
    const max = Number(info.maxQuota ?? 0);
    if (max <= 0) return { ...empty, endDate: info.endDate };
    const exhausted = used >= max;
    return {
      isOwnedAndUsable: !exhausted,
      endDate: info.endDate,
      used,
      max,
      featureName: info.featureName,
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

  const renderNavList = (items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="space-y-1">
        {items.map((addon) => {
          const isSelected = selectedAddon?.id === addon.id;
          const { priceAmount } = getAddonPrice(addon);
          const { isOwnedAndUsable } = getOwnedQuotaState(addon);
          const isActive = addon.isCurrent || isOwnedAndUsable;
          return (
            <div
              key={addon.id}
              onClick={() => setSelectedAddon(addon)}
              className={`cursor-pointer border-l-4 p-3 rounded-r-md transition-all min-w-0 ${isSelected
                ? "border-orange-500 bg-orange-50 shadow-sm"
                : "border-transparent hover:bg-gray-50"
                }`}
            >
              <div className="flex flex-col min-w-0">
                <span className={`text-sm font-semibold truncate ${isSelected ? 'text-orange-600' : 'text-gray-700'}`}>
                  {addon.name}
                </span>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-gray-500 font-medium">
                    {priceAmount > 0 ? formatCurrency(priceAmount) : "Free"}
                  </span>
                  {isActive && (
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
    );
  };

  const renderSelectedDetails = () => {
    if (!selectedAddon) return null;
    const { priceAmount } = getAddonPrice(selectedAddon);
    const { isOwnedAndUsable, endDate, used, max, featureName } = getOwnedQuotaState(selectedAddon);
    const isAdded = Boolean(selectedAddon.isCurrent);
    const blockBuy = isOwnedAndUsable;
    const showUsage = blockBuy && max > 0;
    const usagePct = showUsage ? Math.min(100, Math.round((used / max) * 100)) : 0;

    return (
      <div className="bg-white rounded-xl flex flex-col border border-gray-100 shadow-sm min-w-0">
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

          {showUsage && (
            <div className="rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50/60 to-white p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">Current usage</p>
                  <p className="text-base font-semibold text-gray-900 mt-0.5">{featureName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 leading-none">
                    {used}<span className="text-base text-gray-400 font-medium"> / {max}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{Math.max(max - used, 0)} remaining</p>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-orange-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all"
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50 rounded-b-xl">
          {blockBuy ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 text-emerald-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Active</span>
                <span className="text-sm font-semibold text-gray-700">
                  Until {formatDateTime(endDate)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Total</span>
              <span className="text-2xl font-bold text-orange-600">
                {priceAmount > 0 ? formatCurrency(priceAmount) : "Free"}
              </span>
            </div>
          )}
          <Button
            mode={blockBuy || isAdded ? "secondary" : "primary"}
            size="lg"
            className="min-w-[160px]"
            disabled={blockBuy}
            onClick={() => !blockBuy && handleAddonClick(selectedAddon)}
          >
            {blockBuy ? "Owned" : isAdded ? "Manage Plan" : "Buy Now"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 items-start mt-4">
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-1/3 shrink-0 bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
          {renderNavList([...quotaPlans, ...featurePlans])}
        </div>

        {/* Right Details Pane */}
        <div className="w-full md:w-2/3 flex-1 min-w-0">
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