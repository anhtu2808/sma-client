import { useMemo, useState } from "react";
import { Row, Col } from "antd";
import {
  useGetFeatureUsageHistoryQuery,
  useGetFeatureUsageQuery,
} from "@/apis/featureUsageApi";
import { toLocalDateTimeParam } from "@/utils/dateTimeUtils";
import Header from "./header";
import Quota from "./quota";
import Table from "./table";

const DATE_PRESETS = [
  { key: 7, label: "Last 7 Days" },
  { key: 30, label: "Last 30 Days" },
  { key: 90, label: "Last 90 Days" },
];

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PRESET_DAYS = 30;

const mapQuotas = (quotas) => {
  if (!Array.isArray(quotas)) return [];
  return quotas
    .filter((quota) => quota?.usageType !== "BOOLEAN" && quota?.maxQuota != null)
    .map((quota) => ({
      key: quota?.featureKey || String(quota?.featureId ?? ""),
      label: quota?.featureName || quota?.featureKey || "Quota",
      used: Number(quota?.used ?? 0),
      total: Number(quota?.maxQuota ?? 0),
    }))
    .filter((quota) => quota.key);
};

const getDateRangeByPreset = (days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);
  return { startDate, endDate };
};

const Usage = () => {
  const hasAccessToken = Boolean(localStorage.getItem("accessToken"));
  const [searchValue, setSearchValue] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(DEFAULT_PRESET_DAYS);
  const [page, setPage] = useState(0);

  const { data: featureUsage = [], isLoading: isQuotaLoading, isError: isQuotaError } = useGetFeatureUsageQuery(undefined, {
    skip: !hasAccessToken,
  });

  const dateRange = useMemo(() => getDateRangeByPreset(selectedPreset), [selectedPreset]);

  const historyParams = useMemo(
    () => ({
      page,
      size: DEFAULT_PAGE_SIZE,
      startDate: toLocalDateTimeParam(dateRange.startDate),
      endDate: toLocalDateTimeParam(dateRange.endDate),
    }),
    [dateRange.endDate, dateRange.startDate, page]
  );

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useGetFeatureUsageHistoryQuery(historyParams, { skip: !hasAccessToken });

  const quotas = useMemo(() => mapQuotas(featureUsage), [featureUsage]);
  const historyContent = historyData?.content ?? [];
  const pageNumber = historyData?.pageNumber ?? 0;
  const totalPages = Math.max(1, historyData?.totalPages ?? 1);

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Header />
      </Col>

      <Col span={24}>
        <Quota quotas={quotas} isQuotaLoading={isQuotaLoading} isQuotaError={isQuotaError} />
      </Col>

      <Col span={24}>
        <Table
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          selectedPreset={selectedPreset}
          setSelectedPreset={setSelectedPreset}
          DATE_PRESETS={DATE_PRESETS}
          setPage={setPage}
          isHistoryLoading={isHistoryLoading}
          isHistoryError={isHistoryError}
          historyContent={historyContent}
          pageNumber={pageNumber}
          totalPages={totalPages}
        />
      </Col>
    </Row>
  );
};

export default Usage;
