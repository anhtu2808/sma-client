import { Building2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { getIndustryLabel } from '@/constant/job';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faBriefcase } from '../../utils/icons';

const CompanyCard = ({
    logo,
    coverImage,
    name,
    description,
    industry,
    location,
    publishJob,

    onViewDetails,
    className = ""
}) => {
    return (
        <article
            onClick={onViewDetails}
            className={`group flex flex-col rounded-xl bg-white border border-[#eaeaea] overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 ${className}`}
        >
            {/* Cover Image */}
            <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
                <img
                    src={coverImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"}
                    alt={`${name} cover`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Logo Overlay */}
            <div className="px-4 relative -mt-8 mb-2">
                <div className="size-16 rounded-none bg-white p-1 border border-slate-200 overflow-hidden shadow-sm flex items-center justify-center">
                    {logo ? (
                        <img
                            src={logo}
                            alt={`${name} logo`}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <Building2 className="text-slate-400" size={24} />
                    )}
                </div>
            </div>

            {/* Content Body */}
            <div className="flex flex-col flex-1 px-4 pb-4">
                <h3 className="text-[16px] font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-2 uppercase" title={name}>
                    {name}
                </h3>

                {description && (
                    <p className="text-[13px] text-slate-600 line-clamp-3 mb-4 leading-relaxed font-sans">
                        "{description}"
                    </p>
                )}

                {/* Footer Badges */}
                <div className="mt-auto flex flex-col gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                        {industry && (
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                                <FontAwesomeIcon icon={faBuilding} className="text-[16px]" />
                                <span className="truncate uppercase font-medium">{getIndustryLabel(industry)}</span>
                            </div>
                        )}
                        {publishJob !== undefined && (
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold bg-slate-50 px-2.5 py-1 rounded-md">
                                <FontAwesomeIcon icon={faBriefcase} className="text-[14px]" />
                                <span>{publishJob} {publishJob === 1 ? 'Job' : 'Jobs'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

CompanyCard.propTypes = {
    logo: PropTypes.string,
    coverImage: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    industry: PropTypes.string,
    location: PropTypes.string,
    publishJob: PropTypes.number,
    onViewDetails: PropTypes.func,
    className: PropTypes.string
};

export default CompanyCard;
