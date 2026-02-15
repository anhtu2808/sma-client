import Button from "@/components/Button";

const getSaveBadgeStyle = (savePercent) => {
  if (savePercent >= 40) {
    return "bg-teal-100 text-teal-700";
  }
  if (savePercent >= 25) {
    return "bg-orange-100 text-orange-700";
  }
  return "bg-gray-100 text-gray-500";
};

const PlanCard = ({ plan, isExpanded, onExpand, onClose, selectedDuration, onSelectDuration }) => {
  const isCurrent = plan.current;
  const canExpand = !isCurrent && plan.durations.length > 0;

  return (
    <article
      className={`relative rounded-2xl border p-8 shadow-sm transition-all flex flex-col lg:h-[720px] ${
        isCurrent
          ? "bg-white border-gray-200"
          : plan.popular
          ? "bg-white border-2 border-primary shadow-md"
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
    >
      {plan.popular ? (
        <span className="absolute -top-3 right-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          Popular
        </span>
      ) : null}

      {!isExpanded ? (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              {isCurrent ? (
                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  Current
                </span>
              ) : null}
            </div>
            <p
              className="text-sm text-gray-500 leading-relaxed line-clamp-2 min-h-[42px]"
              title={plan.description}
            >
              {plan.description}
            </p>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-gray-900">{plan.basePriceLabel}</span>
              <span className="text-gray-500 font-medium">{plan.baseUnit}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">{plan.note}</p>
          </div>

          <button
            type="button"
            disabled={!canExpand}
            onClick={() => (canExpand ? onExpand() : null)}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all mb-8 ${
              !canExpand
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : plan.popular
                ? "bg-primary hover:bg-primary-dark text-white shadow-md"
                : "bg-white border border-gray-300 hover:border-primary hover:text-primary text-gray-700"
            }`}
          >
            {plan.cta}
          </button>

          {plan.detailsHtml ? (
            <div className="flex-1" dangerouslySetInnerHTML={{ __html: plan.detailsHtml }} />
          ) : null}
        </>
      ) : (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Special Plans</h3>
              <p className="text-sm text-gray-500 mt-1">Pick the right plan for you</p>
            </div>
            <Button
              mode="ghost"
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors -mt-2 -mr-2"
              onClick={onClose}
              btnIcon
            >
              <span className="material-icons-round text-[20px]">close</span>
            </Button>
          </div>

          <div className="flex flex-col gap-4 mb-6 flex-1">
            {plan.durations.map((duration) => {
              const selected = selectedDuration === duration.key;
              return (
                <button
                  type="button"
                  key={duration.key}
                  onClick={() => onSelectDuration(duration.key)}
                  className={`text-left block p-4 bg-white border shadow-sm rounded-xl transition-all relative overflow-hidden ${
                    selected ? "border-primary ring-1 ring-primary" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  {duration.mostPopular ? (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-4 py-0.5 rounded-b-lg shadow-sm">
                      Most Popular
                    </div>
                  ) : null}
                  <div className={`flex justify-between items-start ${duration.mostPopular ? "pt-2" : ""}`}>
                    <div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-2xl font-bold text-gray-800">{duration.months}</span>
                        <span className="text-lg font-medium text-gray-600">months</span>
                      </div>
                      <span
                        className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${getSaveBadgeStyle(
                          duration.savePercent
                        )}`}
                      >
                        Save {duration.savePercent}%
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{duration.total}</div>
                      <div className="text-xs text-gray-400 mt-1">{duration.monthly}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <Button
            mode="primary"
            shape="rounded"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-md mt-auto text-sm tracking-wide"
          >
            Subscribe Now
          </Button>
        </div>
      )}
    </article>
  );
};

export default PlanCard;
