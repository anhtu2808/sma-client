import React, { useState } from 'react';
import './Switch.scss';

const Switch = ({ 
    id,
    label = '',
    checked: controlledChecked,
    defaultChecked = false,
    onChange = () => {},
    disabled = false,
    className = '',
    ...props 
}) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    
    // Use controlled if provided, otherwise use internal state
    const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;
    
    const handleChange = (e) => {
        if (controlledChecked === undefined) {
            setInternalChecked(e.target.checked);
        }
        onChange(e);
    };

    return (
        <label className={`switch-wrapper ${className}`} htmlFor={id}>
            <input
                id={id}
                type="checkbox"
                className="switch-input"
                checked={isChecked}
                onChange={handleChange}
                disabled={disabled}
                {...props}
            />
            <span className="switch-slider"></span>
            {label && <span className="switch-label">{label}</span>}
        </label>
    );
};

export default Switch;
