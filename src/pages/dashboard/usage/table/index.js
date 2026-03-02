import { Dropdown, Space, Empty } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Button from "@/components/Button";
import Pagination from "@/components/Pagination";
import { formatDateTime } from "@/utils/dateTimeUtils";

const Table = ({
  searchValue,
  setSearchValue,
  selectedPreset,
  setSelectedPreset,
  DATE_PRESETS,
  setPage,
  isHistoryLoading,
  isHistoryError,
  historyContent,
  pageNumber,
  totalPages,
}) => {
  return (
    <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative w-full lg:max-w-sm">
          <span className="material-icons-round text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search activity logs..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

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
          trigger={['click']}
          placement="bottomRight"
        >
          <Button type="button" mode="secondary" shape="rounded" className="!px-4 !py-2 !text-sm flex items-center gap-2">
            <Space>
              {DATE_PRESETS.find((p) => p.key === selectedPreset)?.label || "Select Range"}
              <DownOutlined className="text-[10px]" />
            </Space>
          </Button>
        </Dropdown>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider">
                Activity
              </th>
              <th className="px-6 py-4 text-center text-[13px] font-semibold text-gray-500 tracking-wider">
                Usage Count
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-semibold text-gray-500 tracking-wider">
                Plan
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isHistoryLoading ? (
              <tr>
                <td className="px-6 py-10 text-sm text-gray-500 dark:text-gray-400" colSpan={4}>
                  Loading usage history...
                </td>
              </tr>
            ) : isHistoryError ? (
              <tr>
                <td className="px-6 py-10 text-sm text-red-500" colSpan={4}>
                  Failed to load usage history.
                </td>
              </tr>
            ) : historyContent.length === 0 ? (
              <tr>
                <td className="px-6 py-10" colSpan={4}>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span className="text-gray-500 dark:text-gray-400">
                        No usage history in selected date range.
                      </span>
                    }
                  />
                </td>
              </tr>
            ) : (
              historyContent.map((item) => (
                <tr key={item?.id || `${item?.featureKey || "event"}-${item?.createdAt || ""}`}>
                  <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-300">{formatDateTime(item?.createdAt)}</td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-900 dark:text-white">
                    {item?.featureName || "Unknown feature"}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-700 dark:text-gray-200 font-mono text-center">
                    {Number(item?.amount ?? 0)}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-700 dark:text-gray-200">{item?.planName || "N/A"}</td>
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
  );
};

export default Table;
