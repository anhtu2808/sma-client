export const getScoreColor = (score) => {
  const s = Number(score) || 0;
  if (s < 50) return "text-red-500";
  if (s < 80) return "text-amber-500";
  return "text-emerald-500";
};

export const getFixProgress = (details) => {
  const all = details || [];
  const total = all.length;
  const fixed = all.filter(
    (d) => d.isFixed || d.status === "FIXED" || d.status === "MATCHED"
  ).length;
  const percent = total === 0 ? 0 : Math.round((fixed / total) * 100);
  return { fixed, total, percent };
};
