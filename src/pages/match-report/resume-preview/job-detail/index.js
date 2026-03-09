const JobDetail = () => {
  return (
    <div className="mx-auto max-w-[820px] rounded-xl border border-neutral-200 bg-white p-8 shadow-soft lg:p-10">
      <h2 className="font-heading text-2xl font-bold text-neutral-900">Job Description</h2>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">
        Use this mode to inspect job requirements side by side with the optimized resume content.
      </p>
      <div className="mt-8 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 text-sm text-neutral-600">
        Job Description view is currently static and prepared for API integration in a later phase.
      </div>
    </div>
  );
};

export default JobDetail;
