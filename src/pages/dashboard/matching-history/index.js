import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllMatchingQuery } from "@/apis/matchingApi";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { Pagination, Dropdown } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const getScoreColor = (score) => {
  if (score === null || score === undefined) return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300" };
  if (score > 70) return { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" };
  if (score >= 40) return { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" };
  return { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" };
};

const getMatchLevelLabel = (level) => {
  const levelMap = {
    EXCELLENT: "Excellent",
    GOOD: "Good",
    FAIR: "Fair",
    POOR: "Poor",
    NOT_MATCHED: "Not Matched",
  };
  return levelMap[level] || level || "Unknown";
};

const getMatchLevelColor = (level) => {
  const colorMap = {
    EXCELLENT: { bg: "bg-green-100", text: "text-green-700" },
    GOOD: { bg: "bg-blue-100", text: "text-blue-700" },
    FAIR: { bg: "bg-yellow-100", text: "text-yellow-700" },
    POOR: { bg: "bg-orange-100", text: "text-orange-700" },
    NOT_MATCHED: { bg: "bg-red-100", text: "text-red-700" },
  };
  return colorMap[level] || { bg: "bg-gray-100", text: "text-gray-600" };
};

const formatRelativeDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = dayjs(dateString);
  const now = dayjs();
  if (now.diff(date, "day") < 7) {
    return date.fromNow();
  }
  return date.format("MMM D, YYYY");
};

const getEvaluationTypeLabel = (type) => {
  if (type === "OVERVIEW") {
    return { label: "Quick Scan", icon: "bolt", bg: "bg-purple-100", text: "text-purple-700" };
  }
  if (type === "DETAIL") {
    return { label: "Detailed", icon: "analytics", bg: "bg-indigo-100", text: "text-indigo-700" };
  }
  return null;
};

const MatchingHistoryItem = ({ item, onViewReport }) => {
  const score = item.aiOverallScore;

  const scoreColors = getScoreColor(score);
  const matchLevelColors = getMatchLevelColor(item.matchLevel);
  const evalType = getEvaluationTypeLabel(item.evaluationType);

  // Use direct API fields
  const jobTitle = item.jobName || "N/A";
  const companyName = item.companyName || "N/A";
  const resumeName = item.resumeFullName || item.candidateName;
  const strengthCount = item.strengths?.split("\n").filter(Boolean).length || 0;
  const weaknessCount = item.weaknesses?.split("\n").filter(Boolean).length || 0;

  // Dropdown menu items
  const menuItems = [
    {
      key: "view",
      label: "View Report",
      icon: <i className="material-icons-round text-[16px]">description</i>,
      onClick: () => onViewReport(item.id),
    },
    {
      key: "edit",
      label: "Edit Resume",
      icon: <i className="material-icons-round text-[16px]">edit</i>,
    },
    {
      key: "pdf",
      label: "Download PDF",
      icon: <i className="material-icons-round text-[16px]">download</i>,
    },
  ];

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
      <div className="flex items-center gap-5">
        {/* Circular Score Badge */}
        <div
          className={`shrink-0 w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center ${scoreColors.bg} ${scoreColors.border}`}
        >
          <span className={`text-lg font-bold ${scoreColors.text}`}>
            {score !== null && score !== undefined ? Math.round(score) : "N/A"}
          </span>
          <span className={`text-[10px] font-medium ${scoreColors.text}/70`}>Score</span>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {jobTitle}
            </h3>
            <span
              className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${matchLevelColors.bg} ${matchLevelColors.text}`}
            >
              {getMatchLevelLabel(item.matchLevel)}
            </span>
            {evalType && (
              <span
                className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${evalType.bg} ${evalType.text}`}
              >
                <i className="material-icons-round text-[12px]">{evalType.icon}</i>
                {evalType.label}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {companyName}
          </p>
          {resumeName && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1 truncate">
              <i className="material-icons-round text-[14px]">description</i>
              Resume: {resumeName}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <i className="material-icons-round text-[14px]">schedule</i>
              {formatRelativeDate(item.scoreAt)}
            </span>
            <span className="text-gray-300 dark:text-gray-600">&middot;</span>
            <span className="flex items-center gap-1">
              <i className="material-icons-round text-[14px]">lightbulb</i>
              {strengthCount}
            </span>
            {weaknessCount > 0 && (
              <>
                <span className="text-gray-300 dark:text-gray-600">&middot;</span>
                <span className="flex items-center gap-1">
                  <i className="material-icons-round text-[14px]">warning</i>
                  {weaknessCount}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            mode="primary"
            size="sm"
            shape="rounded"
            onClick={() => onViewReport(item.id)}
          >
            View Report
          </Button>
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button mode="ghost" size="sm">
              <i className="material-icons-round text-[16px]">more_vert</i>
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

const MatchingHistory = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError } = useGetAllMatchingQuery({
    page,
    size,
  });

  const handleViewReport = (evaluationId) => {
    navigate(`/match-report/${evaluationId}`);
  };

  const matchingList = data?.content || [];
  const totalElements = data?.totalElements || 0;

  const filteredList = searchQuery
    ? matchingList.filter((item) => {
        const query = searchQuery.toLowerCase();
        const jobTitle = item.jobName || item.job?.name || "";
        const companyName = item.companyName || "";
        const resumeName = item.resumeFullName || "";
        return (
          jobTitle.toLowerCase().includes(query) ||
          companyName.toLowerCase().includes(query) ||
          resumeName.toLowerCase().includes(query)
        );
      })
    : matchingList;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="shrink-0 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Scan History
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View and manage your resume-job matching results
            </p>
          </div>

        </div>

        <div className="relative max-w-md">
          <i className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
            search
          </i>
          <input
            type="text"
            placeholder="Search by job title, company, or resume..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <div className="space-y-4 mb-4">
          {isLoading ? (
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
              <Loading className="py-0" />
            </div>
          ) : isError ? (
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
              <i className="material-icons-round text-[48px] text-red-400 mb-3">error_outline</i>
              <p className="text-gray-900 dark:text-white font-medium">Failed to load scan history</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please try again later</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
              <i className="material-icons-round text-[48px] text-gray-300 dark:text-gray-600 mb-3">fact_check</i>
              <p className="text-gray-900 dark:text-white font-medium">No scan history found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
                Start scanning your resume against jobs to see results here
              </p>
              <Button mode="primary" onClick={() => navigate("/jobs")}>
                Browse Jobs
              </Button>
            </div>
          ) : (
            filteredList.map((item) => (
              <MatchingHistoryItem
                key={item.id}
                item={item}
                onViewReport={handleViewReport}
              />
            ))
          )}
        </div>

        {!isLoading && !isError && totalElements > 0 && (
          <div className="flex justify-center pb-8 pt-2">
            <Pagination
              current={page + 1}
              pageSize={size}
              total={totalElements}
              onChange={(newPage, newSize) => {
                setPage(newPage - 1);
                setSize(newSize);
              }}
              showSizeChanger
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} results`
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingHistory;
