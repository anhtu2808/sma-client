import Button from "@/components/Button";

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

const Addons = ({ plans = [] }) => {
  if (!plans || plans.length === 0) return null;

  return (
    <div className="space-y-4 pt-4">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Add-ons
      </h2>
      <div className="space-y-4">
        {plans.map((addon) => {
          const prices = Array.isArray(addon?.planPrices) ? addon.planPrices : [];
          const activePrices = prices.filter((price) => price?.isActive !== false);
          const priceObj = activePrices[0] || {};
          
          const priceAmount = priceObj.salePrice ?? priceObj.originalPrice ?? 0;
          const currency = priceObj.currency || addon.currency || "VND";
          const unit = priceObj.unit === "MONTH" ? "/ user / month" : priceObj.unit ? `/ ${priceObj.unit.toLowerCase()}` : "/ month";
          
          const isAdded = Boolean(addon.isCurrent);

          return (
            <div key={addon.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div>
                  <div classNameapop="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-gray-900">{addon.name}</h3>
                    {isAdded && (
                      <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px] font-bold px-1.5 py-0.5 rounded">ADDED</span>
                    )}
                  </div>
                  {addon.description && (
                    <p className="text-sm text-gray-500">{addon.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-sm font-semibold text-gray-900">
                  {priceAmount > 0 ? `+${formatCurrency(priceAmount, currency)}` : "Free"}{" "}
                  {priceAmount > 0 && <span className="text-gray-500 font-normal">{unit}</span>}
                </span>
                <Button
                  mode={isAdded ? "secondary" : "primary"}
                  shape="rounded"
                  className="!text-sm !font-semibold"
                >
                  {isAdded ? "Manage" : "Add to plan"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Addons;