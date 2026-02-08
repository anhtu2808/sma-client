export const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatRange = (startDate, endDate, isCurrent) => {
  const start = formatDate(startDate);
  const end = isCurrent ? "Present" : formatDate(endDate);
  if (start === "N/A" && end === "N/A") return "N/A";
  return `${start} - ${end}`;
};

export const getValidLink = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

export const getHostLabel = (url) => {
  if (!url) return null;
  const safeUrl = getValidLink(url);
  try {
    return new URL(safeUrl).host;
  } catch (error) {
    return url;
  }
};

export const toMonthInputValue = (value) => {
  if (!value) return "";
  const parsed = `${value}`.slice(0, 7);
  return /^\d{4}-\d{2}$/.test(parsed) ? parsed : "";
};

export const monthValueToApiDate = (monthValue) => {
  if (!monthValue) return null;
  return `${monthValue}-01`;
};

export const enumToLabel = (value) => {
  if (!value) return "N/A";
  return `${value}`
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const formatYearsOfExperience = (years) => {
  if (years == null || Number.isNaN(Number(years))) return "N/A";
  const normalized = Number(years);
  if (normalized <= 0) return "< 1 year";
  if (normalized === 1) return "1 year";
  return `${normalized} years`;
};
