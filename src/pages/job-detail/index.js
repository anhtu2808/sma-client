import React from 'react';
import { useParams, useNavigate, Link, Outlet } from 'react-router-dom';
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
            <div className="min-h-screen flex flex-col justify-center items-center bg-[#F3F4F6]">
                <h2 className="text-xl font-bold text-red-500 mb-4">Job not found or failed to load.</h2>
                <Button mode="secondary" onClick={() => navigate('/jobs')}>Back to Jobs</Button>
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
                                    <Link to={`/companies/${jobData.company?.name || "Unknown Company"}`} className="font-semibold text-gray-900 hover:text-primary">
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
