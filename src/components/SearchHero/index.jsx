
import React from 'react';
import SearchInput from '@/components/SearchInput';
import PropTypes from 'prop-types';

const SearchHero = ({
    title = "Find Your Dream Job",
    subtitle = "Browse thousands of job openings from top companies and startups.",
    searchValue,
    onSearchChange,
    placeholder = "Search...",
    className = ""
}) => {
    return (
        <div className={`relative bg-gradient-to-r from-[#FF6B35] to-[#FF9F43] py-16 px-4 md:px-6 shadow-lg shadow-orange-500/10 mb-12 overflow-hidden ${className}`}>
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

            <div className="container mx-auto relative z-10 text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-sm">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-orange-50 mb-8 text-lg max-w-2xl mx-auto hidden md:block">
                        {subtitle}
                    </p>
                )}

                <div className="max-w-3xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
                    <SearchInput
                        placeholder={placeholder}
                        value={searchValue}
                        onChange={onSearchChange}
                        size="lg"
                    />
                </div>
            </div>
        </div>
    );
};

SearchHero.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    searchValue: PropTypes.string,
    onSearchChange: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string
};

export default SearchHero;
