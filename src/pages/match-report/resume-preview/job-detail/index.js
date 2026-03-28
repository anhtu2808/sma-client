import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLazyGetJobByIdQuery } from "@/apis/jobApi";
import Loading from "@/components/Loading";
import { formatSalary } from "@/utils/salaryUtils";

const JobDetail = () => {
  const jobId = useSelector((state) => state.matchingReport.data?.jobId);
  const [triggerGetJob, { data: response, isLoading, isError }] = useLazyGetJobByIdQuery();

  useEffect(() => {
    if (jobId) {
      triggerGetJob(jobId);
    }
  }, [jobId, triggerGetJob]);

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[680px] items-center justify-center">
        <Loading size={96} className="py-0" />
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className="mx-auto max-w-[820px] rounded-xl border border-neutral-200 bg-white p-8 shadow-soft lg:p-10">
        <h2 className="font-heading text-2xl font-bold text-neutral-900">Job Description</h2>
        <p className="mt-3 text-base leading-relaxed text-neutral-700">
          Unable to load job details. Please try again later.
        </p>
      </div>
    );
  }

  const job = response.data;
  const location = job.locations?.[0];
  const salary = formatSalary(job.salaryStart, job.salaryEnd);

  return (
    <div className="mx-auto max-w-[820px] rounded-xl border border-neutral-200 bg-white p-8 shadow-soft lg:p-10">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">
          {job.name}
        </h1>
        
        {/* Company & Location */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-base text-neutral-700">
          {job.company?.name && (
            <div className="flex items-center gap-1.5">
              <span className="material-icons-round text-[16px] text-neutral-400">business</span>
              <span>{job.company.name}</span>
            </div>
          )}
          {location?.city && (
            <div className="flex items-center gap-1.5">
              <span className="material-icons-round text-[16px] text-neutral-400">location_on</span>
              <span>{location.city}</span>
            </div>
          )}
          {job.workingModel && (
            <div className="flex items-center gap-1.5">
              <span className="material-icons-round text-[16px] text-neutral-400">schedule</span>
              <span>{job.workingModel}</span>
            </div>
          )}
          {job.jobLevel && (
            <div className="flex items-center gap-1.5">
              <span className="material-icons-round text-[16px] text-neutral-400">trending_up</span>
              <span>{job.jobLevel}</span>
            </div>
          )}
        </div>

        {/* Salary */}
        {salary && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            <span className="material-icons-round text-[16px]">payments</span>
            <span>{salary}</span>
          </div>
        )}
      </div>

      {/* About / Description */}
      {job.about && (
        <div className="mt-6">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-neutral-900">
            <span className="material-icons-round text-primary">description</span>
            About
          </h2>
          <div 
            className="mt-3 text-base leading-relaxed text-neutral-700"
            dangerouslySetInnerHTML={{ __html: job.about }}
          />
        </div>
      )}

      {/* Responsibilities */}
      {job.responsibilities && (
        <div className="mt-6">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-neutral-900">
            <span className="material-icons-round text-primary">assignment</span>
            Responsibilities
          </h2>
          <div 
            className="mt-3 text-base leading-relaxed text-neutral-700"
            dangerouslySetInnerHTML={{ __html: job.responsibilities }}
          />
        </div>
      )}

      {/* Requirements */}
      {job.requirement && (
        <div className="mt-6">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-neutral-900">
            <span className="material-icons-round text-primary">check_circle</span>
            Requirements
          </h2>
          <div 
            className="mt-3 text-base leading-relaxed text-neutral-700"
            dangerouslySetInnerHTML={{ __html: job.requirement }}
          />
        </div>
      )}

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div className="mt-6">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-neutral-900">
            <span className="material-icons-round text-primary">psychology</span>
            Skills
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span 
                key={skill.id} 
                className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      {job.benefits?.length > 0 && (
        <div className="mt-6">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-neutral-900">
            <span className="material-icons-round text-primary">redeem</span>
            Benefits
          </h2>
          <ul className="mt-3 space-y-2">
            {job.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2 text-base text-neutral-700">
                <span className="material-icons-round text-[16px] text-emerald-500">check</span>
                <span>{benefit.name || benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
