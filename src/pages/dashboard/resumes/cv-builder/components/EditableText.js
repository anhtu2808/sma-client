import React, { useRef, useEffect, useState } from 'react';
import ContentEditable from 'react-contenteditable';

export const EditableText = React.memo(({ value, onChange, className, as = "span", multiline = false }) => {
    const textRef = useRef(null);
    const [html, setHtml] = useState(value !== undefined && value !== null ? String(value) : '');
    const [isFocused, setIsFocused] = useState(false);

    // Sync external changes
    useEffect(() => {
        const strValue = value !== undefined && value !== null ? String(value) : '';
        if (strValue !== html && strValue !== textRef.current?.innerHTML) {
            setHtml(strValue);
        }
    }, [value, html]);

    const handleChange = (e) => {
        setHtml(e.target.value);
        onChange(e.target.value);
    };

    const baseStyles = "outline-none transition-all duration-200 rounded-sm";
    
    // Standard style: transparent -> dashed hover -> solid focus
    const standardStyles = `
        border-[1.5px] 
        ${isFocused ? 'border-solid border-blue-500 ring-0' : 'border-transparent hover:border-dashed hover:border-gray-300'}
        px-2 py-1 -mx-2
    `;

    // Multiline style: matches Image 1 (hover) and Image 2 (active)
    const multilineStyles = `
        border-[1.5px] -mx-2
        ${isFocused 
            ? 'border-solid border-blue-500 bg-white shadow-sm' 
            : 'border-transparent hover:border-dashed hover:border-gray-300'}
        flex flex-col rounded-sm transition-all duration-200
    `;

    if (multiline) {
        return (
            <div className={`${baseStyles} ${multilineStyles} ${className}`}>
                <ContentEditable
                    innerRef={textRef}
                    html={html}
                    disabled={false}
                    onChange={handleChange}
                    tagName={as}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`px-2 py-1 outline-none min-h-[1.5em] text-gray-800 font-[inherit] text-[inherit] leading-[inherit] ${!isFocused && 'hover:cursor-text'}`}
                />
            </div>
        );
    }

    return (
        <ContentEditable
            innerRef={textRef}
            html={html}
            disabled={false}
            onChange={handleChange}
            tagName={as}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`${baseStyles} ${standardStyles} font-[inherit] text-[inherit] leading-[inherit] ${className}`}
        />
    );
});

