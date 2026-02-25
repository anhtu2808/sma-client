import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "antd";
import { useSearchParams } from "react-router-dom";
import { useGetAppliedJobsQuery, useGetMarkedJobsQuery } from "@/apis/jobApi";
import AppliedJobs from "./applied";
import SavedJobs from "./saved";

const JOB_TABS = [
  { key: "applied", label: "Applied Jobs" },
  { key: "saved", label: "Saved Jobs" },
];

const getCompareDate = (job, tabKey) => {
  if (tabKey === "applied") return new Date(job.appliedAt || 0).getTime();
  if (tabKey === "saved") return new Date(job.savedAt || job.postedAt || 0).getTime();
  return 0;
};

const formatSalary = (salaryStart, salaryEnd, currency = "VND") => {
  if (!salaryStart && !salaryEnd) return "Negotiable";
  const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(value);
  if (salaryStart && salaryEnd) {
    return `${formatNumber(salaryStart)} - ${formatNumber(salaryEnd)} ${currency}`;
  }
  if (salaryStart) return `From ${formatNumber(salaryStart)} ${currency}`;
  return `Up to ${formatNumber(salaryEnd)} ${currency}`;
};

const mapSavedJobFromApi = (job) => {
  const company = job?.company || {};
  const companyName = company?.name || "Company";
  return {
    id: Number(job?.id),
    title: job?.name || "Job Title",
    company: companyName,
    location: company?.address || job?.workingModel || "Location",
    salary: formatSalary(job?.salaryStart, job?.salaryEnd, job?.currency),
    tags: job?.skills?.map((skill) => skill.name) || [],
    companyLogo:
      company?.logo ||
      company?.logoUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=EEF2FF&color=1D4ED8`,
    postedAt: job?.uploadTime,
    savedAt: job?.uploadTime,
    ctaLabel: "Apply Now",
  };
};

const mapAppliedJobFromApi = (job) => {
  const company = job?.company || {};
  const companyName = company?.name || "Company";
  return {
    id: Number(job?.id),
    title: job?.name || "Job Title",
    company: companyName,
    location: company?.address || job?.workingModel || "Location",
    salary: formatSalary(job?.salaryStart, job?.salaryEnd, job?.currency),
    tags: job?.skills?.map((skill) => skill.name) || [],
    companyLogo:
      company?.logo ||
      company?.logoUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=EEF2FF&color=1D4ED8`,
    postedAt: job?.uploadTime,
    appliedAt: job?.lastApplyAt || job?.uploadTime,
    status: job?.applicationStatus,
    resumeUrl: job?.appliedResumeUrl,
    expired: ["CLOSED", "EXPIRED"].includes(job?.status),
    ctaLabel: "View Application",
  };
};

const DashboardJobs = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('applied');
  const hasAccessToken = Boolean(localStorage.getItem("accessToken"));

  // Sync tab with URL params
  useEffect(() => {
    if (searchParams.get('saved')) {
      setActiveTab('saved');
    }
  }, [searchParams]);

  const {
    data: appliedJobData,
    isLoading: isAppliedJobsLoading,
    isError: isAppliedJobsError,
  } = useGetAppliedJobsQuery(
    { page: 0, size: 50 },
    { skip: !hasAccessToken }
  );

  const {
    data: savedJobData,
    isLoading: isSavedJobsLoading,
    isError: isSavedJobsError,
  } = useGetMarkedJobsQuery(
    { page: 0, size: 50 },
    { skip: !hasAccessToken }
  );

  const appliedJobs = useMemo(() => {
    const content = appliedJobData?.content || [];
    return content.map(mapAppliedJobFromApi);
  }, [appliedJobData]);

  const savedJobs = useMemo(() => {
    const content = savedJobData?.content || [];
    return content.map(mapSavedJobFromApi);
  }, [savedJobData]);

  const currentJobsByTab = useMemo(
    () => ({
      applied: appliedJobs,
      saved: savedJobs,
    }),
    [appliedJobs, savedJobs]
  );

  const tabCounts = useMemo(
    () => ({
      applied: appliedJobData?.totalElements ?? appliedJobs.length,
      saved: savedJobData?.totalElements ?? savedJobs.length,
    }),
    [appliedJobData, appliedJobs.length, savedJobData, savedJobs.length]
  );

  const sortedJobs = useMemo(() => {
    const copiedJobs = [...(currentJobsByTab[activeTab] ?? [])];
    return copiedJobs.sort((a, b) => getCompareDate(b, activeTab) - getCompareDate(a, activeTab));
  }, [activeTab, currentJobsByTab]);

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Jobs</h1>

          <div className="flex flex-wrap items-center gap-8 border-b border-gray-100 dark:border-gray-800">
            {JOB_TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  className={`pb-4 text-sm inline-flex items-center gap-2 border-b-2 transition-colors ${
                    isActive
                      ? "font-bold text-primary border-primary"
                      : "font-medium text-gray-500 border-transparent hover:text-gray-700"
                  }`}
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                  }}
                  type="button"
                >
                  {tab.label}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tabCounts[tab.key] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </Col>

      <Col span={24}>
        {activeTab === "applied" && (
          <AppliedJobs jobs={sortedJobs} isLoading={isAppliedJobsLoading} isError={isAppliedJobsError} />
        )}
        {activeTab === "saved" && (
          <SavedJobs jobs={sortedJobs} isLoading={isSavedJobsLoading} isError={isSavedJobsError} />
        )}
      </Col>
    </Row>
  );
};

export default DashboardJobs;
