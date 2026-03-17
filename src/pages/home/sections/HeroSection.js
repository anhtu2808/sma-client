import Button from '@/components/Button';
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="relative pt-20 pb-20 overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-lighten animate-pulse"></div>
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-lighten animate-pulse"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                {/* Heading */}
                <h1 className="text-4xl md:text-6xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900 dark:text-white mx-auto">
                    Connecting top-tier tech talent <br className="hidden md:block" /> with <br className="hidden md:block" /> <span className="text-gradient bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">innovative companies</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    SmartRecruit is the ultimate bridge between elite developers and world-class organizations. Streamline your hiring process today.
                </p>

                {/* Search Box */}
                <div className="bg-white dark:bg-surface-dark p-3 sm:p-2 rounded-2xl sm:rounded-full shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-2 mb-10 transform transition hover:-translate-y-1 duration-300">
                    <div className="flex-1 h-12 flex items-center px-4 border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-gray-700">
                        <span className="material-icons-round text-gray-400 mr-2">search</span>
                        <input
                            className="w-full bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-400 text-sm outline-none"
                            placeholder="Job title, keywords..."
                            type="text"
                        />
                    </div>
                    <div className="flex-1 h-12 flex items-center px-4">
                        <span className="material-icons-round text-gray-400 mr-2">location_on</span>
                        <input
                            className="w-full bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-400 text-sm outline-none"
                            placeholder="City, state, or remote"
                            type="text"
                        />
                    </div>
                    <Button
                        mode="primary"
                        size="md"
                        className="h-12 px-8 shrink-0 w-full sm:w-auto rounded-xl sm:rounded-full"
                        glow={true}

                    >
                        Find a Job
                    </Button>
                </div>

                {/* Dashboard Preview - Job Listing Mockup */}
                <div className="mt-16 relative mx-auto max-w-5xl">
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
                                    <span className="material-icons-round text-gray-400 text-sm">search</span>
                                    <span className="text-xs text-gray-400">Job title, keywords...</span>
                                </div>

                                {/* Location */}
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Location</p>
                                <div className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-5">
                                    <span className="text-xs text-gray-700 dark:text-gray-300">New York, NY</span>
                                    <span className="material-icons-round text-gray-400 text-sm">expand_more</span>
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
                                            <span className="material-icons-round text-white" style={{fontSize: '10px'}}>check</span>
                                        </span>
                                        Mid Level
                                    </label>
                                    <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 font-medium">
                                        <span className="w-3.5 h-3.5 rounded bg-primary flex items-center justify-center">
                                            <span className="material-icons-round text-white" style={{fontSize: '10px'}}>check</span>
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
                                {/* Page Title */}
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">Software Engineering Jobs</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Showing 124 results based on your preferences</p>

                                {/* Job Cards */}
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
                                                <span className="inline-flex items-center gap-0.5"><span className="material-icons-round text-xs">location_on</span> Remote / San Francisco</span>
                                                <span className="inline-flex items-center gap-0.5"><span className="material-icons-round text-xs">work_outline</span> Full-time</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] text-gray-400">Posted 2 days ago</span>
                                                <span className="material-icons-round text-gray-300 dark:text-gray-600 text-lg">bookmark_border</span>
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
                                                <span className="inline-flex items-center gap-0.5"><span className="material-icons-round text-xs">location_on</span> New York, NY (Hybrid)</span>
                                                <span className="inline-flex items-center gap-0.5"><span className="material-icons-round text-xs">work_outline</span> Contract</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] text-gray-400">Posted 5 hours ago</span>
                                                <span className="material-icons-round text-primary text-lg">bookmark</span>
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
                                                <span className="inline-flex items-center gap-0.5"><span className="material-icons-round text-xs">location_on</span> Austin, TX</span>
                                                <span className="inline-flex items-center gap-0.5"><span className="material-icons-round text-xs">work_outline</span> Full-time</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] text-gray-400">Posted 1 day ago</span>
                                                <span className="material-icons-round text-primary text-lg">bookmark</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pagination */}
                                <div className="flex items-center justify-center gap-1.5 mt-6">
                                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-gray-400 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary/30 transition">
                                        <span className="material-icons-round text-sm">chevron_left</span>
                                    </span>
                                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-primary">1</span>
                                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary/30 transition">2</span>
                                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary/30 transition">3</span>
                                    <span className="text-xs text-gray-400 px-1">...</span>
                                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary/30 transition">12</span>
                                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-gray-400 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary/30 transition">
                                        <span className="material-icons-round text-sm">chevron_right</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Card - Offer Accepted */}
                    <div className="absolute -right-12 top-16 bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-xl animate-bounce hidden lg:block border border-gray-100 dark:border-gray-700 z-20">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
                                <span className="material-icons-round text-lg">check_circle</span>
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

export default HeroSection;
