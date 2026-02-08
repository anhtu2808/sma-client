
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetCompanyByIdQuery } from '@/apis/companyApi';
import CompanyHeader from './components/CompanyHeader';
import CompanySidebar from './components/CompanySidebar';
import { AboutSection, LifeAtSection, LocationsSection } from './components/ContentSections';

const CompanyDetail = () => {
    const { id } = useParams();
    const { data: companyData, isLoading, isError } = useGetCompanyByIdQuery(id);
    const company = companyData?.data || companyData;
    const [activeTab, setActiveTab] = useState('overview');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#1a100c]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (isError || !company) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#1a100c] flex flex-col items-center justify-center text-center p-4">
                <span className="material-icons-round text-6xl text-slate-300 mb-4">business</span>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Company Not Found</h2>
                <p className="text-slate-500 mb-6">The company you are looking for does not exist or has been removed.</p>
                <Link to="/companies" className="text-primary hover:underline font-bold">
                    Back to Companies
                </Link>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'subject' },
        { id: 'jobs', label: 'Jobs', icon: 'work', count: company.totalJobs || 0 },
        { id: 'reviews', label: 'Reviews', icon: 'star_rate' }
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
                                <span className={`material-icons-round text-[20px] ${activeTab === tab.id ? 'text-primary' : 'text-slate-400'}`}>
                                    {tab.icon}
                                </span>
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
                            <div className="bg-white dark:bg-[#2c1a14] rounded-2xl p-8 border border-slate-100 dark:border-[#3d241b] text-center py-20">
                                <span className="material-icons-round text-6xl text-slate-200 mb-4">work_outline</span>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Open Positions</h3>
                                <p className="text-slate-500">Feature coming soon...</p>
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
