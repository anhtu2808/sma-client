import Button from '@/components/Button';
import PropTypes from 'prop-types';

const JobCard = ({
    title,
    company,
    location,
    salary,
    tags = [],
    postedTime,
    isHot = false,
    companyLogo,
    isApplied = false,
    isBookmarked = false,
    isBookmarkLoading = false,
    onBookmark,
    onApply,
    onClick, // New prop for card click
    variant = 'primary' // 'primary' or 'secondary'
}) => {
    return (
        <article
            onClick={onClick}
            className="group relative flex flex-col gap-6 p-6 md:p-8 rounded-2xl bg-white dark:bg-[#2c1a14] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-transparent hover:border-primary/30 transition-all duration-300 cursor-pointer"
        >
            {/* Header Section: Logo, Title, Badge */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 items-start">
                    {/* Company Logo */}
                    <div className="size-16 rounded-full bg-white p-1 shadow-sm shrink-0 overflow-hidden">
                        <div className="w-full h-full rounded-full bg-slate-100 dark:bg-black/20 flex items-center justify-center">
                            {companyLogo ? (
                                <img
                                    alt={`${company} Logo`}
                                    className="w-full h-full object-cover rounded-full opacity-90 hover:opacity-100 transition-opacity"
                                    src={companyLogo}
                                />
                            ) : (
                                <span className="text-2xl font-bold text-neutral-600 dark:text-neutral-400">
                                    {company?.charAt(0) || 'C'}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col pt-1 gap-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors">
                                {title}
                            </h3>
                            {/* Hot Badge */}
                            {isHot && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                                    <span className="material-icons-round text-[14px] font-bold">local_fire_department</span>
                                    HOT
                                </span>
                            )}
                            {/* Applied Badge */}
                            {isApplied && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider border border-green-500/20">
                                    <span className="material-icons-round text-[14px] font-bold">check_circle</span>
                                    Applied
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-[#ce9e8d] text-sm md:text-base">
                            <span className="font-medium text-slate-900 dark:text-white">{company}</span>
                            <span className="size-1 rounded-full bg-slate-300 dark:bg-[#4b2c20]"></span>
                            <span>{location}</span>
                        </div>
                    </div>
                </div>

                {/* Bookmark Action */}
                <Button
                    btnIcon
                    mode="ghost"
                    shape="pill"
                    disabled={isBookmarkLoading}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        onBookmark && onBookmark();
                    }}
                    className={`shrink-0 !p-2 hover:!bg-slate-100 dark:hover:!bg-[#4b2c20] ${
                        isBookmarked
                            ? "!text-primary"
                            : "!text-slate-400 dark:!text-[#8c6b5d] hover:!text-primary"
                    }`}
                    aria-label="Bookmark job"
                >
                    <span className="material-icons-round text-[24px]">
                        {isBookmarked ? "bookmark" : "bookmark_border"}
                    </span>
                </Button>
            </div>

            {/* Tags & Salary */}
            <div className="flex flex-wrap items-center gap-3">
                {salary && (
                    <div className="flex items-center justify-center px-4 py-2 rounded-full bg-slate-100 dark:bg-[#3d241b] text-slate-700 dark:text-[#e0c4b7] text-sm font-medium">
                        {salary}
                    </div>
                )}
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center px-4 py-2 rounded-full bg-slate-100 dark:bg-[#3d241b] text-slate-700 dark:text-[#e0c4b7] text-sm font-medium"
                    >
                        {tag}
                    </div>
                ))}
            </div>

            {/* Divider */}
            <hr className="border-t border-slate-100 dark:border-[#3d241b]" />

            {/* Footer: Time & CTA */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 dark:text-[#8c6b5d] text-sm">
                    <span className="material-icons-round text-[18px]">schedule</span>
                    <span>Posted {postedTime}</span>
                </div>

                {variant === 'primary' ? (
                    <Button
                        mode="primary"
                        shape="pill"
                        onClick={(e) => {
                            e.stopPropagation();
                            onApply && onApply();
                        }}
                        className="!h-10 !px-6 !text-sm !font-bold shadow-md hover:!scale-105"
                        iconRight={<span className="material-icons-round text-[18px]">arrow_outward</span>}
                    >
                        Apply Now
                    </Button>
                ) : (
                    <Button
                        mode="secondary"
                        shape="pill"
                        onClick={(e) => {
                            e.stopPropagation();
                            onApply && onApply();
                        }}
                        className="!h-10 !px-6 !text-sm !font-bold bg-transparent border-slate-200 dark:border-[#4b2c20] dark:text-white hover:bg-slate-50 dark:hover:bg-[#3d241b]"
                    >
                        View Details
                    </Button>
                )}
            </div>
        </article>
    );
};

JobCard.propTypes = {
    title: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    salary: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    postedTime: PropTypes.string.isRequired,
    isHot: PropTypes.bool,
    isApplied: PropTypes.bool,
    isBookmarked: PropTypes.bool,
    isBookmarkLoading: PropTypes.bool,
    companyLogo: PropTypes.string,
    onBookmark: PropTypes.func,
    onApply: PropTypes.func,
    onClick: PropTypes.func, // Added prop type
    variant: PropTypes.oneOf(['primary', 'secondary'])
};

export default JobCard;
