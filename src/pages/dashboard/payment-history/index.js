import { useEffect, useMemo, useState } from "react";
import { Dropdown, Empty } from "antd";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import { useGetPaymentHistoryQuery } from "@/apis/paymentApi";
import { toLocalDateTimeParam, formatDateTime } from "@/utils/dateTimeUtils";
import formatCurrency from "@/utils/formatCurrency";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faClockRotateLeft, faCreditCard, faMagnifyingGlass } from "@/utils/icons";

const DATE_PRESETS = [
  { key: 30, label: "Last 30 Days" },
  { key: 90, label: "Last 90 Days" },
  { key: 365, label: "Last 12 Months" },
];

const STATUS_OPTIONS = [
  { key: "ALL", label: "All Statuses" },
  { key: "SUCCESS", label: "Success" },
  { key: "PENDING", label: "Pending" },
  { key: "FAILED", label: "Failed" },
];

const DEFAULT_PAGE_SIZE = 10;

const getDateRangeByPreset = (days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);
  return { startDate, endDate };
};

const statusClassName = {
  SUCCESS: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  PENDING: "bg-amber-50 text-amber-700 border border-amber-100",
  FAILED: "bg-red-50 text-red-700 border border-red-100",
};

const planTypeLabel = {
  MAIN: "Main Plan",
  ADDONS_QUOTA: "Quota Add-on",
  ADDONS_FEATURE: "Feature Add-on",
};

const paymentMethodLabel = {
  CREDIT_CARD: "Credit Card",
  VNPAY: "VNPay",
  SEPAY: "SePay",
  MOMO: "MoMo",
  BANK_TRANSFER: "Bank Transfer",
  ADMIN_GRANTED: "Admin Granted",
};

const PaymentHistory = () => {
  const hasAccessToken = Boolean(localStorage.getItem("accessToken"));
  const [searchValue, setSearchValue] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(30);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedSearch(searchValue.trim());
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const dateRange = useMemo(() => getDateRangeByPreset(selectedPreset), [selectedPreset]);

  const queryParams = useMemo(
    () => ({
      page,
      size: DEFAULT_PAGE_SIZE,
      startDate: toLocalDateTimeParam(dateRange.startDate),
      endDate: toLocalDateTimeParam(dateRange.endDate),
      paymentStatus: selectedStatus === "ALL" ? undefined : selectedStatus,
      query: appliedSearch || undefined,
    }),
    [appliedSearch, dateRange.endDate, dateRange.startDate, page, selectedStatus]
  );

  const {
    data: historyData,
    isLoading,
    isError,
  } = useGetPaymentHistoryQuery(queryParams, { skip: !hasAccessToken });

  const historyContent = historyData?.content ?? [];
  const pageNumber = historyData?.pageNumber ?? 0;
  const totalPages = Math.max(1, historyData?.totalPages ?? 1);

  return (
    <div className="space-y-6">
      <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment History</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Review completed, pending, and failed payments for your subscriptions.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-orange-50 text-primary px-4 py-2 text-sm font-semibold">
            <FontAwesomeIcon icon={faCreditCard} />
            Billing Timeline
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="relative w-full xl:max-w-sm">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-[18px]" />
            <input
              type="text"
              placeholder="Search by plan name or transaction code"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <Dropdown
              menu={{
                items: STATUS_OPTIONS.map((option) => ({
                  key: option.key,
                  label: option.label,
                })),
                selectable: true,
                selectedKeys: [selectedStatus],
                onClick: ({ key }) => {
                  setSelectedStatus(key);
                  setPage(0);
                },
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button type="button" mode="secondary" shape="rounded" className="!px-4 !py-2 !text-sm">
                <span className="inline-flex items-center gap-2">
                  {STATUS_OPTIONS.find((option) => option.key === selectedStatus)?.label || "All Statuses"}
                  <FontAwesomeIcon icon={faChevronDown} className="text-[14px]" />
                </span>
              </Button>
            </Dropdown>

            <Dropdown
              menu={{
                items: DATE_PRESETS.map((preset) => ({
                  key: preset.key.toString(),
                  label: preset.label,
                })),
                selectable: true,
                selectedKeys: [selectedPreset.toString()],
                onClick: ({ key }) => {
                  setSelectedPreset(Number(key));
                  setPage(0);
                },
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button type="button" mode="secondary" shape="rounded" className="!px-4 !py-2 !text-sm">
                <span className="inline-flex items-center gap-2">
                  <FontAwesomeIcon icon={faClockRotateLeft} />
                  {DATE_PRESETS.find((preset) => preset.key === selectedPreset)?.label || "Last 30 Days"}
                  <FontAwesomeIcon icon={faChevronDown} className="text-[14px]" />
                </span>
              </Button>
            </Dropdown>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider">Paid / Created Time</th>
                <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider">Method</th>
                <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider">Transaction Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td className="px-6 py-10" colSpan={6}>
                    <Loading className="py-0" />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td className="px-6 py-10 text-sm text-red-500" colSpan={6}>
                    Failed to load payment history.
                  </td>
                </tr>
              ) : historyContent.length === 0 ? (
                <tr>
                  <td className="px-6 py-10" colSpan={6}>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={<span className="text-gray-500 dark:text-gray-400">No payment history found for the current filters.</span>}
                    />
                  </td>
                </tr>
              ) : (
                historyContent.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-5 text-sm text-gray-700 dark:text-gray-200">
                      <div className="font-medium">{formatDateTime(item?.paidAt || item?.createdAt)}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item?.paidAt ? "Paid at" : "Created at"}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700 dark:text-gray-200">
                      <div className="font-semibold text-gray-900 dark:text-white">{item?.planName || "Unknown plan"}</div>
                      <div className="mt-1 text-xs inline-flex items-center rounded-full bg-gray-100 text-gray-600 px-2 py-0.5">
                        {planTypeLabel[item?.planType] || item?.planType || "Plan"}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item?.amount)}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700 dark:text-gray-200">
                      <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${statusClassName[item?.paymentStatus] || "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                        {item?.paymentStatus || "UNKNOWN"}
                      </div>
                      {item?.note ? (
                        <div className="text-xs text-gray-500 mt-2 max-w-[240px]">{item.note}</div>
                      ) : null}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700 dark:text-gray-200">
                      {paymentMethodLabel[item?.paymentMethod] || item?.paymentMethod || "-"}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700 dark:text-gray-200">
                      <span className="font-mono text-xs rounded-lg bg-gray-50 border border-gray-100 px-2.5 py-1 inline-flex">
                        {item?.transactionCode || "-"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <Pagination
            currentPage={pageNumber + 1}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage - 1)}
          />
        </div>
      </section>
    </div>
  );
};

export default PaymentHistory;
