import React, { useMemo, useState } from "react";
import { Col, Row, Select } from "antd";

const JOB_TABS = [
  { key: "applied", label: "Applied Jobs" },
  { key: "saved", label: "Saved Jobs" },
  { key: "viewed", label: "Recent Viewed Jobs" },
];

const SORT_OPTIONS = {
  applied: [
    { value: "latest", label: "Latest application date" },
    { value: "oldest", label: "Oldest application date" },
    { value: "company", label: "Company name (A-Z)" },
  ],
  saved: [
    { value: "latest", label: "Latest saved date" },
    { value: "oldest", label: "Oldest saved date" },
    { value: "company", label: "Company name (A-Z)" },
  ],
  viewed: [
    { value: "latest", label: "Latest viewed date" },
    { value: "oldest", label: "Oldest viewed date" },
    { value: "company", label: "Company name (A-Z)" },
  ],
};

const APPLICATION_STEPS = ["Delivered", "Employer viewed", "Interview"];

const MOCK_JOB_COLLECTION = {
  applied: [
    {
      id: "applied-1",
      title: "Fresher & Junior - Software Developer (.NET, Java, C#)",
      company: "Netcompany",
      location: "Ho Chi Minh",
      salary: "15M - 25M VND",
      tags: [".NET", "Java"],
      companyLogo: "https://ui-avatars.com/api/?name=Netcompany&background=EEF2FF&color=1D4ED8",
      match: true,
      appliedAt: "2026-01-10",
      step: 0,
      expired: false,
      ctaLabel: "View Details",
    },
    {
      id: "applied-2",
      title: "Backend Developer (Java/All levels)",
      company: "Home Credit Vietnam",
      location: "Ho Chi Minh",
      salary: "Negotiable",
      tags: ["Backend", "Java"],
      companyLogo: "https://ui-avatars.com/api/?name=Home+Credit&background=FFEDE8&color=C2410C",
      match: true,
      appliedAt: "2025-10-24",
      step: 1,
      expired: true,
      ctaLabel: "View Application",
    },
    {
      id: "applied-3",
      title: "Software Engineer (Fullstack Developer)",
      company: "ACB Bank",
      location: "Hanoi",
      salary: "20M - 40M VND",
      tags: ["Fullstack", "ReactJS"],
      companyLogo: "https://ui-avatars.com/api/?name=ACB&background=DBEAFE&color=1E3A8A",
      match: false,
      appliedAt: "2025-10-16",
      step: 0,
      expired: true,
      ctaLabel: "View Details",
    },
  ],
  saved: [
    {
      id: "saved-1",
      title: "Frontend Engineer (React)",
      company: "MoMo",
      location: "Ho Chi Minh",
      salary: "18M - 35M VND",
      tags: ["React", "TypeScript"],
      companyLogo: "https://ui-avatars.com/api/?name=MoMo&background=FCE7F3&color=9D174D",
      postedAt: "2026-02-03",
      savedAt: "2026-02-09",
      ctaLabel: "Apply Now",
    },
    {
      id: "saved-2",
      title: "Software Engineer (Backend Java)",
      company: "VNG",
      location: "Ho Chi Minh",
      salary: "Negotiable",
      tags: ["Java", "Spring Boot"],
      companyLogo: "https://ui-avatars.com/api/?name=VNG&background=FFF7ED&color=B45309",
      postedAt: "2026-01-28",
      savedAt: "2026-02-08",
      ctaLabel: "Apply Now",
    },
  ],
  viewed: [
    {
      id: "viewed-1",
      title: "Senior Java Developer",
      company: "FPT Software",
      location: "Da Nang",
      salary: "30M - 45M VND",
      tags: ["Java", "Microservices"],
      companyLogo: "https://ui-avatars.com/api/?name=FPT&background=FFEDD5&color=C2410C",
      postedAt: "2026-01-30",
      viewedAt: "2026-02-10",
      ctaLabel: "View Job",
    },
    {
      id: "viewed-2",
      title: "Fullstack Engineer (Node.js + React)",
      company: "KMS Technology",
      location: "Ho Chi Minh",
      salary: "22M - 40M VND",
      tags: ["Node.js", "React"],
      companyLogo: "https://ui-avatars.com/api/?name=KMS&background=E0F2FE&color=0369A1",
      postedAt: "2026-02-04",
      viewedAt: "2026-02-10",
      ctaLabel: "View Job",
    },
    {
      id: "viewed-3",
      title: "Backend Engineer (.NET)",
      company: "NAB Vietnam",
      location: "Ho Chi Minh",
      salary: "25M - 42M VND",
      tags: [".NET", "Azure"],
      companyLogo: "https://ui-avatars.com/api/?name=NAB&background=ECFDF5&color=065F46",
      postedAt: "2026-02-05",
      viewedAt: "2026-02-07",
      ctaLabel: "View Job",
    },
  ],
};

