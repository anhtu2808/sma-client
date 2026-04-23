
import React from 'react';
import { Building2 } from 'lucide-react';
import Button from '@/components/Button';
import PropTypes from 'prop-types';
import { getIndustryLabel } from '@/constant/job';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faGlobe, faPlus, faUsers } from '../../../utils/icons';

const CompanyHeader = ({ company }) => {
    if (!company) return null;

    return (
        <div className="bg-white dark:bg-[#2c1a14] rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-[#3d241b] mb-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Logo */}
                <div className="size-24 md:size-32 rounded-none bg-white p-2 shadow-sm border border-slate-100 dark:border-white/10 shrink-0">
                    {company.logo ? (
                        <img
                            src={company.logo}
                            alt={`${company.name} logo`}
                            className="w-full h-full object-contain rounded-none"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-white/5">
                            <Building2 className="text-slate-400" size={40} />
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
                            </div>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 dark:text-[#ce9e8d] text-sm md:text-base">
                                {company.companyIndustry && (
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faBuilding} className="text-[20px]" />
                                        <span>{getIndustryLabel(company.companyIndustry)}</span>
                                    </div>
                                )}
                                {company.country && (
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faGlobe} className="text-[20px]" />
                                        <span>{company.country}</span>
                                    </div>
                                )}
                                {(company.minSize || company.maxSize) && (
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faUsers} className="text-[20px]" />
                                        <span>{company.minSize && company.maxSize ? `${company.minSize} - ${company.maxSize}` : (company.minSize || company.maxSize)} Employees</span>
                                    </div>
                                )}
                            </div>
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
