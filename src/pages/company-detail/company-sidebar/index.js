import React from 'react';
import PropTypes from 'prop-types';

const CompanySidebar = ({ company }) => {
    if (!company) return null;

    return (
        <div className="space-y-6">
            {/* Company Information */}
            <div className="bg-white dark:bg-[#2c1a14] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-[#3d241b]">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-icons-round text-orange-500">business</span>
                    Company Information
                </h3>

                <div className="space-y-6">
                    {company.link && (
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Website</p>
                            <a
                                href={company.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium break-all"
                            >
                                {company.link.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Type</p>
                            <p className="text-slate-900 dark:text-white font-medium capitalize">
                                {company.companyType ? company.companyType.toLowerCase().replace('_', ' ') : 'Product'}
                            </p>
                        </div>
                    </div>

                    {company.email && (
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                            <a href={`mailto:${company.email}`} className="text-slate-900 dark:text-white font-medium hover:text-primary transition-colors">
                                {company.email}
                            </a>
                        </div>
                    )}

                    {company.phone && (
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                            <a href={`tel:${company.phone}`} className="text-slate-900 dark:text-white font-medium hover:text-primary transition-colors">
                                {company.phone}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

CompanySidebar.propTypes = {
    company: PropTypes.object
};

export default CompanySidebar;
