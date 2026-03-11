import React, { useRef, useEffect } from 'react';

export const EditableText = React.memo(({ value, onChange, className, as = "span", multiline = false }) => {
    const textRef = useRef(null);
    const initialValue = useRef(value);

    // Sync external changes
    useEffect(() => {
        if (textRef.current && textRef.current.innerText !== value && textRef.current.innerHTML !== value) {
            textRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleBlur = (e) => {
        if (e.target.innerText !== value) {
            onChange(e.target.innerText);
        }
    };

    const Tag = as;
    return (
        <Tag
            ref={textRef}
            className={`outline-none border border-transparent hover:border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded px-[5px] -ml-[5px] transition-all ${className}`}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur}
            dangerouslySetInnerHTML={{ __html: initialValue.current }}
        />
    );
});
