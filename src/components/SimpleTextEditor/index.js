import React, { useCallback, useEffect, useRef, useState } from 'react';
import './SimpleTextEditor.scss';

const SimpleTextEditor = ({
    value,
    defaultValue,
    onChange,
    placeholder = 'Write something...',
    disabled = false,
    className = '',
    showCount = false,
    maxLength,
    textColor = '#111827',
    fontWeight = 400,
    fontSize = 16,
    lineHeight = 1.6,
}) => {
    const editorRef = useRef(null);
    const hasInitialized = useRef(false);

    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
        list: false,
    });
    const [count, setCount] = useState(0);

    const isControlled = value !== undefined;

    const updateCount = useCallback(() => {
        const root = editorRef.current;
        if (!root) return;
        const text = root.innerText || '';
        setCount(text.length);
    }, []);

    const emitChange = useCallback(() => {
        const root = editorRef.current;
        if (!root) return;
        const html = root.innerHTML;
        const text = root.innerText || '';
        onChange?.(html, text);
    }, [onChange]);

    const refreshSelectionState = useCallback(() => {
        const root = editorRef.current;
        if (!root) return;
        const selection = document.getSelection();
        const anchorNode = selection?.anchorNode || null;
        if (!anchorNode || !root.contains(anchorNode)) return;

        setActiveFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            list: document.queryCommandState('insertUnorderedList'),
        });
    }, []);

    const execCommand = useCallback(
        (command) => {
            if (disabled) return;
            editorRef.current?.focus();
            document.execCommand(command, false, null);
            refreshSelectionState();
            updateCount();
            emitChange();
        },
        [disabled, emitChange, refreshSelectionState, updateCount]
    );

    const handleInput = useCallback(() => {
        updateCount();
        emitChange();
    }, [emitChange, updateCount]);

    useEffect(() => {
        if (hasInitialized.current) return;
        const root = editorRef.current;
        if (!root) return;
        const initial = isControlled ? value || '' : defaultValue || '';
        if (initial) {
            root.innerHTML = initial;
        }
        updateCount();
        hasInitialized.current = true;
    }, [defaultValue, isControlled, updateCount, value]);

    useEffect(() => {
        if (!isControlled) return;
        const root = editorRef.current;
        if (!root) return;
        if (value !== root.innerHTML) {
            root.innerHTML = value || '';
            updateCount();
        }
    }, [isControlled, updateCount, value]);

    useEffect(() => {
        const handleSelection = () => refreshSelectionState();
        document.addEventListener('selectionchange', handleSelection);
        return () => document.removeEventListener('selectionchange', handleSelection);
    }, [refreshSelectionState]);

    const isOverLimit = typeof maxLength === 'number' && count > maxLength;

    return (
        <div className={`simple-text-editor ${disabled ? 'is-disabled' : ''} ${className}`}>
            <div className="simple-text-editor__toolbar">
                <button
                    type="button"
                    className={`ste-btn ${activeFormats.bold ? 'is-active' : ''}`}
                    onClick={() => execCommand('bold')}
                    aria-label="Bold"
                    aria-pressed={activeFormats.bold}
                    disabled={disabled}
                >
                    <span className="ste-btn__label">B</span>
                </button>
                <button
                    type="button"
                    className={`ste-btn ${activeFormats.italic ? 'is-active' : ''}`}
                    onClick={() => execCommand('italic')}
                    aria-label="Italic"
                    aria-pressed={activeFormats.italic}
                    disabled={disabled}
                >
                    <span className="ste-btn__label ste-italic">I</span>
                </button>
                <button
                    type="button"
                    className={`ste-btn ${activeFormats.underline ? 'is-active' : ''}`}
                    onClick={() => execCommand('underline')}
                    aria-label="Underline"
                    aria-pressed={activeFormats.underline}
                    disabled={disabled}
                >
                    <span className="ste-btn__label ste-underline">U</span>
                </button>
                <button
                    type="button"
                    className={`ste-btn ${activeFormats.list ? 'is-active' : ''}`}
                    onClick={() => execCommand('insertUnorderedList')}
                    aria-label="Bulleted list"
                    aria-pressed={activeFormats.list}
                    disabled={disabled}
                >
                    <span className="material-icons-round">format_list_bulleted</span>
                </button>
            </div>
            <div
                ref={editorRef}
                className="simple-text-editor__content"
                contentEditable={!disabled}
                role="textbox"
                aria-multiline="true"
                data-placeholder={placeholder}
                style={{
                    '--ste-text-color': textColor,
                    '--ste-text-weight': fontWeight,
                    '--ste-text-size': typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
                    '--ste-line-height': lineHeight,
                }}
                onInput={handleInput}
                suppressContentEditableWarning
            />
            {showCount && (
                <div className={`simple-text-editor__count ${isOverLimit ? 'is-over' : ''}`}>
                    {typeof maxLength === 'number' ? `${count}/${maxLength} characters` : `${count} characters`}
                </div>
            )}
        </div>
    );
};

export default SimpleTextEditor;
