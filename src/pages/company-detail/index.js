
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetCompanyByIdQuery } from '@/apis/companyApi';
import { useGetJobsQuery } from '@/apis/jobApi';
import Loading from '@/components/Loading';
import CompanyHeader from './company-header';
import CompanySidebar from './company-sidebar';
import { AboutSection, LifeAtSection, LocationsSection } from './content-sections';
import CompanyJobs from './company-jobs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faBuilding, faNewspaper } from '../../utils/icons';

const CompanyDetail = () => {
    const { id } = useParams();
    const { data: companyData, isLoading: isCompanyLoading, isError: isCompanyError } = useGetCompanyByIdQuery(id);
    const { data: jobsResponse } = useGetJobsQuery({ companyId: id, page: 0, size: 1 });
    
    const company = companyData?.data || companyData;
    const publishedJobsCount = jobsResponse?.data?.totalElements || jobsResponse?.totalElements || 0;
    const isLoading = isCompanyLoading;
    const isError = isCompanyError;
    const [activeTab, setActiveTab] = useState('overview');

    if (isLoading) {
        return (
            <Loading
                fullScreen
                className="bg-slate-50 dark:bg-[#1a100c]"
            />
        );
    }

    if (isError || !company) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#1a100c] flex flex-col items-center justify-center text-center p-4">
                <FontAwesomeIcon icon={faBuilding} className="text-6xl text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Company Not Found</h2>
                <p className="text-slate-500 mb-6">The company you are looking for does not exist or has been removed.</p>
                <Link to="/companies" className="text-primary hover:underline font-bold">
                    Back to Companies
                </Link>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: faNewspaper },
        { id: 'jobs', label: 'Jobs', icon: faBriefcase, count: publishedJobsCount || 0 },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#1a100c] pb-20">
            {/* Top Banner Background */}
            <div className="h-48 md:h-64 bg-slate-200 dark:bg-[#3d241b] relative">
                <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                    alt="Cover"
                    className="w-full h-full object-cover opacity-30"
                />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative -mt-20 z-10">
                <CompanyHeader company={company} />

                {/* Navigation Tabs */}
                <div className="bg-white dark:bg-[#2c1a14] rounded-2xl shadow-sm border border-slate-100 dark:border-[#3d241b] px-2 md:px-6 mb-8">
                    <div className="flex items-center gap-1 md:gap-8 overflow-x-auto no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-4 px-3 md:px-4 border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-primary text-primary font-bold'
                                    : 'border-transparent text-slate-500 dark:text-[#8c6b5d] hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#3d241b]'
                                    }`}
                            >
                                <FontAwesomeIcon icon={tab.icon} className={`text-[20px] ${activeTab === tab.id ? 'text-primary' : 'text-slate-400'}`} />
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className={`text-xs ml-1 px-2 py-0.5 rounded-full ${activeTab === tab.id
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-slate-100 dark:bg-[#3d241b] text-slate-500'
                                        }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Content */}
                    <div className="flex-1 min-w-0">
                        {activeTab === 'overview' && (
                            <div className="space-y-6"> {/* animate-fade-in */}
                                <AboutSection company={company} />
                                <LocationsSection company={company} />
                                <LifeAtSection company={company} />
                            </div>
                        )}
                        {activeTab === 'jobs' && (
                            <div className="animate-fade-in">
                                <CompanyJobs companyId={company.id} />
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <aside className="lg:w-[320px] shrink-0">
                        <div>
                            <CompanySidebar company={company} />
                        </div>
                    </aside>
                </div>

            </div>
        </div>
    );
};

export default CompanyDetail;
