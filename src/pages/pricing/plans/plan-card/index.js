import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, replaceMaterialIconsInHtml } from '../../../../utils/icons';

const getSaveClass = (save) => {
  if (save >= 40) return "text-primary";
  if (save >= 25) return "text-primary";
  return "text-gray-400";
};

const PlanCard = ({ plan, isExpanded, onExpand, onClose, selectedDuration, onSelectDuration, isSelected, onClick, onOpenPaymentModal }) => {
  const navigate = useNavigate();
  const isCurrent = plan.current;
  const isDowngrade = plan.isDowngrade;
  const isDefault = Boolean(plan.isDefault);
  const hasDurations = plan.durations && plan.durations.length > 0;
  const isDisabled = isCurrent || isDowngrade;
  const handleAction = () => {
    if (isCurrent) return;
    if (isDisabled) return;
    if (hasDurations) {
      onExpand();
    } else {
      if (onOpenPaymentModal) {
        onOpenPaymentModal(plan, null);
      } else {
        navigate('/checkout', { state: { plan } });
      }
    }
  };

  return (
    <article
      onClick={!isDisabled ? onClick : undefined}
      className={`relative rounded-2xl border p-8 shadow-sm flex flex-col h-full md:h-[690px] transition-all select-none ${isSelected
        ? "border-2 border-primary shadow-lg md:scale-[1.02] z-10 cursor-pointer"
        : isDisabled
          ? "border-gray-200 opacity-80 cursor-default"
          : "border-gray-200 hover:border-gray-300 cursor-pointer"
        }`}
    >
      {plan.popular ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-sm">
          Popular Choice
        </span>
      ) : null}

      {!isExpanded ? (
        <>
          <div className="mb-8">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              {isCurrent && (
                <span className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase">Current</span>
              )}
            </div>
            <p
              className="text-sm text-gray-500 line-clamp-2 min-h-[42px]"
              title={plan.description}
            >
              {plan.description}
            </p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
              <span className="text-gray-500 font-medium">{plan.unit}</span>
            </div>
          </div>

          {!isDefault && (
            <button
              type="button"
              disabled={isDisabled}
              onClick={(e) => {
                e.stopPropagation();
                handleAction();
              }}
              className={`w-full py-3 px-4 font-semibold rounded-lg mb-8 transition-all ${isDisabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {plan.cta}
            </button>
          )}

          {plan.detailsHtml ? (
            <div className="flex-1" dangerouslySetInnerHTML={{ __html: replaceMaterialIconsInHtml(plan.detailsHtml) }} />
          ) : null}
        </>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Select Duration</h3>
            <Button
              mode="ghost"
              className="text-gray-400 hover:text-gray-600 p-1"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              btnIcon
            >
              <FontAwesomeIcon icon={faXmark} className="text-[20px]" />
            </Button>
          </div>

          <div className="space-y-3 mb-8 flex-1">
            {plan.durations.map((duration) => {
              const selected = selectedDuration === duration.key;
              return (
                <button
                  type="button"
                  key={duration.key}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDuration(duration.key);
                  }}
                  className={`w-full text-left flex flex-col p-4 border rounded-xl transition-all bg-white shadow-sm relative ${selected ? "border-primary ring-2 ring-primary bg-orange-50/40" : "border-gray-100 hover:border-gray-200"
                    } ${duration.mostPopular ? "pt-6" : ""}`}
                >
                  {duration.mostPopular ? (
                    <div className="absolute top-0 right-4 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-b-md uppercase">
                      Most Popular
                    </div>
                  ) : null}
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <span className="text-base font-bold text-gray-900">{duration.label}</span>
                      <div className={`mt-1 text-[11px] font-bold uppercase ${getSaveClass(duration.save)}`}>
                        Save {duration.save}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{duration.total}</div>
                      <div className="text-xs text-gray-400">{duration.perMonth}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {!isDefault && (
            <Button
              mode="primary"
              shape="rounded"
              onClick={(e) => {
                e.stopPropagation();
                const duration = selectedDuration || (plan.durations.length > 0 ? plan.durations[0].key : null);
                if (onOpenPaymentModal) {
                  onOpenPaymentModal(plan, duration);
                } else {
                  navigate('/checkout', { state: { plan, selectedDuration: duration } });
                }
              }}
              className={`w-full py-4 font-bold rounded-xl transition-all shadow-lg text-sm tracking-wide ${isCurrent
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-dark"
                }`}
              disabled={isDisabled}
            >
              {isCurrent ? "Current Plan" : "Subscribe Now"}
            </Button>
          )}
        </div>
      )}
    </article>
  );
};

export default PlanCard;
