import { useState } from 'react';
import Button from '@/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faClock, faCreditCard, faLocationDot, faRotate } from '../../../../utils/icons';

const STATUS_META = {
  accepted: {
    label: 'Accepted',
    classes:
      'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800',
    icon: faCircleCheck,
  },
  declined: {
    label: 'Declined',
    classes:
      'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800',
    icon: faCircleXmark,
  },
};

const InvitationCard = ({ item, activeTab, onViewDetails, onAccept, onDecline, isProcessing }) => {
  const statusMeta = STATUS_META[item.status] || null;
  const showActions = activeTab === 'new';
  const viewDetailsTooltip = item.jobId ? null : 'This invitation does not include a job reference yet.';
  const isCurrentProcessing = isProcessing?.[item.id] || false;

  return (
    <article className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-all hover:shadow-md">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-2 shrink-0 shadow-sm overflow-hidden">
              <img alt={`${item.company} logo`} className="w-full h-full object-cover rounded-md" src={item.companyLogo} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{item.title}</h2>
                  <p className="text-sm font-medium text-primary mt-0.5">{item.company}</p>
                </div>
              </div>

              {item.message ? (
                <div className="bg-gray-50 dark:bg-gray-800/70 rounded-xl p-4 mb-4 border border-gray-100 dark:border-gray-700/70">
                  <p className="text-sm italic text-gray-500 dark:text-gray-400 line-clamp-3">"{item.message}"</p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2.5">
                {item.salaryText ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                    <FontAwesomeIcon icon={faCreditCard} className="text-[16px]" />
                    {item.salaryText}
                  </span>
                ) : null}
                {item.locationText ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                    <FontAwesomeIcon icon={faLocationDot} className="text-[16px]" />
                    {item.locationText}
                  </span>
                ) : null}
                {item.workModeLabel ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                    <FontAwesomeIcon icon={faClock} className="text-[16px]" />
                    {item.workModeLabel}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:w-56 flex lg:flex-col items-center lg:items-end justify-between gap-4 lg:border-l lg:border-gray-100 dark:lg:border-gray-700 lg:pl-6">
          <div className="w-full flex flex-col gap-3">
            {showActions ? (
              <>
                <Button
                  type="button"
                  mode="primary"
                  shape="rounded"
                  className="w-full !px-4 !py-2.5 !text-sm !font-semibold"
                  disabled={isCurrentProcessing}
                  onClick={() => onAccept?.(item.id)}
                >
                  {isCurrentProcessing ? (
                    <span className="inline-flex items-center gap-2">
                      <FontAwesomeIcon icon={faRotate} className="animate-spin text-[16px]" />
                      Processing...
                    </span>
                  ) : (
                    'Accept'
                  )}
                </Button>
                <Button
                  type="button"
                  mode="secondary"
                  shape="rounded"
                  className="w-full !px-4 !py-2.5 !text-sm !font-medium"
                  disabled={isCurrentProcessing}
                  onClick={() => onDecline?.(item.id)}
                >
                  {isCurrentProcessing ? (
                    <span className="inline-flex items-center gap-2">
                      <FontAwesomeIcon icon={faRotate} className="animate-spin text-[16px]" />
                      Processing...
                    </span>
                  ) : (
                    'Decline'
                  )}
                </Button>
              </>
            ) : (
              statusMeta && (
                <div className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold ${statusMeta.classes}`}>
                  <FontAwesomeIcon icon={statusMeta.icon} className="text-[16px]" />
                  {statusMeta.label}
                </div>
              )
            )}

            <Button
              type="button"
              mode="ghost"
              shape="rounded"
              className="w-full !px-2 !py-1.5 !text-xs !text-primary !font-semibold"
              disabled={!item.jobId}
              tooltip={viewDetailsTooltip}
              onClick={() => onViewDetails(item.jobId)}
            >
              View Job Detail
            </Button>
          </div>
        </aside>
      </div>
    </article>
  );
};

export default InvitationCard;
