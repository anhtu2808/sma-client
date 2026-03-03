import Button from '@/components/Button';

const getRelativeTime = (receivedAt) => {
  const timestamp = new Date(receivedAt).getTime();

  if (Number.isNaN(timestamp)) return 'Unknown time';

  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) return `${Math.max(diffMinutes, 1)} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(receivedAt));
};

const getAiMatchClasses = (aiMatch) => {
  if (aiMatch >= 90) {
    return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800';
  }
  if (aiMatch >= 80) {
    return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800';
  }
  return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800';
};

const STATUS_META = {
  accepted: {
    label: 'Accepted',
    classes:
      'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800',
    icon: 'check_circle',
  },
  declined: {
    label: 'Declined',
    classes:
      'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800',
    icon: 'cancel',
  },
};

const InvitationCard = ({ item, activeTab, onAccept, onDecline, onViewDetails }) => {
  const statusMeta = STATUS_META[item.status] || null;

  return (
    <article className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-all hover:shadow-md">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-2 shrink-0 shadow-sm overflow-hidden">
              <img alt={`${item.company} logo`} className="w-full h-full object-cover rounded-md" src={item.companyLogo} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{item.title}</h2>
                  <p className="text-sm font-medium text-primary mt-0.5">{item.company}</p>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getAiMatchClasses(
                    item.aiMatch
                  )}`}
                >
                  <span className="material-icons-round text-[14px]">auto_awesome</span>
                  AI Match: {item.aiMatch}%
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/70 rounded-xl p-4 mb-4 border border-gray-100 dark:border-gray-700/70 relative">
                <span className="absolute -top-2 left-6 w-4 h-4 bg-gray-50 dark:bg-gray-800 border-t border-l border-gray-100 dark:border-gray-700 rotate-45" />
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    <img alt={item.recruiterName} className="w-full h-full object-cover" src={item.recruiterAvatar} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">
                      {item.recruiterName}
                      <span className="text-gray-500 dark:text-gray-400 font-normal"> • {item.recruiterRole}</span>
                    </p>
                    <p className="text-sm italic text-gray-500 dark:text-gray-400 line-clamp-2">"{item.message}"</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                  <span className="material-icons-round text-[16px]">payments</span>
                  {item.salaryText}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                  <span className="material-icons-round text-[16px]">location_on</span>
                  {item.locationText}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                  <span className="material-icons-round text-[16px]">schedule</span>
                  {item.employmentType}
                </span>
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:w-56 flex lg:flex-col items-center lg:items-end justify-between gap-4 lg:border-l lg:border-gray-100 dark:lg:border-gray-700 lg:pl-6">
          <div className="text-right hidden lg:block">
            <p className="text-xs text-gray-500 dark:text-gray-400">Received</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{getRelativeTime(item.receivedAt)}</p>
          </div>

          <div className="w-full flex flex-col gap-3">
            {activeTab === 'new' ? (
              <>
                <Button
                  type="button"
                  mode="primary"
                  shape="rounded"
                  className="w-full !px-4 !py-2.5 !text-sm !font-semibold"
                  onClick={() => onAccept(item.id)}
                >
                  Accept
                </Button>
                <Button
                  type="button"
                  mode="secondary"
                  shape="rounded"
                  className="w-full !px-4 !py-2.5 !text-sm !font-medium"
                  onClick={() => onDecline(item.id)}
                >
                  Decline
                </Button>
              </>
            ) : (
              statusMeta && (
                <div className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold ${statusMeta.classes}`}>
                  <span className="material-icons-round text-[16px]">{statusMeta.icon}</span>
                  {statusMeta.label}
                </div>
              )
            )}

            <Button
              type="button"
              mode="ghost"
              shape="rounded"
              className="w-full !px-2 !py-1.5 !text-xs !text-primary !font-semibold"
              onClick={() => onViewDetails(item.jobId)}
            >
              View Details
            </Button>
          </div>
        </aside>
      </div>
    </article>
  );
};

export default InvitationCard;
