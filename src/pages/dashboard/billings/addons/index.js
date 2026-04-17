import { useState } from "react";
import Button from "@/components/Button";
import PaymentModal from "@/pages/checkout/components/PaymentModal";

const formatCurrency = (amount) => {
  if (amount == null || Number.isNaN(Number(amount))) return "-";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

const Addons = ({ plans = [], onPaymentSuccess }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAddonForModal, setSelectedAddonForModal] = useState(null);

  const handleAddToPlan = (addon, priceObj) => {
    setSelectedAddonForModal({
      id: addon.id,
      name: addon.name,
      priceId: priceObj.id,
      price: formatCurrency(priceObj.salePrice ?? priceObj.originalPrice ?? 0),
      durations: [],
    });
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedAddonForModal(null);
  };

  if (!plans || plans.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-4">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Add-ons
      </h2>
      
      <div className="mb-4">
        <h3 className="text-[13px] font-bold text-gray-500">Usage Quotas</h3>
      </div>

      <div className="space-y-3">
        {plans.map((addon) => {
          const prices = Array.isArray(addon?.planPrices) ? addon.planPrices : [];
          const activePrices = prices.filter((price) => price?.isActive !== false);
          const priceObj = activePrices[0] || {};
          
          const priceAmount = priceObj.salePrice ?? priceObj.originalPrice ?? 0;
          const isAdded = Boolean(addon.isCurrent);

          return (
            <div key={addon.id} className="bg-white rounded-xl px-6 py-5 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
              <div className="flex items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-extrabold text-gray-900">{addon.name}</h3>
                    {isAdded && (
                      <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-md">ADDED</span>
                    )}
                  </div>
                  {addon.description && (
                    <p className="text-[13px] text-gray-500">{addon.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-[15px] font-extrabold text-gray-900">
                  {priceAmount > 0 ? `+${formatCurrency(priceAmount)}` : "Free"}
                </span>
                <Button
                  mode={isAdded ? "secondary" : "primary"}
                  shape="rounded"
                  className="!text-[13px] !font-bold !py-2 !px-5"
                  {...(!isAdded && { onClick: () => handleAddToPlan(addon, priceObj) })}
                >
                  {isAdded ? "Manage" : "Add to plan"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        plan={selectedAddonForModal}
        selectedDuration={null}
        onSuccess={onPaymentSuccess}
      />
    </div>
  );
};

export default Addons;