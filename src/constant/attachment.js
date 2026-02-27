export const POLL_INTERVAL_MS = 2000;
export const POLL_TIMEOUT_MS = 90_000;
export const TERMINAL_PARSE_STATUSES = new Set(["FINISH", "FAIL"]);

export const PARSE_STATUS_META = {
  WAITING: {
    label: "Not parsed",
    className: "border-gray-200 bg-gray-100 text-gray-600",
  },
  PARTIAL: {
    label: "Parsing...",
    className: "border-amber-200 bg-amber-100 text-amber-700",
  },
  FINISH: {
    label: "Parsed",
    className: "border-emerald-200 bg-emerald-100 text-emerald-700",
  },
  FAIL: {
    label: "Parse failed",
    className: "border-red-200 bg-red-100 text-red-700",
  },
};

export const getErrorMessage = (error, fallbackMessage) =>
  error?.data?.message || error?.message || fallbackMessage;

export const normalizeParseStatus = (status) =>
  typeof status === "string" ? status.toUpperCase() : "WAITING";

export const isPdfFile = (fileName = "") => fileName.toLowerCase().endsWith(".pdf");

export const getParseStatusView = (status, isPolling) => {
  if (isPolling) {
    return PARSE_STATUS_META.PARTIAL;
  }

  return PARSE_STATUS_META[normalizeParseStatus(status)] || PARSE_STATUS_META.WAITING;
};
