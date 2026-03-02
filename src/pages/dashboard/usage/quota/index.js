import Loading from "@/components/Loading";

const Quota = ({ quotas, isQuotaLoading, isQuotaError }) => {
  return (
    <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-orange-100 text-primary flex items-center justify-center">
          <span className="material-icons-round text-[22px]">pie_chart</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Monthly Quota</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Remaining balance for current billing cycle.</p>
        </div>
      </div>

      {isQuotaLoading ? (
        <Loading />
      ) : isQuotaError ? (
        <p className="text-sm text-red-500">Failed to load quota data.</p>
      ) : quotas.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No quota data available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quotas.map((quota) => {
            const percent = quota.total > 0 ? Math.min(100, Math.round((quota.used / quota.total) * 100)) : 0;
            return (
              <div className="space-y-2" key={quota.key}>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{quota.label}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {quota.used}
                    <span className="text-gray-400"> / {quota.total}</span>
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Quota;