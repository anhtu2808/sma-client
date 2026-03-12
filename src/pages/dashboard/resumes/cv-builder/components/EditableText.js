import React, { useRef, useEffect, useState } from 'react';
import ContentEditable from 'react-contenteditable';

export const EditableText = React.memo(({ value, onChange, className, as = "span", multiline = false }) => {
    const textRef = useRef(null);
    const [html, setHtml] = useState(value || '');

    // Sync external changes
    useEffect(() => {
        if (value !== html && value !== textRef.current?.innerHTML) {
            setHtml(value || '');
        }
    }, [value]);

    const handleChange = (e) => {
        setHtml(e.target.value);
        onChange(e.target.value);
    };

    return (
        <ContentEditable
            innerRef={textRef}
            html={html}
            disabled={false}
            onChange={handleChange}
            tagName={as}
            className={`outline-none border border-transparent hover:border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded px-[5px] -ml-[5px] transition-all ${className}`}
        />
    );
});
