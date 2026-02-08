import React from 'react';

const CompanyInfoCard = ({ company }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="size-14 rounded-xl bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center overflow-hidden">
                    {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-white font-bold text-xl">{company.name.charAt(0)}</span>
                    )}
                </div>
                <div>
                    <h3 className="text-gray-900 font-bold">{company.name}</h3>
                    {company.link && (
                        <a className="text-primary text-sm font-medium hover:underline flex items-center gap-1" href={company.link} target="_blank" rel="noreferrer">
                            Visit Website <span className="material-icons-round text-[14px]">open_in_new</span>
                        </a>
                    )}
                </div>
            </div>
            <div className="space-y-3 text-sm">
                {company.country && (
                    <div className="flex justify-between">
                        <span className="text-gray-500">Location</span>
                        <span className="text-gray-900 font-medium">{company.country}</span>
                    </div>
                )}
                {company.industry && (
                    <div className="flex justify-between">
                        <span className="text-gray-500">Industry</span>
                        <span className="text-gray-900 font-medium">{company.industry.replace(/_/g, ' ')}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyInfoCard;