const getCompareDate = (job, tabKey) => {
  if (tabKey === "applied") return new Date(job.appliedAt).getTime();
  if (tabKey === "saved") return new Date(job.savedAt).getTime();
  return new Date(job.viewedAt).getTime();
};

const formatDate = (dateString) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));

const StatusTimeline = ({ currentStep }) => (
  <div className="relative pl-1 space-y-3.5">
    <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gray-200" />
    {APPLICATION_STEPS.map((step, index) => {
      const isDone = index <= currentStep;
      return (
        <div className="relative flex items-center gap-3" key={step}>
          <span
            className={`relative z-10 w-[11px] h-[11px] rounded-full border-2 ${
              isDone ? "bg-primary border-primary" : "bg-white border-gray-300"
            }`}
          />
          <span className={`text-xs ${isDone ? "font-semibold text-primary" : "font-medium text-gray-400"}`}>
            {step}
          </span>
        </div>
      );
    })}
  </div>
);

const DashboardJobCard = ({ job, activeTab }) => {
  const isAppliedTab = activeTab === "applied";
  const isPrimaryCta = activeTab !== "viewed" && !(isAppliedTab && job.expired);

  return (
    <article className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 md:p-8 transition-all hover:border-primary/30">
      <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
        <div className="flex-1 flex gap-4 md:gap-6 min-w-0">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-gray-100 bg-white shadow-sm p-2 shrink-0 overflow-hidden">
            <img alt={`${job.company} logo`} className="w-full h-full object-cover rounded-full" src={job.companyLogo} />
          </div>

          <div className="space-y-3 min-w-0">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight">{job.title}</h3>
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
              <StatusTimeline currentStep={job.step} />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700 p-4">
                <p className="text-xs text-gray-500 mb-1">{activeTab === "saved" ? "Saved on" : "Viewed on"}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {activeTab === "saved" ? formatDate(job.savedAt) : formatDate(job.viewedAt)}
                </p>
              </div>
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

const DashboardJobs = () => {
  const [activeTab, setActiveTab] = useState("applied");
  const [sortBy, setSortBy] = useState("latest");

  const tabCounts = useMemo(
    () => Object.fromEntries(JOB_TABS.map((tab) => [tab.key, MOCK_JOB_COLLECTION[tab.key]?.length ?? 0])),
    []
  );

  const sortedJobs = useMemo(() => {
    const copiedJobs = [...(MOCK_JOB_COLLECTION[activeTab] ?? [])];
    if (sortBy === "company") {
      return copiedJobs.sort((a, b) => a.company.localeCompare(b.company));
    }
    if (sortBy === "oldest") {
      return copiedJobs.sort((a, b) => getCompareDate(a, activeTab) - getCompareDate(b, activeTab));
    }
    return copiedJobs.sort((a, b) => getCompareDate(b, activeTab) - getCompareDate(a, activeTab));
  }, [activeTab, sortBy]);

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
                    setSortBy("latest");
                  }}
                  type="button"
                >
                  {tab.label}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tabCounts[tab.key]}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </Col>

      <Col span={24}>
        <div className="flex justify-start md:justify-end">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium">Sort by:</span>
            <Select
              className="min-w-[220px]"
              onChange={setSortBy}
              options={SORT_OPTIONS[activeTab]}
              value={sortBy}
            />
          </div>
        </div>
      </Col>

      <Col span={24}>
        {sortedJobs.length > 0 ? (
          <div className="space-y-5">
            {sortedJobs.map((job) => (
              <DashboardJobCard activeTab={activeTab} job={job} key={job.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl bg-white border border-gray-100">
            <span className="material-icons-round text-5xl text-gray-300">work_history</span>
            <h3 className="mt-3 text-xl font-bold text-gray-800">No jobs in this tab yet</h3>
            <p className="text-gray-500 mt-1">Try applying or saving jobs to track them from your dashboard.</p>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default DashboardJobs;
