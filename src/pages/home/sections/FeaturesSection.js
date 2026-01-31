import React from 'react';

const FeaturesSection = () => {
    const features = [
        {
            icon: 'psychology',
            title: 'Expert Matching',
            description: 'Our algorithm analyzes thousands of data points to match candidates not just on skills, but on culture fit and career goals.',
            color: 'orange',
            iconBg: 'bg-orange-100 dark:bg-orange-900/20',
            iconColor: 'text-primary'
        },
        {
            icon: 'bolt',
            title: 'Fast Hiring',
            description: 'Reduce your time-to-hire by 60%. Schedule interviews instantly and manage your pipeline with our intuitive dashboard.',
            color: 'blue',
            iconBg: 'bg-blue-100 dark:bg-blue-900/20',
            iconColor: 'text-blue-600 dark:text-blue-400'
        },
        {
            icon: 'verified_user',
            title: 'Top Tech Roles',
            description: 'From AI Engineers to Full Stack Developers, access a pool of the top 1% of tech talent verified by industry experts.',
            color: 'purple',
            iconBg: 'bg-purple-100 dark:bg-purple-900/20',
            iconColor: 'text-purple-600 dark:text-purple-400'
        }
    ];

    return (
        <section className="py-24 bg-surface-light dark:bg-background-dark/50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary font-semibold text-sm uppercase tracking-wider">Why Choose SmartRecruit</span>
                    <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Recruitment simplified, <br/>results amplified.
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        Stop sifting through irrelevant resumes. Our AI-driven platform connects you with pre-vetted talent that matches your stack perfectly.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            className="group bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-primary/20 dark:hover:border-primary/20 transition duration-300"
                        >
                            <div className={`w-14 h-14 ${feature.iconBg} ${feature.iconColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300`}>
                                <span className="material-icons-round text-3xl">{feature.icon}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
