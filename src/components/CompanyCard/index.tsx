
import PropTypes from 'prop-types';
import Button from '@/components/Button';

const CompanyCard = ({
    logo,
    name,
    isApproved = false,
    industry,
    location,
    followers = 0,
    onViewDetails,
    className = ""
}) => {
    return (
        <article className={`group relative flex flex-col p-6 rounded-2xl bg-white dark:bg-[#2c1a14] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-transparent hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 ${className}`}>

            {/* Header: Logo & Badge */}
            <div className="flex justify-between items-start mb-4">
                <div className="size-16 rounded-xl bg-white p-1 shadow-sm border border-slate-100 dark:border-white/10 overflow-hidden">
                    {logo ? (
                        <img
                            src={logo}
                            alt={`${name} logo`}
                            className="w-full h-full object-contain rounded-lg"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-white/5 text-2xl font-bold text-slate-400">
                            {name?.charAt(0) || 'C'}
                        </div>
                    )}
                </div>

                {isApproved && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-500/20">
                        Approved
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                    {name}
                </h3>
                {industry && (
                    <p className="text-xs font-semibold text-slate-400 dark:text-[#8c6b5d] uppercase tracking-wider mb-1">
                        {industry}
                    </p>
                )}

                <div className="flex flex-col gap-1.5 mt-2">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-[#ce9e8d] text-sm">
                        <span className="material-icons-round text-[18px]">place</span>
                        <span className="truncate">{location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-[#ce9e8d] text-sm">
                        <span className="material-icons-round text-[18px]">person_add</span>
                        <span>{followers > 1000 ? `${(followers / 1000).toFixed(1)}k` : followers} followers</span>
                    </div>
                </div>
            </div>

            {/* Footer: Action */}
            <div className="mt-auto">
                <Button
                    mode="primary"
                    fullWidth
                    onClick={onViewDetails}
                    className="!py-2.5 !text-sm !font-bold border-slate-200 dark:border-[#4b2c20] text-primary hover:text-white hover:bg-primary hover:border-primary dark:hover:border-primary transition-all"
                    iconRight={<span className="material-icons-round text-[20px]">arrow_forward</span>}
                >
                    View Company
                </Button>
            </div>

        </article>
    );
};

CompanyCard.propTypes = {
    logo: PropTypes.string,
    name: PropTypes.string.isRequired,
    isApproved: PropTypes.bool,
    industry: PropTypes.string,
    location: PropTypes.string.isRequired,
    followers: PropTypes.number,
    onViewDetails: PropTypes.func,
    className: PropTypes.string
};

export default CompanyCard;
