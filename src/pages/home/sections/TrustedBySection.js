import React from 'react';

const TrustedBySection = () => {
    const companies = [
        { icon: 'cloud_queue', name: 'Cloudify' },
        { icon: 'token', name: 'BlockSys' },
        { icon: 'auto_graph', name: 'DataPeak' },
        { icon: 'hub', name: 'NexusAI' },
        { icon: 'security', name: 'SecureNet' },
    ];

    return (
        <section className="border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-background-dark py-12">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-8">
                    Trusted by innovative tech teams
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    {companies.map((company, index) => (
                        <div key={index} className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white">
                            <span className="material-icons-round text-3xl">{company.icon}</span> {company.name}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedBySection;
