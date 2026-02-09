
import React from 'react';
import Button from '@/components/Button';
import PropTypes from 'prop-types';

const CompanyHeader = ({ company }) => {
    if (!company) return null;

    return (
        <div className="bg-white dark:bg-[#2c1a14] rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-[#3d241b] mb-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Logo */}
                <div className="size-24 md:size-32 rounded-2xl bg-white p-2 shadow-sm border border-slate-100 dark:border-white/10 shrink-0">
                    {company.logo ? (
                        <img
                            src={company.logo}
                            alt={`${company.name} logo`}
                            className="w-full h-full object-contain rounded-xl"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-white/5 text-4xl font-bold text-slate-400">
                            {company.name?.charAt(0) || 'C'}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                    {company.name}
                                </h1>
                                {company.companyStatus === "APPROVED" && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-500/20">
                                        <span className="material-icons-round text-sm mr-1">verified</span>
                                        Approved
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 dark:text-[#ce9e8d] text-sm md:text-base">
                                {company.companyIndustry && (
                                    <div className="flex items-center gap-2">
                                        <span className="material-icons-round text-[20px]">business</span>
                                        <span>{company.companyIndustry}</span>
                                    </div>
                                )}
                                {company.country && (
                                    <div className="flex items-center gap-2">
                                        <span className="material-icons-round text-[20px]">public</span>
                                        <span>{company.country}</span>
                                    </div>
                                )}
                                {(company.minSize || company.maxSize) && (
                                    <div className="flex items-center gap-2">
                                        <span className="material-icons-round text-[20px]">people</span>
                                        <span>{company.minSize && company.maxSize ? `${company.minSize} - ${company.maxSize}` : (company.minSize || company.maxSize)} Employees</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="!rounded-full !px-6 border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10"
                        >
                            <span className="material-icons-round mr-2">add</span>
                            Follow
                        </Button>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-[#3d241b] my-6"></div>

                    {/* Stats */}
                    <div className="flex items-center gap-12">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-[#8c6b5d] mb-1">Open Jobs</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{company.totalJobs || 0}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-[#8c6b5d] mb-1">Followers</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {company.followerNumber ? (company.followerNumber > 1000 ? `${(company.followerNumber / 1000).toFixed(1)}k` : company.followerNumber) : 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

CompanyHeader.propTypes = {
    company: PropTypes.object
};

export default CompanyHeader;
