import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faUser, faWandMagicSparkles } from '../../../utils/icons';

const AIMatchingSection = () => {
    return (
        <section className="py-24 bg-white dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        AI-Powered Matching in Action
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        See how our intelligent system analyzes profiles and finds perfect job matches
                    </p>
                </div>

                {/* Mockup Card */}
                <div className="max-w-4xl mx-auto bg-white dark:bg-surface-dark rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left Panel - Match Analysis */}
                        <div className="p-8 md:p-10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-surface-dark border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800">
                            {/* Circular Progress */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative w-36 h-36 mb-3">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                        <circle cx="60" cy="60" r="52" fill="none" stroke="#f3f4f6" strokeWidth="10" className="dark:stroke-gray-700" />
                                        <circle cx="60" cy="60" r="52" fill="none" stroke="url(#matchGradient)" strokeWidth="10" strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 52 * 0.67} ${2 * Math.PI * 52 * 0.33}`}
                                        />
                                        <defs>
                                            <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#f97316" />
                                                <stop offset="100%" stopColor="#ea580c" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-extrabold text-gray-900 dark:text-white">67%</span>
                                        <span className="text-xs text-gray-400">Match Score</span>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-semibold border border-green-100 dark:border-green-800/30">
                                    <FontAwesomeIcon icon={faCircleCheck} className="text-sm" />
                                    Strong Fit
                                </span>
                            </div>

                            {/* Progress Bars */}
                            <div className="space-y-4 mb-8">
                                {/* Job Level */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Job Level</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">85%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{width: '85%'}}></div>
                                    </div>
                                </div>
                                {/* Job Title */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">72%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-400 rounded-full transition-all duration-1000" style={{width: '72%'}}></div>
                                    </div>
                                </div>
                                {/* Skills Match */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Skills Match</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">90%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{width: '90%'}}></div>
                                    </div>
                                </div>
                            </div>

                            {/* AI Analysis Footer */}
                            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                                <FontAwesomeIcon icon={faWandMagicSparkles} className="text-blue-500 text-lg" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">AI Analysis</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Deep learning model v2.1</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Candidate Profile */}
                        <div className="p-8 md:p-10">
                            {/* Profile Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faUser} className="text-gray-400 dark:text-gray-500 text-2xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">Sarah Johnson</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Senior Frontend Developer</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 mb-0.5">Match Quality</p>
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Excellent
                                    </span>
                                </div>
                            </div>

                            {/* Skeleton line under profile */}
                            <div className="flex gap-2 mb-6">
                                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full flex-1"></div>
                                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full w-1/4"></div>
                                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full w-1/5"></div>
                            </div>

                            {/* Summary */}
                            <div className="mb-6">
                                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2.5">Summary</p>
                                <div className="space-y-2">
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full w-full"></div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full w-5/6"></div>
                                </div>
                            </div>

                            {/* Key Skills */}
                            <div className="mb-6">
                                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2.5">Key Skills</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {['React', 'TypeScript', 'Next.js', 'Tailwind'].map(skill => (
                                        <span key={skill} className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[11px] font-semibold border border-blue-100 dark:border-blue-800/30">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Experience */}
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2.5">Experience</p>
                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full w-3/4"></div>
                                        <div className="flex gap-1.5">
                                            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full w-1/4"></div>
                                            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full w-1/5"></div>
                                            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full w-1/6"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full w-2/3"></div>
                                        <div className="flex gap-1.5">
                                            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full w-1/3"></div>
                                            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full w-1/4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIMatchingSection;
