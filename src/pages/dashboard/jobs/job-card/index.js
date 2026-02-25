import React from "react";
import { useNavigate } from "react-router-dom";
import { message, Button as AntButton } from "antd";
import { useToggleMarkJobMutation } from "@/apis/jobApi";
import Button from "@/components/Button";
import StatusTimeline from "../status-timeline";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
};

const DashboardJobCard = ({ job, activeTab }) => {
  const navigate = useNavigate();
  const [toggleMark, { isLoading: isBookmarkLoading }] = useToggleMarkJobMutation();
  const isAppliedTab = activeTab === "applied";
  const isSavedTab = activeTab === "saved";
  const isPrimaryCta = activeTab !== "viewed" && !(isAppliedTab && job.expired);

  const handleNavigate = (e) => {
    // Prevent navigation if clicking on potential future action buttons 
    // but for now, we want the whole card to be the link
    navigate(`/jobs/${job.id}`);
  };

  const handleCtaClick = (event) => {
    event.stopPropagation();
    if (isAppliedTab && job.resumeUrl) {
      window.open(job.resumeUrl, "_blank", "noopener,noreferrer");
      return;
    }
    handleNavigate();
  };

  const handleToggleMark = async (e) => {
    e.stopPropagation();
    try {
      await toggleMark(job.id).unwrap();
      
      const isRemoving = isSavedTab;
      const msg = isRemoving ? "Job removed from saved." : "Job saved successfully.";
      
      message.success({
        content: (
          <div className="flex items-center gap-4">
            <span>{msg}</span>
            <AntButton 
              type="link" 
              size="small" 
              className="!p-0 !h-auto font-bold text-primary hover:text-primary/80"
              onClick={() => toggleMark(job.id)}
            >
              UNDO
            </AntButton>
          </div>
        ),
        duration: 4,
      });
    } catch (err) {
      message.error("Failed to update bookmark.");
    }
  };

  return (
    <article 
      className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 md:p-8 transition-all hover:border-primary/30 cursor-pointer group"
      onClick={handleNavigate}
    >
      <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
        <div className="flex-1 flex gap-4 md:gap-6 min-w-0">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-gray-100 bg-white shadow-sm p-2 shrink-0 overflow-hidden">
            <img alt={`${job.company} logo`} className="w-full h-full object-cover rounded-full" src={job.companyLogo} />
          </div>

          <div className="space-y-3 min-w-0">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                {isSavedTab && (
                  <Button
                    btnIcon
                    mode="ghost"
                    shape="pill"
                    disabled={isBookmarkLoading}
                    onClick={handleToggleMark}
                    className="shrink-0 !p-2 hover:!bg-slate-100 dark:hover:!bg-[#4b2c20] !text-primary"
                    aria-label="Remove from saved"
                  >
                    <span className="material-icons-round text-[24px]">bookmark</span>
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">{job.company}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span>{job.location}</span>
                {job.match ? (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-green-50 text-green-700">
                      <span className="material-icons-round text-[14px]">thumb_up</span>
                      Match
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {job.salary ? (
                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">{job.salary}</span>
              ) : null}
              {job.tags?.map((tag) => (
                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="w-full xl:w-72 shrink-0 border-t xl:border-t-0 xl:border-l border-gray-100 dark:border-gray-800 pt-5 xl:pt-0 xl:pl-7">
          {isAppliedTab ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-gray-500 font-medium">Applied on {formatDate(job.appliedAt)}</p>
                {job.expired ? (
                  <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                    Expired
                  </span>
                ) : null}
              </div>
              <StatusTimeline status={job.status} />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700 p-4">
                <p className="text-xs text-gray-500 mb-1">Posted date</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(job.postedAt)}</p>
              </div>
            </div>
          )}
        </aside>
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 flex justify-end">
        <button
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
            isPrimaryCta
              ? "bg-primary hover:bg-primary-dark text-white shadow-sm"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate();
          }}
        >
          {job.ctaLabel}
          <span className="material-icons-round text-[18px]">
            {isPrimaryCta ? "arrow_outward" : "arrow_forward"}
          </span>
        </button>
      </div>
    </article>
  );
};

export default DashboardJobCard;
