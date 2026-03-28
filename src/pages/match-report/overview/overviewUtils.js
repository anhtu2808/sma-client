/**
 * Parse AI-generated text into individual bullet items.
 * Handles: newline-separated, numbered lists, semicolon-separated, dash-prefixed.
 */
export const parseTextToItems = (text) => {
  if (!text || typeof text !== "string") return [];

  return text
    .split(/[\n;]/)
    .map((s) => s.replace(/^\s*\d+[.)]\s*/, ""))
    .map((s) => s.replace(/^\s*[-*]\s*/, ""))
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
};

/**
 * Get visual configuration for match level.
 */
export const getMatchLevelConfig = (matchLevel) => {
  const level = (matchLevel || "").toUpperCase();

  switch (level) {
    case "EXCELLENT":
      return {
        label: "Excellent Match",
        icon: "emoji_events",
        ringColor: "#10B981",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-700",
      };
    case "GOOD":
      return {
        label: "Good Match",
        icon: "thumb_up",
        ringColor: "#3B82F6",
        badgeBg: "bg-blue-50",
        badgeText: "text-blue-700",
      };
    case "FAIR":
      return {
        label: "Fair Match",
        icon: "info",
        ringColor: "#F59E0B",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-700",
      };
    case "POOR":
      return {
        label: "Poor Match",
        icon: "warning",
        ringColor: "#EF4444",
        badgeBg: "bg-red-50",
        badgeText: "text-red-700",
      };
    default:
      return {
        label: level || "Unknown",
        icon: "help_outline",
        ringColor: "#6B7280",
        badgeBg: "bg-neutral-50",
        badgeText: "text-neutral-700",
      };
  }
};
