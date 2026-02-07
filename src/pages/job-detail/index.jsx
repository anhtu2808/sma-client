import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJobByIdQuery } from '@/apis/jobApi';
import Button from '@/components/Button';
import JobCard from '@/components/JobCard';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: jobData, isLoading, isError } = useGetJobByIdQuery(id);

    const job = useMemo(() => {
        if (!jobData?.data) return null;
        const apiJob = jobData.data;

        // Helper to parse list items (bullet points) from string or return array
        const parseList = (content) => {
            if (Array.isArray(content)) return content;
            if (typeof content === 'string') {
                // Split by newline or just return as single item array if no newlines
                return content.split('\n').filter(item => item.trim().length > 0);
            }
            return [];
        };

        return {
            id: apiJob.id,
            name: apiJob.name,
            companyName: apiJob.company?.name || "Unknown Company",
            companyLogo: apiJob.company?.logo,
            location: apiJob.location || apiJob.workingModel || apiJob.company?.country || "Remote",
            salaryMin: apiJob.salaryStart,
            salaryMax: apiJob.salaryEnd,
            salaryFormatted: apiJob.salaryStart && apiJob.salaryEnd
                ? `${new Intl.NumberFormat('vi-VN').format(apiJob.salaryStart)} - ${new Intl.NumberFormat('vi-VN').format(apiJob.salaryEnd)} ${apiJob.currency || 'VND'}`
                : "Negotiable",
            overview: {
                experience: apiJob.experienceTime ? `${apiJob.experienceTime} years` : "Not specified",
                level: apiJob.jobLevel,
                salary: apiJob.salaryStart && apiJob.salaryEnd
                    ? `${new Intl.NumberFormat('vi-VN').format(apiJob.salaryStart)} - ${new Intl.NumberFormat('vi-VN').format(apiJob.salaryEnd)} ${apiJob.currency || 'VND'}`
                    : "Negotiable",
                posted: apiJob.uploadTime ? new Date(apiJob.uploadTime).toLocaleDateString() : "Recently",
                type: apiJob.workingModel,
                deadline: apiJob.expDate ? `Closes on ${new Date(apiJob.expDate).toLocaleDateString()}` : null
            },
            skills: apiJob.skills || [],
            description: apiJob.about || "No description available.",
            responsibilities: parseList(apiJob.responsibilities),
            requirements: parseList(apiJob.requirement), // Note: API property seems to be 'requirement' (singular based on user prompt)
            benefits: apiJob.benefits?.map(b => ({
                text: b.name,
                icon: 'check_circle' // Default icon
            })) || [],
            companyInfo: {
                description: apiJob.company?.description // Assuming company might have description later
            }
        };
    }, [jobData]);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (isError || !job) {
        return (
            <div className="min-h-screen pt-24 text-center">
                <h2 className="text-xl font-bold text-red-500">Job not found or failed to load.</h2>
                <Button mode="secondary" onClick={() => navigate('/jobs')} className="mt-4">Back to Jobs</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#1a100c] pt-24 pb-20">
            <div className="container mx-auto px-4 md:px-6">

                {/* 1. Top Header Card */}
                <header className="bg-white dark:bg-[#2c1a14] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-[#3d241b] mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex gap-6 items-start">
                        <div className="size-20 md:size-24 rounded-2xl bg-white p-2 shadow-sm shrink-0 border border-slate-100 dark:border-[#3d241b]">
                            {job.companyLogo ? (
                                <img
                                    src={job.companyLogo}
                                    alt={job.companyName}
                                    className="w-full h-full object-contain rounded-xl"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-xl text-slate-400 font-bold text-3xl">
                                    {job.companyName.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                {job.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-[#ce9e8d] font-medium mb-4">
                                <span className="text-slate-900 dark:text-white">{job.companyName}</span>
                                <span className="size-1 rounded-full bg-slate-400"></span>
                                <span>{job.location}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                                    {job.overview?.type || 'Full-time'}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                                    {job.salaryFormatted}
                                </span>
                                {job.skills.map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#3d241b] text-slate-600 dark:text-[#e0c4b7] text-sm font-medium">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <Button
                            mode="primary"
                            className="!w-full md:!w-40 !h-12 !font-bold !text-base shadow-lg hover:!shadow-orange-500/20"
                            shape="pill"
                        >
                            Apply Now
                        </Button>
                        <Button
                            mode="secondary"
                            className="!w-full md:!w-40 !h-12 !font-bold !text-base border border-slate-200 dark:border-[#4b2c20]"
                            shape="pill"
                        >
                            Save Job
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* LEFT COLUMN - Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Job Overview Grid */}
                        <section className="bg-white dark:bg-[#2c1a14] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-[#3d241b]">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Job Overview</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <OverviewItem icon="work_outline" label="EXPERIENCE" value={job.overview?.experience || "Not specified"} />
                                <OverviewItem icon="verified_user" label="LEVEL" value={job.overview?.level || "Mid-Senior"} />
                                <OverviewItem icon="attach_money" label="SALARY" value={job.overview?.salary || "Competitive"} />
                                <OverviewItem icon="schedule" label="POSTED" value={job.overview?.posted || "Recently"} />
                            </div>
                        </section>

                        {/* Job Description */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Job Description</h2>
                            <p className="text-slate-600 dark:text-[#e0c4b7] leading-relaxed mb-6 whitespace-pre-line">
                                {job.description}
                            </p>
                        </section>

                        {/* Responsibilities */}
                        {job.responsibilities && job.responsibilities.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Responsibilities</h2>
                                <ul className="space-y-3">
                                    {job.responsibilities.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-[#e0c4b7]">
                                            <span className="mt-1.5 size-1.5 rounded-full bg-orange-500 shrink-0"></span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Requirements */}
                        {job.requirements && job.requirements.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Requirements</h2>
                                <ul className="space-y-3">
                                    {job.requirements.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-[#e0c4b7]">
                                            <span className="mt-1.5 size-1.5 rounded-full bg-orange-500 shrink-0"></span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Perks & Benefits */}
                        {job.benefits && job.benefits.length > 0 && (
                            <section className="bg-white dark:bg-[#2c1a14] rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-[#3d241b]">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Perks & Benefits</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {job.benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="size-12 rounded-xl bg-orange-50 dark:bg-[#3d241b] flex items-center justify-center text-orange-500">
                                                <span className="material-icons-round">{benefit.icon}</span>
                                            </div>
                                            <span className="font-semibold text-slate-700 dark:text-[#e0c4b7]">{benefit.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT COLUMN - Sidebar */}
                    <div className="lg:col-span-1 space-y-6 sticky top-28">

                        {/* 1. Action Card (Sticky) */}
                        <div className="bg-white dark:bg-[#2c1a14] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-[#3d241b]">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{job.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-[#ce9e8d] mb-6">{job.companyName}</p>

                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SALARY</span>
                                    <div className="text-xl font-bold text-slate-900 dark:text-white">
                                        {job.salaryFormatted}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">TYPE</span>
                                    <div className="text-base font-bold text-slate-900 dark:text-white">
                                        {job.overview?.type || "Full-time"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 mb-6">
                                <Button mode="primary" shape="pill" className="!w-full !h-12 !font-bold !text-base">Apply Now</Button>
                                <Button
                                    mode="secondary"
                                    shape="pill"
                                    className="!w-full !h-12 !font-bold !text-base border border-orange-200 text-orange-600 hover:bg-orange-50"
                                    iconLeft={<span className="material-icons-round">auto_awesome</span>}
                                >
                                    Check Match
                                </Button>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
                                <span className="material-icons-round text-sm">schedule</span>
                                {job.overview?.deadline || "Application closes soon"}
                            </div>
                        </div>

                        {/* 2. Company Info Card */}
                        <div className="bg-white dark:bg-[#2c1a14] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-[#3d241b]">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-12 rounded-xl bg-slate-100 dark:bg-[#3d241b] p-1">
                                    {job.companyLogo ? (
                                        <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-contain rounded-lg" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                                            {job.companyName.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">{job.companyName}</h4>
                                    <a href="#" className="text-xs font-bold text-orange-500 hover:underline">Visit Website</a>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-[#e0c4b7] leading-relaxed mb-6">
                                {job.companyInfo?.description || `${job.companyName} is a great place to work. Check out their profile for more information.`}
                            </p>
                            <Button mode="secondary" shape="pill" className="!w-full !bg-slate-100 dark:!bg-[#3d241b] !border-none">
                                View Company Profile
                            </Button>
                        </div>

                        {/* 3. Similar Jobs - REMOVED/HIDDEN AS PER CORTEX PLAN */}
                        {/* <div className="bg-white dark:bg-[#2c1a14] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-[#3d241b]">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Similar Jobs</h3>
                             ...
                        </div> */}

                    </div>
                </div>
            </div>
        </div>
    );
};

const OverviewItem = ({ icon, label, value }) => (
    <div className="flex flex-col p-4 rounded-2xl bg-slate-50 dark:bg-[#3d241b]/50">
        <div className="mb-2 text-orange-500">
            <span className="material-icons-round">{icon}</span>
        </div>
        <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
        <span className="text-sm md:text-base font-bold text-slate-900 dark:text-white">{value}</span>
    </div>
);

export default JobDetail;
