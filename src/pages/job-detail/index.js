import React from 'react';
import { useParams, useNavigate, Link, Outlet } from 'react-router-dom';
import { SearchX, ArrowLeft, Briefcase } from 'lucide-react';
import { useGetJobByIdQuery } from '@/apis/jobApi';
import Button from '@/components/Button';
import Loading from '@/components/Loading';

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

    const { data, isLoading, isError } = useGetJobByIdQuery(id);
    const jobData = data?.data;

    if (isLoading) {
        return (
            <Loading fullScreen className="bg-[#F3F4F6]" />
        );
    }

    if (isError || !jobData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F3F4F6] via-white to-orange-50/40 px-6">
                <div className="w-full max-w-lg">
                    <div className="relative bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 px-8 py-12 sm:px-12 sm:py-14 text-center overflow-hidden">
                        <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-orange-100/60 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-amber-100/40 blur-3xl" />

                        <div className="relative mx-auto mb-7 w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                            <SearchX size={40} className="text-white" strokeWidth={2} />
                        </div>

                        <h2 className="relative text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                            Job not found
                        </h2>
                        <p className="relative mt-3 text-sm sm:text-base text-gray-500 leading-relaxed max-w-sm mx-auto">
                            The job you're looking for may have been removed, expired, or the link is incorrect. Try browsing other opportunities instead.
                        </p>

                        <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 transition-all"
                            >
                                <ArrowLeft size={18} />
                                Go back
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/jobs')}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 shadow-md shadow-orange-500/20 transition-all"
                            >
                                <Briefcase size={18} />
                                Browse all jobs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-[#F3F4F6] min-h-screen">
            <main className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-gray-100">
                                <Header />
                                <p className="text-gray-600 text-base mb-4">
                                    <Link to={`/companies/${jobData.company?.id}`} className="font-semibold text-gray-900 hover:text-primary">
                                        {jobData.company?.name || "Unknown Company"}
                                    </Link>
                                    {jobData.uploadTime && <span className="ml-2 text-gray-400">• Posted {new Date(jobData.uploadTime).toLocaleDateString()}</span>}
                                </p>

                                <MetaInfo />
                                <SkillsAndDomains />
                                <CTAButtons />
                            </div>

                            <About />
                            <Responsibilities />
                            <Requirements />
                            <Benefits />
                        </div>
                    </div>

                    {/* RIGHT - Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 flex flex-col gap-6">
                            <CompanyInfoCard />
                            <SimilarJobsCard />
                        </div>
                    </div>
                </div>
            </main>
            <Outlet />
        </div>
    );
};

export default JobDetail;
