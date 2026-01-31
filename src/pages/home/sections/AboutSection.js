import React from 'react';

const AboutSection = () => {
    const checklistItems = [
        'Unified candidate dashboard',
        'Automated skill verification',
        'Salary benchmarking tools',
        'Predictive cultural fit scoring'
    ];

    return (
        <section className="py-24 bg-white dark:bg-background-dark overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Image */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 min-h-[400px] flex items-center justify-center">
                            <div className="text-center p-8">
                                <span className="material-icons-round text-8xl text-gray-300 dark:text-gray-600">groups</span>
                                <p className="text-gray-400 mt-4 text-lg">Team Collaboration</p>
                            </div>
                            
                            {/* Testimonial Card */}
                            <div className="absolute bottom-8 right-8 bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 max-w-xs">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white dark:border-gray-800"></div>
                                        <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-white dark:border-gray-800"></div>
                                        <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white dark:border-gray-800"></div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-500">+2.5k Hired</span>
                                </div>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">"We built our entire engineering team through SmartRecruit in 3 weeks."</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            Data-driven team success: <br/>hiring that actually matters
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Stop guessing about candidate quality. Get actionable insights with comprehensive skill assessments and past project analytics.
                        </p>
                        
                        <ul className="space-y-4 mb-10">
                            {checklistItems.map((item, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <span className="material-icons-round text-primary">check_circle</span>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                        
                        <button className="bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary px-8 py-3 rounded-full font-semibold transition-colors">
                            Learn more about our process
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
