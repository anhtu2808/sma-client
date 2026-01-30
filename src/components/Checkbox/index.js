import React from 'react';
import './Checkbox.scss';

const Checkbox = ({ 
    id,
    label = '',
    checked = false,
    defaultChecked = false,
    onChange = () => {},
    disabled = false,
    className = '',
    ...props 
}) => {
    return (
        <div className={`checkbox-wrapper ${className}`}>
            <input
                id={id}
                type="checkbox"
                className="checkbox-input"
                checked={checked}
                defaultChecked={defaultChecked}
                onChange={onChange}
                disabled={disabled}
                {...props}
            />
            {label && (
                <label htmlFor={id} className="checkbox-label">
                    {label}
                </label>
            )}
        </div>
    );
};

export default Checkbox;
