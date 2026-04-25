import Button from "@/components/Button";
import formatCurrency from "@/utils/formatCurrency";

const Addons = ({ quotaPlans = [], featurePlans = [], onOpenPaymentModal }) => {
    if (quotaPlans.length === 0 && featurePlans.length === 0) return null;

    const renderAddonItem = (addon) => {
        const prices = Array.isArray(addon?.planPrices) ? addon.planPrices : [];
        const activePrice = prices.find((p) => p?.isActive !== false) || {};
        const priceAmount = activePrice.salePrice ?? activePrice.originalPrice ?? 0;
        const isAdded = Boolean(addon.isCurrent);

        return (
            <div key={addon.id} className="bg-white rounded-xl p-5 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-md transition-all group">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{addon.name}</h4>
                        {isAdded && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase">Active</span>}
                    </div>
                    <p className="text-xs text-gray-500">{addon.description}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    <span className="text-sm font-bold text-gray-900">
                        {priceAmount > 0 ? `+${formatCurrency(priceAmount)}` : "Free"}
                    </span>
                    <Button
                        mode={isAdded ? "secondary" : "primary"}
                        className="!py-1.5 !px-6 !text-xs !font-bold rounded-lg"
                        onClick={() => onOpenPaymentModal({
                            ...addon,
                            basePriceLabel: formatCurrency(priceAmount),
                            priceId: activePrice.id,
                            durations: []
                        }, null)}
                    >
                        {isAdded ? "Active" : "Buy Now"}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100 space-y-8">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>Add-ons
            </h2>

            <div className="grid grid-cols-1 gap-6">
                {quotaPlans.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 ml-1">Usage Quotas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {quotaPlans.map(renderAddonItem)}
                        </div>
                    </div>
                )}

                {featurePlans.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 ml-1 uppercase">Premium Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {featurePlans.map(renderAddonItem)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Addons;