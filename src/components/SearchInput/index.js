import React from 'react';
import Button from '@/components/Button';
import './SearchInput.scss';

const SearchInput = ({
    placeholder = 'Search...',
    value = '',
    onChange = () => { },
    onSearch = () => { },
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
                <Button
                    mode="primary"
                    shape="pill"
                    size={size}
                    className="search-button !m-1"
                    onClick={handleSearchClick}
                    aria-label="Search"
                >
                    <span className="material-icons-round">search</span>
                </Button>
            </div>
        </div>
    );
};

export default SearchInput;
