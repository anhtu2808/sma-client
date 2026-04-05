import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllMatchingQuery } from "@/apis/matchingApi";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { Pagination, Dropdown } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faClipboardCheck, faClock, faDownload, faEllipsisVertical, faFileLines, faMagnifyingGlass, faPenToSquare } from '../../../utils/icons';
dayjs.extend(relativeTime);

const getScoreColor = (score) => {
  if (score === null || score === undefined) return { text: "text-gray-500", accent: "bg-gray-300" };
  if (score > 70) return { text: "text-green-600", accent: "bg-green-400" };
  if (score >= 40) return { text: "text-orange-500", accent: "bg-orange-400" };
  return { text: "text-red-500", accent: "bg-red-400" };
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

const MatchingHistoryItem = ({ item, onViewReport }) => {
  const score = item.aiOverallScore;

  const scoreColors = getScoreColor(score);

  // Use direct API fields
  const jobTitle = item.jobName || "N/A";
  const companyName = item.companyName || "N/A";
  const resumeName = item.resumeFullName || item.candidateName;

  // Dropdown menu items
  const menuItems = [
    {
      key: "view",
      label: "View Report",
      icon: <FontAwesomeIcon icon={faFileLines} className="text-[16px]" />,
      onClick: () => onViewReport(item.id),
    },
    {
      key: "edit",
      label: "Edit Resume",
      icon: <FontAwesomeIcon icon={faPenToSquare} className="text-[16px]" />,
    },
    {
      key: "pdf",
      label: "Download PDF",
      icon: <FontAwesomeIcon icon={faDownload} className="text-[16px]" />,
    },
  ];

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/30">
      <div className="flex items-stretch gap-0">
        {/* Left accent bar */}
        <div className={`w-1 shrink-0 ${scoreColors.accent}`} />

        {/* Card content */}
        <div className="flex flex-1 items-center gap-4 px-5 py-4">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate mb-0.5">
              {jobTitle}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              {companyName}
              <span className="text-gray-300 dark:text-gray-600">&middot;</span>
              <FontAwesomeIcon icon={faClock} className="text-[12px]" />
              <span>{formatRelativeDate(item.scoreAt)}</span>
            </p>
            {resumeName && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1 truncate">
                <FontAwesomeIcon icon={faFileLines} className="text-[13px]" />
                {resumeName}
              </p>
            )}
          </div>

          {/* Score display */}
          <div className="flex flex-col items-center justify-center w-14 shrink-0">
            <span className={`text-2xl font-bold leading-none ${scoreColors.text}`}>
              {score !== null && score !== undefined ? Math.round(score) : "—"}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 tracking-wide uppercase">Score</span>
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
                <FontAwesomeIcon icon={faEllipsisVertical} className="text-[16px]" />
              </Button>
            </Dropdown>
          </div>
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
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]" />
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
              <FontAwesomeIcon icon={faCircleExclamation} className="text-[48px] text-red-400 mb-3" />
              <p className="text-gray-900 dark:text-white font-medium">Failed to load scan history</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please try again later</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
              <FontAwesomeIcon icon={faClipboardCheck} className="text-[48px] text-gray-300 dark:text-gray-600 mb-3" />
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
