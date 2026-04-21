import React, { useRef, useEffect, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { Bold, Italic, Underline as UnderlineIcon } from 'lucide-react';

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

    const handleToolbarAction = (e, command) => {
        e.preventDefault();
        e.stopPropagation();
        document.execCommand(command, false, null);
        // Important: focus back to editor if lost, but onMouseDown usually prevents loss
        textRef.current?.focus();
    };

    const baseStyles = "outline-none transition-all duration-200 rounded-sm";
    
    // Standard style: transparent -> dashed hover -> solid focus
    const standardStyles = `
        border-[1.5px] 
        ${isFocused ? 'border-solid border-blue-500 ring-0' : 'border-transparent hover:border-dashed hover:border-gray-300'}
        px-2 py-1 -mx-2
    `;

    // Rich Text (Description) style: matches Image 1 (hover) and Image 2 (active)
    const richTextStyles = `
        border-[1.5px] -mx-2
        ${isFocused 
            ? 'border-solid border-blue-500 bg-white shadow-sm' 
            : 'border-transparent hover:border-dashed hover:border-gray-300'}
        flex flex-col rounded-sm transition-all duration-200
    `;

    if (multiline) {
        return (
            <div className={`${baseStyles} ${richTextStyles} ${className}`}>
                {isFocused && (
                    <div className="flex items-center gap-1 p-1.5 border-b border-blue-100 bg-blue-50/30 print:hidden animate-in fade-in slide-in-from-top-1 duration-200">
                        <button
                            onMouseDown={(e) => handleToolbarAction(e, 'bold')}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded text-gray-700 transition-colors cursor-pointer shadow-sm hover:shadow"
                            title="Bold"
                        >
                            <Bold size={14} strokeWidth={3} />
                        </button>
                        <button
                            onMouseDown={(e) => handleToolbarAction(e, 'italic')}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded text-gray-700 transition-colors cursor-pointer shadow-sm hover:shadow"
                            title="Italic"
                        >
                            <Italic size={14} strokeWidth={3} />
                        </button>
                        <button
                            onMouseDown={(e) => handleToolbarAction(e, 'underline')}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded text-gray-700 transition-colors cursor-pointer shadow-sm hover:shadow"
                            title="Underline"
                        >
                            <UnderlineIcon size={14} strokeWidth={3} />
                        </button>
                    </div>
                )}
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
