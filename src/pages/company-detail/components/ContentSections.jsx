
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MapEmbed from './MapEmbed';

export const AboutSection = ({ company }) => {
    return (
        <div className="bg-white dark:bg-[#2c1a14] rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-[#3d241b] mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-icons-round text-orange-500">info</span>
                About {company.name}
            </h3>
            <div
                className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300"
                dangerouslySetInnerHTML={{ __html: company.description || "<p>No description available.</p>" }}
            />
        </div>
    );
};

AboutSection.propTypes = {
    company: PropTypes.object
};

export const LifeAtSection = ({ company }) => {
    const photos = company.images || [];

    if (photos.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-[#2c1a14] rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-[#3d241b] mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-icons-round text-orange-500">collections</span>
                Life at {company.name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {photos.slice(0, 4).map((photo, index) => (
                    <div key={index} className={`rounded-xl overflow-hidden h-48 relative group ${photos.length > 4 && index === 3 ? 'cursor-pointer' : ''}`}>
                        <img
                            src={photo.url || photo} // Handle object or string
                            alt={`Life at ${company.name} ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {photos.length > 4 && index === 3 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                                <span className="text-white font-bold text-lg">+ {photos.length - 4} Photos</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

LifeAtSection.propTypes = {
    company: PropTypes.object
};

export const LocationsSection = ({ company }) => {
    const [activeLocation, setActiveLocation] = useState(null);

    useEffect(() => {
        if (company?.locations?.length > 0) {
            setActiveLocation(company.locations[0]);
        } else if (company?.address) {
            setActiveLocation({
                address: company.address,
                name: "Headquarters"
            });
        }
    }, [company]);

    if (!company) return null;

    return (
        <div className="bg-white dark:bg-[#2c1a14] rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-[#3d241b] mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-icons-round text-orange-500">place</span>
                Office Locations
            </h3>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Location List */}
                <div className="w-full md:w-1/3 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {company.locations?.length > 0 && (
                        <div className="absolute left-[27px] top-16 bottom-10 w-0.5 bg-slate-100 dark:bg-[#3d241b] md:hidden"></div>
                    )}

                    {company.locations?.map((location, index) => {
                        const isActive = activeLocation === location || (activeLocation?.id && activeLocation.id === location.id);
                        return (
                            <div
                                key={location.id || index}
                                className={`relative pl-4 md:pl-4 cursor-pointer group transition-all duration-300 rounded-lg p-3 ${isActive ? 'bg-orange-50 dark:bg-orange-500/5' : 'hover:bg-slate-50 dark:hover:bg-[#3d241b]'}`}
                                onClick={() => setActiveLocation(location)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`shrink-0 size-8 rounded-full flex items-center justify-center border transition-colors ${isActive
                                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                                        : 'bg-white dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10'
                                        }`}>
                                        <span className="material-icons-round text-sm">place</span>
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-sm transition-colors ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-slate-900 dark:text-white'}`}>
                                            {location.name || location.city}
                                        </h4>
                                        <p className="text-slate-500 dark:text-[#8c6b5d] text-xs mt-1 line-clamp-2">
                                            {[location.address, location.district, location.city, location.country].filter(Boolean).join(', ')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {(!company.locations || company.locations.length === 0) && company.address && (
                        <div className="relative pl-4 md:pl-4 p-3 rounded-lg bg-orange-50 dark:bg-orange-500/5">
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 size-8 rounded-full flex items-center justify-center border bg-orange-500 text-white border-orange-500 shadow-sm">
                                    <span className="material-icons-round text-sm">place</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-orange-600 dark:text-orange-400">Headquarters</h4>
                                    <p className="text-slate-500 dark:text-[#8c6b5d] text-xs mt-1">
                                        {company.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {(!company.locations || company.locations.length === 0) && !company.address && (
                        <p className="text-slate-500 dark:text-[#8c6b5d] text-sm">No office locations listed.</p>
                    )}
                </div>

                {/* Map Embed */}
                <div className="w-full md:w-2/3 h-64 md:h-auto min-h-[300px] rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-[#3d241b]">
                    {activeLocation ? (
                        <MapEmbed
                            query={[activeLocation.address, activeLocation.district, activeLocation.city, activeLocation.country].filter(Boolean).join(', ') || activeLocation.address}
                            className="w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-[#1a100c] text-slate-400">
                            <div className="text-center">
                                <span className="material-icons-round text-4xl mb-2">map</span>
                                <p>Select a location to view on map</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

LocationsSection.propTypes = {
    company: PropTypes.object
};
