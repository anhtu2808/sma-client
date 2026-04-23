import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatScore } from "@/utils/formatScore";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 p-3 rounded-lg shadow-lg border border-gray-100 text-sm">
        <p className="font-bold text-gray-800">{payload[0]?.payload?.fullName}</p>
        <p className="text-gray-600">Score: <span className="font-bold">{payload[0]?.value}</span></p>
      </div>
    );
  }
  return null;
};

const CustomTick = ({ payload, x, y, cx, cy, textAnchor }) => {
  const OFFSET = 18;
  const dx = x - cx;
  const dy = y - cy;
  const length = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = dx / length;
  const ny = dy / length;
  return (
    <text
      x={x + nx * OFFSET}
      y={y + ny * OFFSET}
      textAnchor={textAnchor}
      fill="#111827"
      style={{ fontSize: 15, fontWeight: 800 }}
    >
      {payload.value}
    </text>
  );
};

const OverviewRadarChart = ({ criteriaScores = [] }) => {
  const radarData = criteriaScores
    .filter((cs) => cs.criteriaName)
    .map((cs) => ({
      criteriaName:
        cs.criteriaName.length > 20 ? cs.criteriaName.substring(0, 18) + "..." : cs.criteriaName,
      fullName: cs.criteriaName,
      score: formatScore(cs.aiScore),
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
          <PolarGrid stroke="#CEDBEA" strokeDasharray="2 2" />
          <PolarAngleAxis dataKey="criteriaName" tick={<CustomTick />} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#374151", fontSize: 12, fontWeight: 600 }}
            tickCount={6}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            dataKey="score"
            stroke="#002EB9"
            fill="#87A5FF"
            fillOpacity={0.4}
            strokeWidth={1.56}
            dot={{ r: 4, fill: "#002EB9", strokeWidth: 0 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverviewRadarChart;
