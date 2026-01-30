import React from 'react';
import { Input as AntInput } from 'antd';
import './Input.scss';

const Input = ({ 
    error = false, 
    helperText = '', 
    label = '',
    prefix = null,
    suffix = null,
    className = '',
    ...props 
}) => {
    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label className={`input-label ${error ? 'input-label-error' : ''}`}>
                    {label}
                </label>
            )}
            <AntInput
                className={`custom-input ${error ? 'custom-input-error' : ''}`}
                prefix={prefix}
                suffix={suffix}
                status={error ? 'error' : ''}
                {...props}
            />
            {helperText && (
                <p className={`input-helper ${error ? 'input-helper-error' : ''}`}>
                    {helperText}
                </p>
            )}
        </div>
    );
};

Input.Password = ({ 
    error = false, 
    helperText = '', 
    label = '',
    className = '',
    ...props 
}) => {
    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label className={`input-label ${error ? 'input-label-error' : ''}`}>
                    {label}
                </label>
            )}
            <AntInput.Password
                className={`custom-input ${error ? 'custom-input-error' : ''}`}
                status={error ? 'error' : ''}
                {...props}
            />
            {helperText && (
                <p className={`input-helper ${error ? 'input-helper-error' : ''}`}>
                    {helperText}
                </p>
            )}
        </div>
    );
};

Input.TextArea = ({ 
    error = false, 
    helperText = '', 
    label = '',
    className = '',
    ...props 
}) => {
    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label className={`input-label ${error ? 'input-label-error' : ''}`}>
                    {label}
                </label>
            )}
            <AntInput.TextArea
                className={`custom-input ${error ? 'custom-input-error' : ''}`}
                status={error ? 'error' : ''}
                {...props}
            />
            {helperText && (
                <p className={`input-helper ${error ? 'input-helper-error' : ''}`}>
                    {helperText}
                </p>
            )}
        </div>
    );
};

Input.Search = ({ 
    error = false, 
    helperText = '', 
    label = '',
    className = '',
    ...props 
}) => {
    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label className={`input-label ${error ? 'input-label-error' : ''}`}>
                    {label}
                </label>
            )}
            <AntInput.Search
                className={`custom-input custom-input-search ${error ? 'custom-input-error' : ''}`}
                status={error ? 'error' : ''}
                {...props}
            />
            {helperText && (
                <p className={`input-helper ${error ? 'input-helper-error' : ''}`}>
                    {helperText}
                </p>
            )}
        </div>
    );
};

export default Input;
