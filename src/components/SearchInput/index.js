import React from 'react';
import './SearchInput.scss';

const SearchInput = ({ 
    placeholder = 'Search...', 
    value = '',
    onChange = () => {},
    onSearch = () => {},
    className = '',
    size = 'md',
    ...props 
}) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch(value);
        }
    };

    const handleSearchClick = () => {
        onSearch(value);
    };

    return (
        <div className={`search-input-wrapper search-input-${size} ${className}`}>
            <div className="search-input-container">
                <span className="search-icon material-icons-round">search</span>
                <input
                    type="search"
                    className="search-input"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    {...props}
                />
                <button 
                    type="button"
                    className="search-button"
                    onClick={handleSearchClick}
                    aria-label="Search"
                >
                    <span className="material-icons-round">search</span>
                </button>
            </div>
        </div>
    );
};

export default SearchInput;
