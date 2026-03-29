import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmarkRegular, faBookmarkSolid, faBriefcase, faCheck, faChevronDown, faChevronLeft, faChevronRight, faCircleCheck, faLocationDot, faMagnifyingGlass } from '../../../utils/icons';

const DashboardPreviewSection = () => {
    return (
        <section className="py-20 bg-white dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-6">
                <div className="relative mx-auto max-w-5xl">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Job Listing
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            Browse through the available job listings and find the perfect match for your skills and experience.
                        </p>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        {/* Window Header */}
                        <div className="h-8 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>

                        <div className="flex">
                            {/* Sidebar Filters */}
                            <div className="hidden md:block w-56 shrink-0 border-r border-gray-100 dark:border-gray-700 p-5 bg-white dark:bg-surface-dark text-left">
                                {/* Logo */}
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white text-xs font-bold">S</div>
                                    <span className="font-bold text-sm text-gray-900 dark:text-white">SmartRecruit</span>
                                </div>

                                {/* Search */}
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Search</p>
                                <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-5">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 text-sm" />
                                    <span className="text-xs text-gray-400">Job title, keywords...</span>
                                </div>

                                {/* Location */}
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Location</p>
                                <div className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-5">
                                    <span className="text-xs text-gray-700 dark:text-gray-300">New York, NY</span>
                                    <FontAwesomeIcon icon={faChevronDown} className="text-gray-400 text-sm" />
                                </div>

                                {/* Job Level */}
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Job Level</p>
                                <div className="space-y-1.5 mb-5">
                                    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                        <span className="w-3.5 h-3.5 rounded border border-gray-300 dark:border-gray-600 inline-block"></span>
                                        Entry Level
                                    </label>
                                    <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 font-medium">
                                        <span className="w-3.5 h-3.5 rounded bg-primary flex items-center justify-center">
                                            <FontAwesomeIcon icon={faCheck} className="text-white" />
                                        </span>
                                        Mid Level
                                    </label>
                                    <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 font-medium">
                                        <span className="w-3.5 h-3.5 rounded bg-primary flex items-center justify-center">
                                            <FontAwesomeIcon icon={faCheck} className="text-white" />
                                        </span>
                                        Senior Level
                                    </label>
                                </div>

                                {/* Working Model */}
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Working Model</p>
                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    <span className="px-2.5 py-1 rounded-full bg-primary text-white text-[10px] font-semibold">Remote</span>
                                    <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-medium border border-gray-200 dark:border-gray-700">On-site</span>
                                    <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-medium border border-gray-200 dark:border-gray-700">Hybrid</span>
                                </div>

                                {/* Salary Range */}
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Salary Range</p>
                                    <span className="text-[10px] font-bold text-primary">$120k - $180k</span>
                                </div>
                                <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                                    <div className="absolute left-[15%] right-[20%] h-full bg-primary rounded-full"></div>
                                    <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-white shadow"></div>
                                    <div className="absolute right-[20%] top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-white shadow"></div>
                                </div>
                            </div>

                            {/* Main Job List Content */}
                            <div className="flex-1 p-5 md:p-6 bg-white dark:bg-surface-dark text-left">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">Software Engineering Jobs</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Showing 124 results based on your preferences</p>

                                <div className="space-y-4">
                                    {/* Job Card 1 */}
                                    <div className="flex items-start gap-3.5 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition cursor-pointer group">
                                        <div className="w-10 h-10 rounded-full bg-blue-500 shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-0.5">
                                                <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition">Senior Full Stack Developer</h4>
                                                <span className="text-sm font-bold text-primary whitespace-nowrap">$140k - $185k</span>
                                            </div>
                                            <p className="text-xs text-primary font-medium mb-1.5">TechFlow Solutions</p>
                                            <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 mb-2.5">
                                                <span className="inline-flex items-center gap-0.5"><FontAwesomeIcon icon={faLocationDot} className="text-xs" /> Remote / San Francisco</span>
                                                <span className="inline-flex items-center gap-0.5"><FontAwesomeIcon icon={faBriefcase} className="text-xs" /> Full-time</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] text-gray-400">Posted 2 days ago</span>
                                                <FontAwesomeIcon icon={faBookmarkRegular} className="text-gray-300 dark:text-gray-600 text-lg" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Job Card 2 */}
                                    <div className="flex items-start gap-3.5 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition cursor-pointer group">
                                        <div className="w-10 h-10 rounded-full bg-purple-500 shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-0.5">
                                                <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition">Product Designer (UI/UX)</h4>
                                                <span className="text-sm font-bold text-primary whitespace-nowrap">$90k - $120k</span>
                                            </div>
                                            <p className="text-xs text-primary font-medium mb-1.5">DesignStudio Global</p>
                                            <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 mb-2.5">
                                                <span className="inline-flex items-center gap-0.5"><FontAwesomeIcon icon={faLocationDot} className="text-xs" /> New York, NY (Hybrid)</span>
                                                <span className="inline-flex items-center gap-0.5"><FontAwesomeIcon icon={faBriefcase} className="text-xs" /> Contract</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] text-gray-400">Posted 5 hours ago</span>
                                                <FontAwesomeIcon icon={faBookmarkSolid} className="text-primary text-lg" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Job Card 3 */}
                                    <div className="flex items-start gap-3.5 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition cursor-pointer group">
                                        <div className="w-10 h-10 rounded-full bg-green-500 shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-0.5">
                                                <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition">Lead Frontend Engineer</h4>
                                                <span className="text-sm font-bold text-primary whitespace-nowrap">$160k - $210k</span>
                                            </div>
                                            <p className="text-xs text-primary font-medium mb-1.5">EcoSphere Systems</p>
                                            <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 mb-2.5">
                                                <span className="inline-flex items-center gap-0.5"><FontAwesomeIcon icon={faLocationDot} className="text-xs" /> Austin, TX</span>
                                                <span className="inline-flex items-center gap-0.5"><FontAwesomeIcon icon={faBriefcase} className="text-xs" /> Full-time</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] text-gray-400">Posted 1 day ago</span>
                                                <FontAwesomeIcon icon={faBookmarkSolid} className="text-primary text-lg" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pagination */}
                                <div className="flex items-center justify-center gap-1.5 mt-6">
                                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-gray-400 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary/30 transition">
                                        <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
                                    </span>
                                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-primary">1</span>
                                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary/30 transition">2</span>
                                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary/30 transition">3</span>
                                    <span className="text-xs text-gray-400 px-1">...</span>
                                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary/30 transition">12</span>
                                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-gray-400 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary/30 transition">
                                        <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Card - Offer Accepted */}
                    <div className="absolute -right-12 top-16 bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-xl animate-bounce hidden lg:block border border-gray-100 dark:border-gray-700 z-20">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
                                <FontAwesomeIcon icon={faCircleCheck} className="text-lg" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Offer Accepted</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">$145,000 / yr</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardPreviewSection;
