import Button from '@/components/Button';
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-lighten animate-pulse"></div>
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-lighten animate-pulse"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800 text-primary text-xs font-semibold mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    #1 Platform for IT Recruitment
                </div>

                {/* Heading */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900 dark:text-white max-w-5xl mx-auto">
                    Connecting top-tier tech talent <br className="hidden md:block" /> with <span className="text-gradient bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">innovative companies</span>
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

                {/* Popular Tags */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <span>Popular:</span>
                    <div className="flex flex-wrap justify-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition">Frontend Dev</span>
                        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition">UX Designer</span>
                        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition">Data Scientist</span>
                    </div>
                </div>

                {/* Dashboard Preview */}
                <div className="mt-16 relative mx-auto max-w-5xl">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        {/* Window Header */}
                        <div className="h-8 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">
                            {/* Recent Jobs Panel */}
                            <div className="p-6 bg-white dark:bg-surface-dark">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-gray-900 dark:text-white">Recent Jobs</h3>
                                    <Link to="/jobs" className="text-xs text-primary font-medium hover:underline">View All</Link>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition group cursor-pointer">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">G</div>
                                            <span className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-2 py-0.5 text-gray-500">Full-time</span>
                                        </div>
                                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 group-hover:text-primary transition">Senior Frontend Dev</h4>
                                        <p className="text-xs text-gray-500">$120k - $150k • Remote</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition group cursor-pointer">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xs">S</div>
                                            <span className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-2 py-0.5 text-gray-500">Contract</span>
                                        </div>
                                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 group-hover:text-primary transition">Product Designer</h4>
                                        <p className="text-xs text-gray-500">$80/hr • New York</p>
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div className="col-span-2 p-0 relative min-h-[300px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="material-icons-round text-6xl text-gray-300 dark:text-gray-600">person_search</span>
                                    <p className="text-gray-400 mt-2">Find Your Perfect Match</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Cards */}
                    <div className="absolute -right-12 top-20 bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-xl animate-bounce hidden lg:block border border-gray-100 dark:border-gray-700 z-20">
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

                    <div className="absolute -left-8 bottom-20 bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-xl animate-pulse hidden lg:block border border-gray-100 dark:border-gray-700 z-20">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full text-orange-600 dark:text-orange-400">
                                <span className="material-icons-round text-lg">star</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Top Match</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">98% Fit</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
