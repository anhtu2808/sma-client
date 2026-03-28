import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const OverviewRadarChart = ({ criteriaScores = [] }) => {
  const radarData = criteriaScores
    .filter((cs) => cs.criteriaName)
    .map((cs) => ({
      criteriaName:
        cs.criteriaName.length > 20 ? cs.criteriaName.substring(0, 18) + "..." : cs.criteriaName,
      fullName: cs.criteriaName,
      score: typeof cs.aiScore === "number" ? cs.aiScore : 0,
    }));

  if (radarData.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-neutral-200 bg-white p-5 shadow-md">
        <p className="text-sm text-neutral-400">No criteria scores available</p>
      </div>
    );
  }

  // Fallback for < 3 criteria: simple list
  if (radarData.length < 3) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-md">
        <h3 className="mb-4 text-sm font-bold text-neutral-800">Criteria Scores</h3>
        <div className="space-y-3">
          {radarData.map((d) => (
            <div key={d.fullName} className="flex items-center justify-between">
              <span className="text-sm text-neutral-700">{d.fullName}</span>
              <span className="text-sm font-bold text-primary">{d.score}/100</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center rounded-xl border border-neutral-200 bg-white p-5 shadow-md">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis dataKey="criteriaName" tick={{ fontSize: 11, fill: "#6B7280" }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            tickCount={5}
          />
          <Radar
            dataKey="score"
            stroke="#F97316"
            fill="#F97316"
            fillOpacity={0.25}
            strokeWidth={2}
            dot={{ r: 3, fill: "#F97316" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverviewRadarChart;
