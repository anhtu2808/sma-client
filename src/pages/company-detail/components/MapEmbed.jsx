import React from 'react';
import PropTypes from 'prop-types';

const MapEmbed = ({ query, className }) => {
    if (!query) return null;

    // Encode the query for the URL
    const encodedQuery = encodeURIComponent(query);

    return (
        <div className={`w-full h-full rounded-xl overflow-hidden bg-slate-100 dark:bg-[#3d241b] ${className}`}>
            <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${encodedQuery}&t=&z=15&ie=UTF8&iwloc=B&output=embed`}
                allowFullScreen
                title="Company Location"
                loading="lazy"
            ></iframe>
        </div>
    );
};

MapEmbed.propTypes = {
    query: PropTypes.string.isRequired,
    className: PropTypes.string
};

export default MapEmbed;
