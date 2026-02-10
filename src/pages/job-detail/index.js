import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetJobByIdQuery } from '@/apis/jobApi';
import Button from '@/components/Button';

// Import components
import Header from './header';
import MetaInfo from './meta-info';
import SkillsAndDomains from './skills-and-domains';
import CTAButtons from './cta-buttons';
import About from './about';
import Responsibilities from './responsibilities';
import Requirements from './requirements';
import Benefits from './benefits';
import CompanyInfoCard from './company-info-card';
import SimilarJobsCard from './similar-jobs-card';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: jobData, isLoading, isError } = useGetJobByIdQuery(id);

    const job = useMemo(() => {
        if (!jobData?.data) return null;
        const apiJob = jobData.data;

        const parseList = (content) => {
            if (Array.isArray(content)) return content;
            if (typeof content === 'string') {
                return content.split('\n').filter(item => item.trim().length > 0);
            }
            return [];
        };

        return {
            id: apiJob.id,
            name: apiJob.name,
            companyName: apiJob.company?.name || "Unknown Company",
            companyLogo: apiJob.company?.logo,
            companyLink: apiJob.company?.link,
            companyCountry: apiJob.company?.country,
            companyIndustry: apiJob.company?.companyIndustry,
            location: apiJob.workingModel || apiJob.company?.country || "Remote",
            salaryFormatted: apiJob.salaryStart && apiJob.salaryEnd
                ? `${new Intl.NumberFormat('vi-VN').format(apiJob.salaryStart)} - ${new Intl.NumberFormat('vi-VN').format(apiJob.salaryEnd)} ${apiJob.currency || 'VND'}`
                : "Negotiable",
            experienceTime: apiJob.experienceTime ? `${apiJob.experienceTime} years` : null,
            jobLevel: apiJob.jobLevel,
            workingModel: apiJob.workingModel,
            status: apiJob.status,
            postedDate: apiJob.uploadTime ? new Date(apiJob.uploadTime).toLocaleDateString() : "Recently",
            expDate: apiJob.expDate ? new Date(apiJob.expDate).toLocaleDateString() : null,
            skills: apiJob.skills || [],
            domains: apiJob.domains || [],
            expertise: apiJob.expertise,
            description: apiJob.about || "No description available.",
            responsibilities: parseList(apiJob.responsibilities),
            requirements: parseList(apiJob.requirement),
            benefits: apiJob.benefits || [],
            questions: apiJob.questions || [],
            appliedAttempt: apiJob.appliedAttempt,
            lastApplicationStatus: apiJob.lastApplicationStatus,
            canApply: apiJob.canApply,
        };
    }, [jobData]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#F3F4F6]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (isError || !job) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-[#F3F4F6]">
                <h2 className="text-xl font-bold text-red-500 mb-4">Job not found or failed to load.</h2>
                <Button mode="secondary" onClick={() => navigate('/jobs')}>Back to Jobs</Button>
            </div>
        );
    }

    const companyData = {
        name: job.companyName,
        logo: job.companyLogo,
        link: job.companyLink,
        country: job.companyCountry,
        industry: job.companyIndustry,
    };

    return (
        <div className="bg-[#F3F4F6] min-h-screen">
            <main className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT - Main Content Card */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Job Header */}
                            <div className="p-6 md:p-8 border-b border-gray-100">
                                <Header job={job} />
                                <p className="text-gray-600 text-base mb-4">
                                    <Link to={`/companies/${job.companyName}`} className="font-semibold text-gray-900 hover:text-primary">{job.companyName}</Link>
                                    {job.postedDate && <span className="ml-2 text-gray-400">• Posted {job.postedDate}</span>}
                                </p>

                                <MetaInfo job={job} />
                                <SkillsAndDomains
                                    skills={job.skills}
                                    expertise={job.expertise}
                                    domains={job.domains}
                                />
                                <CTAButtons job={job} />
                            </div>

                            <About description={job.description} />
                            <Responsibilities responsibilities={job.responsibilities} />
                            <Requirements requirements={job.requirements} />
                            <Benefits benefits={job.benefits} />
                        </div>
                    </div>

                    {/* RIGHT - Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 flex flex-col gap-6">
                            <CompanyInfoCard company={companyData} />
                            <SimilarJobsCard />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JobDetail;
