import React, { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGetJobByIdQuery } from "@/apis/jobApi";
import { useGetCandidateResumesQuery } from "@/apis/resumeApi";
import Loading from "@/components/Loading";
import useRequireLoginRedirect from "@/hooks/useRequireLoginRedirect";
import { RESUME_TYPES } from "@/constant";
import { normalizeParseStatus } from "@/constant/attachment";
import { buildMockMatchingScore } from "./mock-data";

const mergeResumes = (profileResumes = [], originalResumes = []) => {
  const byId = new Map();
  [...profileResumes, ...originalResumes].forEach((resume) => {
    if (!resume?.id) return;
    const existing = byId.get(resume.id);
    if (!existing || resume.type === "PROFILE") {
      byId.set(resume.id, resume);
    }
  });

  return [...byId.values()].sort((left, right) => {
    if (left.type === "PROFILE" && right.type !== "PROFILE") return -1;
    if (left.type !== "PROFILE" && right.type === "PROFILE") return 1;
    return Number(right.id || 0) - Number(left.id || 0);
  });
};

const MatchingScore = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const requireLogin = useRequireLoginRedirect();
  const hasAccessToken = Boolean(localStorage.getItem("accessToken"));
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (hasAccessToken || hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;
    requireLogin({ warningMessage: "Please log in to check AI matching score." });
  }, [hasAccessToken, requireLogin]);

  const { data: jobData, isLoading: isJobLoading, isError: isJobError } = useGetJobByIdQuery(id, {
    skip: !hasAccessToken || !id,
  });

  const {
    data: profileResumes = [],
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
  } = useGetCandidateResumesQuery(
    { type: RESUME_TYPES.PROFILE },
    { skip: !hasAccessToken }
  );

  const {
    data: originalResumes = [],
    isLoading: isOriginalLoading,
    isFetching: isOriginalFetching,
  } = useGetCandidateResumesQuery(
    { type: RESUME_TYPES.ORIGINAL },
    { skip: !hasAccessToken }
  );

  const job = jobData?.data;
  const resumes = useMemo(() => mergeResumes(profileResumes, originalResumes), [profileResumes, originalResumes]);

  const resumeId = Number.parseInt(searchParams.get("resumeId") || "", 10);
  const hasValidResumeId = Number.isFinite(resumeId);
  const selectedResume = hasValidResumeId ? resumes.find((resume) => resume.id === resumeId) : null;
  const selectedResumeStatus = normalizeParseStatus(selectedResume?.parseStatus || "WAITING");

  const scoreData = useMemo(() => {
    if (!job || !selectedResume || selectedResumeStatus !== "FINISH") {
      return null;
    }

    return buildMockMatchingScore({ job, resume: selectedResume });
  }, [job, selectedResume, selectedResumeStatus]);

  if (!hasAccessToken) {
    return null;
  }

  if (isJobLoading || isProfileLoading || isOriginalLoading || isProfileFetching || isOriginalFetching) {
    return <Loading fullScreen className="bg-[#F3F4F6]" />;
  }

  if (isJobError || !job) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-bold text-red-500">Unable to load job information.</p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white"
            onClick={() => navigate(`/jobs/${id}`)}
          >
            Back to Job Detail
          </button>
        </div>
      </div>
    );
  }

  if (!hasValidResumeId || !selectedResume) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Resume not selected</h1>
          <p className="mt-2 text-sm text-gray-600">Please choose a resume from the Check Match modal before viewing AI score.</p>
          <button
            type="button"
            className="mt-5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white"
            onClick={() => navigate(`/jobs/${id}`)}
          >
            Back to Job Detail
          </button>
        </div>
      </div>
    );
  }

  if (selectedResumeStatus !== "FINISH") {
    return (
      <div className="min-h-screen bg-[#F3F4F6] px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Resume is not parsed yet</h1>
          <p className="mt-2 text-sm text-gray-600">
            Parse status is <span className="font-semibold">{selectedResumeStatus}</span>. Please parse this resume first.
          </p>
          <button
            type="button"
            className="mt-5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white"
            onClick={() => navigate(`/jobs/${id}`)}
          >
            Back to Job Detail
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">AI Resume Match</p>
              <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">{job?.name}</h1>
              <p className="mt-2 text-sm text-gray-600">
                Resume: <span className="font-semibold text-gray-900">{selectedResume.resumeName || selectedResume.fileName}</span>
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 px-6 py-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Overall Score</p>
              <p className={`mt-1 text-4xl font-extrabold ${scoreData.matchLevel.colorClass}`}>{scoreData.overallScore}%</p>
              <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${scoreData.matchLevel.bgClass}`}>
                {scoreData.matchLevel.label}
              </span>
            </div>
          </div>

          <p className="mt-5 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700">{scoreData.summary}</p>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {scoreData.criteriaScores.map((criterion) => (
            <article key={criterion.key} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="material-icons-round text-gray-400">{criterion.icon}</span>
                <span className="text-lg font-bold text-gray-900">{criterion.score}%</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-800">{criterion.label}</h3>
              <p className="mt-1 text-xs text-gray-500">{criterion.insight}</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Matched Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {scoreData.matchedSkills.length > 0 ? (
                scoreData.matchedSkills.map((skill) => (
                  <span key={skill} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">No strong matched skill detected from this mock evaluation.</p>
              )}
            </div>
          </article>

          <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Missing / Weak Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {scoreData.missingSkills.length > 0 ? (
                scoreData.missingSkills.map((skill) => (
                  <span key={skill} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">No critical skill gap found in this mock data.</p>
              )}
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Strengths</h2>
            <ul className="mt-4 space-y-3">
              {scoreData.strengths.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="material-icons-round mt-0.5 text-[16px] text-emerald-500">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Recommendations</h2>
            <ul className="mt-4 space-y-3">
              {scoreData.recommendations.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="material-icons-round mt-0.5 text-[16px] text-primary">auto_awesome</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="flex flex-col justify-end gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(`/jobs/${id}`)}
            className="h-11 rounded-lg border border-gray-200 px-6 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Job Detail
          </button>
          <button
            type="button"
            onClick={() => navigate(`/jobs/${id}/application`)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-white hover:opacity-90"
          >
            <span className="material-icons-round text-[18px]">arrow_outward</span>
            Apply Now
          </button>
        </section>
      </div>
    </div>
  );
};

export default MatchingScore;
