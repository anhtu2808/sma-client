import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const InteractiveFeaturesSection = () => {
    const navigate = useNavigate();
    const [activeTabId, setActiveTabId] = useState('jobs');
    const isPausedRef = useRef(false);
    const tabIds = ['jobs', 'companies', 'cv-analysis', 'cv-builder', 'smart-ai'];

    const goToNextTab = useCallback(() => {
        if (isPausedRef.current) return;
        setActiveTabId(prev => {
            const currentIndex = tabIds.indexOf(prev);
            const nextIndex = (currentIndex + 1) % tabIds.length;
            return tabIds[nextIndex];
        });
    }, []);

    useEffect(() => {
        const intervalId = setInterval(goToNextTab, 2000);
        return () => clearInterval(intervalId);
    }, [goToNextTab]);

    const tabs = [
        {
            id: 'jobs',
            icon: 'search',
            iconBg: 'bg-orange-500',
            iconColor: 'text-white',
            title: 'Find Jobs',
            desc: 'Explore 50k+ active job listings.',
            bottomElem: (
                <div className="h-1.5 w-full bg-orange-100 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-orange-500 w-2/3 rounded-full"></div>
                </div>
            ),
            panel: {
                title: 'Discover "cool" jobs at ideal companies',
                desc: 'SmartRecruit provides high-quality job information worldwide with competitive and transparent salaries. Support candidates in searching for job information easily, quickly finding their dream job.',
                linkText: 'Learn more',
                linkUrl: '/jobs',
                subDesc: 'Create CV - portfolio and find jobs online - all for FREE!',
                tagsTitle: 'Trending jobs',
                tags: ['Backend Developer', 'Frontend Developer', 'Data Analyst', 'FullStack Developer', 'DevOps Engineer', 'QA Engineer', 'Business Analyst', 'Project Manager'],
                mockup: (
                    <div className="relative w-full h-full flex items-center justify-center p-8">
                        {/* Background Decoration */}
                        <div className="absolute inset-0 bg-orange-50/50 dark:bg-orange-900/10 rounded-full transform scale-125 blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-100 dark:bg-orange-900/20 rounded-full"></div>

                        {/* Search Bar Mockup */}
                        <div className="absolute top-10 w-full max-w-sm bg-white dark:bg-surface-dark rounded-full shadow-lg border border-gray-100 dark:border-gray-800 p-2 flex items-center gap-2 z-10 transform -rotate-2">
                            <span className="material-icons-round text-orange-500 ml-2">search</span>
                            <div className="flex-1 text-sm text-gray-400">Software Engineer...</div>
                            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
                                <span className="material-icons-round text-sm">arrow_forward</span>
                            </div>
                        </div>

                        {/* Main Cards Mockup */}
                        <div className="w-full max-w-sm mt-12 space-y-4 relative z-20">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-4 transform transition-transform hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center text-red-500 font-bold text-xl">
                                            H
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900 dark:text-white">Senior Frontend Engineer</div>
                                            <div className="text-xs text-gray-500">HSBC Tech</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-3/4 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                    <div className="h-2 w-1/2 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-4 transform translate-x-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-xl">
                                            A
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900 dark:text-white">Data Engineer</div>
                                            <div className="text-xs text-gray-500">ASML</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
                                    <div className="h-2 w-2/3 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        },
        {
            id: 'companies',
            icon: 'apartment',
            iconBg: 'bg-orange-50 dark:bg-orange-900/20',
            iconColor: 'text-orange-500',
            title: 'Companies',
            desc: 'Research top-rated tech workplaces.',
            bottomElem: (
                <div className="flex gap-1.5 mt-5">
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-100 dark:bg-gray-800"></div>
                </div>
            ),
            panel: {
                title: 'Explore company culture & work environment',
                desc: 'Read authentic reviews from current and past employees. Reveal average salaries, benefits, interview processes, and work environments at top companies.',
                linkText: 'View company list',
                linkUrl: '/companies',
                subDesc: 'Learn deeply about companies before applying to ensure long-term fit.',
                tagsTitle: 'Top Industries',
                tags: ['Software Development', 'AI/Machine Learning', 'Data Science', 'Cybersecurity', 'Cloud Computing', 'Blockchain', 'DevOps'],
                mockup: (
                    <div className="relative w-full h-full flex items-center justify-center p-8">
                        <div className="absolute inset-0 bg-orange-50/50 dark:bg-orange-900/10 rounded-full transform scale-125 blur-3xl"></div>

                        {/* Company Card Mockup */}
                        <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden relative z-20">
                            <div className="h-20 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                            <div className="px-6 pb-6 relative">
                                <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-xl shadow-md flex items-center justify-center p-2 absolute -top-8 border-4 border-white dark:border-surface-dark">
                                    <span className="text-2xl font-bold text-blue-600">G</span>
                                </div>
                                <div className="mt-10 mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        Global Tech Inc. <span className="material-icons-round text-blue-500 text-sm">verified</span>
                                    </h3>
                                    <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                                        <span className="material-icons-round text-sm">star</span>
                                        <span className="material-icons-round text-sm">star</span>
                                        <span className="material-icons-round text-sm">star</span>
                                        <span className="material-icons-round text-sm">star</span>
                                        <span className="material-icons-round text-sm text-gray-300">star</span>
                                        <span className="text-gray-500 text-xs ml-1">4.2 (1.2k reviews)</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 mb-4">
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded">Flexible</span>
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded">Health Insurance</span>
                                </div>
                                <button className="w-full py-2 bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 text-sm font-semibold rounded-lg border border-orange-100 dark:border-orange-800/30">
                                    View 45 Open Jobs
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        },
        {
            id: 'cv-analysis',
            icon: 'check_circle',
            iconBg: 'bg-orange-50 dark:bg-orange-900/20',
            iconColor: 'text-orange-500',
            title: 'CV Analysis',
            desc: 'Get instant feedback on your resume.',
            bottomElem: (
                <div className="mt-4 font-bold text-[11px] uppercase tracking-wide text-green-600 dark:text-green-500">
                    Score: 85/100
                </div>
            ),
            panel: {
                title: 'AI Resume Scoring & Evaluation',
                desc: 'Smart analysis system scans your CV against job requirements. Get detailed feedback on missing keywords, formatting, and necessary improvements to pass screening rounds.',
                linkText: 'Analyze CV now',
                linkUrl: '/dashboard/matching-history',
                subDesc: 'Quick analysis in seconds. Absolute data security.',
                tagsTitle: 'Evaluation Criteria',
                tags: ['Match Score', 'Keywords', 'Formatting', 'Experience', 'Skills', 'Presentation'],
                mockup: (
                    <div className="relative w-full h-full flex items-center justify-center p-8">
                        <div className="absolute inset-0 bg-green-50/50 dark:bg-green-900/10 rounded-full transform scale-125 blur-3xl"></div>

                        <div className="flex gap-4 w-full max-w-lg z-20 items-end">
                            {/* CV Doc */}
                            <div className="w-1/2 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-4 transform -rotate-3 origin-bottom-right">
                                <div className="w-1/3 h-2 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                <div className="space-y-2 mb-4">
                                    <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                    <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                    <div className="w-3/4 h-1 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                    <div className="w-full h-1 bg-orange-200 dark:bg-orange-900/50 rounded animate-pulse"></div> {/* Highlighted wrong line */}
                                </div>
                                <div className="space-y-2">
                                    <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                    <div className="w-5/6 h-1 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                </div>
                            </div>

                            {/* Analysis Panel */}
                            <div className="w-1/2 bg-white dark:bg-surface-dark rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 p-4 transform translate-y-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="relative w-12 h-12">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                            <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f4f6" strokeWidth="4" className="dark:stroke-gray-700" />
                                            <circle cx="18" cy="18" r="16" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="85 15" strokeLinecap="round" />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">85</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">Great Fit</div>
                                        <div className="text-[10px] text-gray-500">Resume Score</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <span className="material-icons-round text-red-500 text-sm mt-0.5">error_outline</span>
                                        <div>
                                            <div className="text-xs font-bold text-gray-800 dark:text-gray-200">Missing Keywords</div>
                                            <div className="text-[10px] text-gray-500">Add 'React', 'TypeScript'</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="material-icons-round text-green-500 text-sm mt-0.5">check_circle</span>
                                        <div>
                                            <div className="text-xs font-bold text-gray-800 dark:text-gray-200">Format & Length</div>
                                            <div className="text-[10px] text-gray-500">Perfect 1-page length</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        },
        {
            id: 'cv-builder',
            icon: 'edit',
            iconBg: 'bg-orange-50 dark:bg-orange-900/20',
            iconColor: 'text-orange-500',
            title: 'CV Builder',
            desc: 'Create a professional CV in minutes.',
            bottomElem: (
                <div className="mt-4 space-y-1.5 opacity-40">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                    </div>
                    <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded w-2/3 ml-4"></div>
                </div>
            ),
            panel: {
                title: 'Create professional CV in clicks',
                desc: 'Providing many professional, modern, and optimized CV templates. Easily customize colors, fonts, and layout to make your CV stand out among thousands of candidates.',
                linkText: 'Create CV now',
                linkUrl: '/dashboard/resumes',
                subDesc: 'Save CV online, unlimited free PDF downloads.',
                tagsTitle: 'Key Features',
                tags: ['Diverse Templates', 'Optimized', 'Vocabulary Suggest', 'Easy PDF Download', 'Data Sync', 'Flexible Layout'],
                mockup: (
                    <div className="relative w-full h-full flex items-center justify-center p-8">
                        <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10 rounded-full transform scale-125 blur-3xl"></div>

                        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-2 shadow-xl flex gap-4 w-full max-w-lg z-20">
                            {/* Editor Sidebar */}
                            <div className="w-1/3 space-y-2">
                                <div className="p-2 bg-white dark:bg-surface-dark rounded border border-orange-200 dark:border-orange-500/30 text-[10px] font-bold text-orange-600 dark:text-orange-400">
                                    Personal Info
                                </div>
                                <div className="p-2 bg-white dark:bg-surface-dark rounded border border-gray-100 dark:border-gray-800 text-[10px] font-medium text-gray-600 dark:text-gray-400">
                                    Experience
                                </div>
                                <div className="p-2 bg-white dark:bg-surface-dark rounded border border-gray-100 dark:border-gray-800 text-[10px] font-medium text-gray-600 dark:text-gray-400">
                                    Education
                                </div>
                                <div className="p-2 bg-white dark:bg-surface-dark rounded border border-gray-100 dark:border-gray-800 text-[10px] font-medium text-gray-600 dark:text-gray-400">
                                    Skills
                                </div>
                            </div>
                            {/* Canvas Preview */}
                            <div className="w-2/3 bg-white dark:bg-surface-dark rounded shadow-sm border border-gray-100 dark:border-gray-800 p-4 relative">
                                {/* Theme picker */}
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-white dark:ring-surface-dark"></div>
                                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>

                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-3 flex items-center justify-center">
                                    <span className="material-icons-round text-blue-500 text-lg">person</span>
                                </div>
                                <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                                <div className="h-2 w-1/2 bg-blue-100 dark:bg-blue-900/50 rounded mb-4"></div>

                                <div className="space-y-2">
                                    <div>
                                        <div className="h-2 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
                                    </div>
                                    <div>
                                        <div className="h-2 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                                        <div className="flex gap-1">
                                            <div className="h-1.5 w-1/4 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                            <div className="h-1.5 w-1/4 bg-gray-100 dark:bg-gray-800 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        },
        {
            id: 'smart-ai',
            icon: 'electric_bolt',
            iconBg: 'bg-orange-500',
            iconColor: 'text-white',
            title: 'SmartRecruit AI',
            desc: 'AI-driven job matching engine.',
            bottomElem: (
                <div className="mt-4 font-bold text-[10px] uppercase tracking-widest text-orange-500 animate-pulse">
                    PROCESSING . . .
                </div>
            ),
            panel: {
                title: 'Smart job search with AI Assistant',
                desc: 'Technology magic helps you connect the right people with the right jobs. Deep learning algorithms analyze thousands of data points from skills and experience to corporate culture to automatically recommend the most perfect opportunities.',
                linkText: 'Experience AI now',
                linkUrl: '/',
                subDesc: 'Automatic 24/7 analysis. Receive the most suitable job notifications daily.',
                tagsTitle: 'AI Features',
                tags: ['Job Matching', 'AI Scoring', 'AI Suggestion', 'Recommendation Candidate', 'Resume Parsing'],
                mockup: (
                    <div className="relative w-full h-full flex flex-col justify-center p-8">
                        <div className="absolute inset-0 bg-orange-50/50 dark:bg-orange-900/10 rounded-full transform scale-125 blur-3xl"></div>

                        <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-5 relative z-20 mx-auto">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-5 border-b border-gray-100 dark:border-gray-800 pb-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
                                    <span className="material-icons-round">graphic_eq</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">AI Resume Insights</h4>
                                    <p className="text-[10px] text-gray-500">Analysis complete • Senior Frontend Role</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-orange-500">92/100</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Strong Points */}
                                <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-icons-round text-sm text-green-500">thumb_up</span>
                                        <h5 className="text-xs font-bold text-green-700 dark:text-green-400">Strong Points</h5>
                                    </div>
                                    <ul className="text-[11px] text-green-600 dark:text-green-300 space-y-1.5 ml-1">
                                        <li className="flex gap-1.5"><span className="text-green-500">•</span> Exceptional match on core skills (React, Node.js).</li>
                                        <li className="flex gap-1.5"><span className="text-green-500">•</span> Great quantifiable achievements in experience section.</li>
                                    </ul>
                                </div>

                                {/* Weak Points */}
                                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-icons-round text-sm text-red-500">thumb_down</span>
                                        <h5 className="text-xs font-bold text-red-700 dark:text-red-400">Areas to Improve</h5>
                                    </div>
                                    <ul className="text-[11px] text-red-600 dark:text-red-300 space-y-1.5 ml-1">
                                        <li className="flex gap-1.5"><span className="text-red-500">•</span> Missing keyword: "GraphQL" mentioned in job description.</li>
                                        <li className="flex gap-1.5"><span className="text-red-500">•</span> Summary is a bit generic; tailor it to fintech.</li>
                                    </ul>
                                </div>

                                {/* AI Suggestion */}
                                <div className="bg-orange-500 text-white rounded-xl p-3 shadow-md relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-20">
                                        <span className="material-icons-round text-4xl">auto_awesome</span>
                                    </div>
                                    <div className="flex items-start gap-2 relative z-10">
                                        <span className="material-icons-round text-sm mt-0.5">lightbulb</span>
                                        <div>
                                            <h5 className="text-xs font-bold mb-1">AI Suggestion</h5>
                                            <p className="text-[10px] text-orange-50 opacity-90 leading-relaxed">
                                                Based on the missing skills, consider highlighting your experience with API integrations or any side projects involving data fetching to cover the GraphQL gap.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }
    ];

    const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

    return (
        <section className="py-20 bg-gray-50 dark:bg-[#0a0f1c]">
            <div className="max-w-7xl mx-auto px-6">

                {/* 1. The 5 Cards (Tabs) */}
                <div
                    className="flex flex-col lg:flex-row gap-4 mb-8"
                    onMouseEnter={() => { isPausedRef.current = true; }}
                    onMouseLeave={() => { isPausedRef.current = false; }}
                >
                    {tabs.map((tab) => {
                        const isActive = activeTabId === tab.id;
                        return (
                            <div
                                key={tab.id}
                                onClick={() => setActiveTabId(tab.id)}
                                className={`flex-1 flex flex-col justify-between p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${isActive
                                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/10 shadow-md ring-4 ring-orange-500/10'
                                    : 'border-white dark:border-gray-800 bg-white dark:bg-surface-dark hover:border-orange-200 dark:hover:border-orange-500/30'
                                    }`}
                                style={{ minHeight: '160px' }}
                            >
                                <div>
                                    <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${tab.iconBg} ${tab.iconColor} shadow-sm`}>
                                        <span className="material-icons-round">{tab.icon}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1.5">{tab.title}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-[90%]">
                                        {tab.desc}
                                    </p>
                                </div>

                                {/* Bottom Visual Element */}
                                <div className="mt-4">
                                    {tab.bottomElem}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 2. The Expanded Bottom Panel */}
                <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-3xl p-8 lg:p-12 transition-all duration-500 animate-fadeIn">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-center">

                        {/* Left Side: Content */}
                        <div className="lg:w-1/2">
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                                {activeTab.panel.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                {activeTab.panel.desc}
                            </p>

                            <div className="mb-8 block">
                                <button
                                    onClick={() => navigate(activeTab.panel.linkUrl)}
                                    className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold hover:gap-3 transition-all"
                                >
                                    {activeTab.panel.linkText}
                                    <span className="material-icons-round text-sm">chevron_right</span>
                                </button>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                                    {activeTab.panel.subDesc}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    {activeTab.panel.tagsTitle}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {activeTab.panel.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300 font-medium hover:border-orange-300 hover:text-orange-600 cursor-default transition-colors"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Mockup Illustration */}
                        <div className="lg:w-1/2 w-full h-[400px] flex items-center justify-center">
                            {activeTab.panel.mockup}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default InteractiveFeaturesSection;
