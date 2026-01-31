import React from 'react';
import { Link } from 'react-router-dom';

const CategoriesSection = () => {
    const categories = [
        {
            icon: 'code',
            title: 'Software Engineering',
            count: '1,240+',
            color: 'indigo',
            iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
            iconColor: 'text-indigo-600 dark:text-indigo-400',
            hoverBg: 'group-hover:bg-indigo-600'
        },
        {
            icon: 'brush',
            title: 'Product Design',
            count: '850+',
            color: 'pink',
            iconBg: 'bg-pink-100 dark:bg-pink-900/30',
            iconColor: 'text-pink-600 dark:text-pink-400',
            hoverBg: 'group-hover:bg-pink-600'
        },
        {
            icon: 'dns',
            title: 'DevOps & Cloud',
            count: '620+',
            color: 'teal',
            iconBg: 'bg-teal-100 dark:bg-teal-900/30',
            iconColor: 'text-teal-600 dark:text-teal-400',
            hoverBg: 'group-hover:bg-teal-600'
        },
        {
            icon: 'analytics',
            title: 'Data Science',
            count: '940+',
            color: 'orange',
            iconBg: 'bg-orange-100 dark:bg-orange-900/30',
            iconColor: 'text-orange-600 dark:text-orange-400',
            hoverBg: 'group-hover:bg-primary'
        }
    ];

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Hire for trending roles</h2>
                        <p className="text-gray-600 dark:text-gray-400">Browse the most in-demand tech categories.</p>
                    </div>
                    <Link to="/categories" className="text-primary font-semibold hover:underline mt-4 md:mt-0 inline-flex items-center gap-1">
                        View all categories <span className="material-icons-round text-sm">arrow_forward</span>
                    </Link>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <Link 
                            key={index}
                            to={`/categories/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                            className="group p-6 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition"
                        >
                            <div className={`w-10 h-10 ${category.iconBg} rounded-lg flex items-center justify-center ${category.iconColor} mb-4 ${category.hoverBg} group-hover:text-white transition`}>
                                <span className="material-icons-round">{category.icon}</span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{category.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} Active Candidates</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;
