import React from 'react';

const ColorSwatch = ({ color, name, hex, description }) => {
    return (
        <div className="flex items-center gap-4">
            <div 
                className="w-16 h-16 rounded-xl shadow-lg"
                style={{ backgroundColor: hex }}
            />
            <div>
                <p className="font-bold text-neutral-900 dark:text-white">{name}</p>
                <p className="text-sm text-neutral-500 font-mono">{hex}</p>
                {description && (
                    <p className="text-xs text-neutral-400 mt-1">{description}</p>
                )}
            </div>
        </div>
    );
};

export default ColorSwatch;
