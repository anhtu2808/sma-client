import Button from '@/components/Button';
import PropTypes from 'prop-types';

const JobCard = ({
    title,
    company,
    locationCity,
    workingModel,
    jobLevel,
    experienceTime,
    expertise,
    salary,
    tags = [],
    postedTime,
    expDate,
    isHot = false,
    companyLogo,
    isApplied = false,
    isBookmarked = false,
    isBookmarkLoading = false,
    onBookmark,
    onApply,
    onClick,
}) => {
    // Build info items for the metadata row
    const infoItems = [
        locationCity && { icon: 'location_on', text: locationCity },
        experienceTime && { icon: 'work_history', text: experienceTime },
        workingModel && { icon: 'apartment', text: workingModel },
        jobLevel && { icon: 'trending_up', text: jobLevel },
    ].filter(Boolean);

    // Build tag items: expertise first, then skills
    const allTags = [];
    if (expertise) allTags.push(expertise);
    allTags.push(...tags);

    return (
        <article
            onClick={onClick}
            className="group relative flex gap-5 p-5 md:p-6 rounded-xl bg-white dark:bg-[#2c1a14] border border-slate-200 dark:border-[#3d241b] hover:border-primary/50 dark:hover:border-primary/40 hover:shadow-[0_4px_24px_rgba(255,107,53,0.08)] transition-all duration-300 cursor-pointer"
        >
            {/* Left: Company Logo */}
            <div className="w-[72px] h-[72px] md:w-20 md:h-20 rounded-xl border border-slate-100 dark:border-[#3d241b] bg-white dark:bg-[#1a100c] p-2 shrink-0 flex items-center justify-center overflow-hidden">
                {companyLogo ? (
                    <img
                        alt={`${company} Logo`}
                        className="w-full h-full object-contain"
                        src={companyLogo}
                    />
                ) : (
                    <span className="text-2xl font-bold text-slate-400 dark:text-[#8c6b5d]">
                        {company?.charAt(0) || 'C'}
                    </span>
                )}
            </div>

            {/* Right: Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                {/* Row 1: Title + Salary */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {title}
                        </h3>
                        {isHot && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wide border border-primary/20 shrink-0">
                                <span className="material-icons-round text-[13px]">local_fire_department</span>
                                HOT
                            </span>
                        )}
                        {isApplied && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400 text-[11px] font-bold uppercase tracking-wide border border-green-500/20 shrink-0">
                                <span className="material-icons-round text-[13px]">check_circle</span>
                                Applied
                            </span>
                        )}
                    </div>
                    {/* Salary - prominent in orange */}
                    <span className="text-sm md:text-base font-bold text-primary whitespace-nowrap shrink-0">
                        {salary}
                    </span>
                </div>

                {/* Row 2: Company name */}
                <p className="text-sm text-slate-600 dark:text-[#ce9e8d] font-medium truncate">
                    {company}
                </p>

                {/* Row 3: Info pills (location, experience, working model, level) */}
                {infoItems.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-slate-500 dark:text-[#a88373]">
                        {infoItems.map((item, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1">
                                <span className="material-icons-round text-[15px] text-slate-400 dark:text-[#8c6b5d]">{item.icon}</span>
                                {item.text}
                            </span>
                        ))}
                    </div>
                )}

                {/* Row 4: Tags with separator (TopCV style) */}
                {allTags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-y-1 mt-0.5">
                        {allTags.map((tag, idx) => (
                            <span key={tag + idx} className="inline-flex items-center text-[13px] text-slate-600 dark:text-[#c4a494]">
                                {idx > 0 && <span className="mx-2 text-slate-300 dark:text-[#4b2c20]">|</span>}
                                <span className="truncate max-w-[200px]">{tag}</span>
                            </span>
                        ))}
                        {allTags.length > 5 && (
                            <span className="ml-2 text-[13px] font-semibold text-primary">
                                +{allTags.length - 5}
                            </span>
                        )}
                    </div>
                )}

                {/* Row 5: Footer - Posted date + Bookmark + CTA */}
                <div className="flex items-center justify-between mt-1 pt-2.5 border-t border-slate-100 dark:border-[#3d241b]">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-[#8c6b5d]">
                        <span className="material-icons-round text-[15px]">schedule</span>
                        Posted {postedTime}
                    </span>

                    <div className="flex items-center gap-2">
                        {/* Bookmark */}
                        <Button
                            btnIcon
                            mode="ghost"
                            shape="pill"
                            disabled={isBookmarkLoading}
                            onClick={(e) => {
                                e.stopPropagation();
                                onBookmark && onBookmark();
                            }}
                            className={`shrink-0 !p-1.5 hover:!bg-slate-100 dark:hover:!bg-[#4b2c20] ${
                                isBookmarked
                                    ? "!text-primary"
                                    : "!text-slate-400 dark:!text-[#8c6b5d] hover:!text-primary"
                            }`}
                            aria-label="Bookmark job"
                        >
                            <span className="material-icons-round text-[22px]">
                                {isBookmarked ? "bookmark" : "bookmark_border"}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    );
};

JobCard.propTypes = {
    title: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    locationCity: PropTypes.string,
    workingModel: PropTypes.string,
    jobLevel: PropTypes.string,
    experienceTime: PropTypes.string,
    expertise: PropTypes.string,
    salary: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    postedTime: PropTypes.string.isRequired,
    expDate: PropTypes.string,
    isHot: PropTypes.bool,
    isApplied: PropTypes.bool,
    isBookmarked: PropTypes.bool,
    isBookmarkLoading: PropTypes.bool,
    companyLogo: PropTypes.string,
    onBookmark: PropTypes.func,
    onApply: PropTypes.func,
    onClick: PropTypes.func,
};

export default JobCard;
