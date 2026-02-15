import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'antd';
import './SimpleTextEditor.scss';

const DEFAULT_BULLETS = [
    { id: 'dot', label: 'Dot', marker: 'fiber_manual_record', type: 'material', color: '#ef4444', size: 14 },
    { id: 'hollow', label: 'Hollow', marker: 'radio_button_unchecked', type: 'material', color: '#ef4444', size: 14 },
    { id: 'check', label: 'Check', marker: 'check_circle', type: 'material', color: '#16a34a', size: 16 },
    { id: 'star', label: 'Star', marker: 'star', type: 'material', color: '#f59e0b', size: 16 },
    { id: 'check_circle_orange', label: 'Check Circle (Orange)', marker: 'check_circle', type: 'material', color: '#f97316', size: 16 },
    { id: 'check_orange', label: 'Check (Orange)', marker: 'check', type: 'material', color: '#f97316', size: 16 },
];

const getClosestList = (root, node) => {
    if (!root || !node) return null;
    let current = node.nodeType === 1 ? node : node.parentElement;
    while (current && current !== root) {
        if (current.nodeName === 'UL') return current;
        current = current.parentElement;
    }
    return null;
};

const isNestedList = (ul) => {
    if (!ul) return false;
    const parentList = ul.parentElement?.closest('ul');
    return Boolean(parentList);
};

const getListLevel = (root, ul) => {
    if (!root || !ul) return 1;
    let level = 1;
    let current = ul.parentElement?.closest('ul');
    while (current && root.contains(current)) {
        level += 1;
        current = current.parentElement?.closest('ul');
    }
    return level;
};

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
    showTextColor = true,
    bulletOptions,
    bulletLevelMap,
    defaultBulletId = 'dot',
    nestedBulletId = 'hollow',
    showInsertTemplate = false,
    templateHtml = '',
    onInsertTemplate,
    showInsertHtml = false,
    insertHtml = '',
    insertHtmlLabel = 'Insert HTML',
    onInsertHtml,
}) => {
    const editorRef = useRef(null);
    const hasInitialized = useRef(false);

    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
        list: false,
    });
    const [currentBulletId, setCurrentBulletId] = useState(defaultBulletId);
    const [count, setCount] = useState(0);
    const [currentColor, setCurrentColor] = useState(textColor);
    const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);
    const [htmlDraft, setHtmlDraft] = useState(insertHtml || '');

    const isControlled = value !== undefined;
    const resolvedBullets = useMemo(
        () => (bulletOptions && bulletOptions.length ? bulletOptions : DEFAULT_BULLETS),
        [bulletOptions]
    );
    const bulletMap = useMemo(
        () => new Map(resolvedBullets.map((bullet) => [bullet.id, bullet])),
        [resolvedBullets]
    );

    const applyBulletStyle = useCallback(
        (ul, bulletId) => {
            if (!ul) return;
            const bullet = bulletMap.get(bulletId);
            if (!bullet) return;

            ul.dataset.bulletId = bulletId;
            ul.style.setProperty('--ste-bullet-content', `"${bullet.marker}"`);
            ul.style.setProperty(
                '--ste-bullet-font',
                bullet.type === 'material' ? '"Material Icons Round"' : 'inherit'
            );
            ul.style.setProperty('--ste-bullet-color', bullet.color || '#ef4444');
            ul.style.setProperty('--ste-bullet-size', `${bullet.size || 14}px`);
        },
        [bulletMap]
    );

    const normalizeLists = useCallback(() => {
        const root = editorRef.current;
        if (!root) return;
        const lists = root.querySelectorAll('ul');
        lists.forEach((ul) => {
            const level = getListLevel(root, ul);
            let targetId = defaultBulletId;
            if (Array.isArray(bulletLevelMap) && bulletLevelMap.length) {
                targetId = bulletLevelMap[level - 1] || bulletLevelMap[bulletLevelMap.length - 1];
            } else {
                const nested = isNestedList(ul);
                targetId = nested ? nestedBulletId : defaultBulletId;
            }

            if (!ul.dataset.bulletId) {
                applyBulletStyle(ul, targetId);
                return;
            }

            if (Array.isArray(bulletLevelMap) && bulletLevelMap.length) {
                applyBulletStyle(ul, targetId);
            }
        });
    }, [applyBulletStyle, bulletLevelMap, defaultBulletId, nestedBulletId]);

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

        const currentList = getClosestList(root, anchorNode);
        if (currentList?.dataset?.bulletId) {
            setCurrentBulletId(currentList.dataset.bulletId);
        }
    }, []);

    const execCommand = useCallback(
        (command) => {
            if (disabled) return;
            editorRef.current?.focus();
            document.execCommand(command, false, null);
            normalizeLists();
            refreshSelectionState();
            updateCount();
            emitChange();
        },
        [disabled, emitChange, normalizeLists, refreshSelectionState, updateCount]
    );

    const handleColorChange = useCallback(
        (event) => {
            const nextColor = event.target.value;
            setCurrentColor(nextColor);
            if (disabled) return;
            editorRef.current?.focus();
            document.execCommand('foreColor', false, nextColor);
            refreshSelectionState();
            updateCount();
            emitChange();
        },
        [disabled, emitChange, refreshSelectionState, updateCount]
    );

    const handleBulletSelect = useCallback(
        (bulletId) => {
            if (disabled) return;
            setCurrentBulletId(bulletId);
            editorRef.current?.focus();
            if (!document.queryCommandState('insertUnorderedList')) {
                document.execCommand('insertUnorderedList', false, null);
            }
            const selection = document.getSelection();
            const currentList = getClosestList(editorRef.current, selection?.anchorNode || null);
            applyBulletStyle(currentList, bulletId);
            normalizeLists();
            refreshSelectionState();
            updateCount();
            emitChange();
        },
        [applyBulletStyle, disabled, emitChange, normalizeLists, refreshSelectionState, updateCount]
    );

    const handleInput = useCallback(() => {
        normalizeLists();
        updateCount();
        emitChange();
    }, [emitChange, normalizeLists, updateCount]);

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key !== 'Tab') return;
            const root = editorRef.current;
            if (!root) return;

            const selection = document.getSelection();
            const currentList = getClosestList(root, selection?.anchorNode || null);
            event.preventDefault();

            if (currentList) {
                document.execCommand(event.shiftKey ? 'outdent' : 'indent', false, null);
                normalizeLists();
                refreshSelectionState();
                updateCount();
                emitChange();
                return;
            }

            document.execCommand('insertText', false, '    ');
            updateCount();
            emitChange();
        },
        [emitChange, normalizeLists, refreshSelectionState, updateCount]
    );

    const handleInsertTemplate = useCallback(() => {
        if (disabled) return;
        if (onInsertTemplate) {
            onInsertTemplate();
            return;
        }
        const root = editorRef.current;
        if (!root) return;
        root.innerHTML = templateHtml || '';
        normalizeLists();
        updateCount();
        emitChange();
    }, [disabled, emitChange, normalizeLists, onInsertTemplate, templateHtml, updateCount]);

    const openHtmlModal = useCallback(() => {
        if (disabled) return;
        setHtmlDraft(insertHtml || '');
        setIsHtmlModalOpen(true);
    }, [disabled, insertHtml]);

    const closeHtmlModal = useCallback(() => {
        setIsHtmlModalOpen(false);
    }, []);

    const confirmHtmlInsert = useCallback(() => {
        if (disabled) return;
        if (!htmlDraft) {
            closeHtmlModal();
            return;
        }
        if (onInsertHtml) {
            onInsertHtml(htmlDraft);
            closeHtmlModal();
            return;
        }
        editorRef.current?.focus();
        const inserted = document.execCommand('insertHTML', false, htmlDraft);
        if (!inserted && editorRef.current) {
            editorRef.current.innerHTML += htmlDraft;
        }
        normalizeLists();
        updateCount();
        emitChange();
        closeHtmlModal();
    }, [closeHtmlModal, disabled, emitChange, htmlDraft, normalizeLists, onInsertHtml, updateCount]);

    useEffect(() => {
        if (hasInitialized.current) return;
        const root = editorRef.current;
        if (!root) return;
        const initial = isControlled ? value || '' : defaultValue || '';
        if (initial) {
            root.innerHTML = initial;
            normalizeLists();
        }
        updateCount();
        hasInitialized.current = true;
    }, [defaultValue, isControlled, normalizeLists, updateCount, value]);

    useEffect(() => {
        if (!isControlled) return;
        const root = editorRef.current;
        if (!root) return;
        if (value !== root.innerHTML) {
            root.innerHTML = value || '';
            normalizeLists();
            updateCount();
        }
    }, [isControlled, normalizeLists, updateCount, value]);

    useEffect(() => {
        normalizeLists();
    }, [normalizeLists]);

    useEffect(() => {
        const handleSelection = () => refreshSelectionState();
        document.addEventListener('selectionchange', handleSelection);
        return () => document.removeEventListener('selectionchange', handleSelection);
    }, [refreshSelectionState]);

    useEffect(() => {
        if (!bulletMap.has(currentBulletId)) {
            setCurrentBulletId(defaultBulletId);
        }
    }, [bulletMap, currentBulletId, defaultBulletId]);

    useEffect(() => {
        setCurrentColor(textColor);
    }, [textColor]);

    useEffect(() => {
        if (!isHtmlModalOpen) return;
        setHtmlDraft(insertHtml || '');
    }, [insertHtml, isHtmlModalOpen]);

    const isOverLimit = typeof maxLength === 'number' && count > maxLength;

    return (
        <div className={`simple-text-editor ${disabled ? 'is-disabled' : ''} ${className}`}>
            <div className="simple-text-editor__toolbar">
                <div className="simple-text-editor__toolbar-left">
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
                    <select
                        className="ste-bullet-select"
                        value={currentBulletId}
                        onChange={(event) => handleBulletSelect(event.target.value)}
                        disabled={disabled}
                        aria-label="Bullet style"
                    >
                        {resolvedBullets.map((bullet) => (
                            <option key={bullet.id} value={bullet.id}>
                                {bullet.label}
                            </option>
                        ))}
                    </select>
                    {showTextColor && (
                        <label className="ste-color-control" aria-label="Text color">
                            <span className="material-icons-round">format_color_text</span>
                            <input
                                type="color"
                                className="ste-color-input"
                                value={currentColor}
                                onChange={handleColorChange}
                                disabled={disabled}
                                aria-label="Choose text color"
                            />
                        </label>
                    )}
                </div>
                {(showInsertTemplate || showInsertHtml) && (
                    <div className="simple-text-editor__toolbar-actions">
                        {showInsertHtml && (
                            <button
                                type="button"
                                className="ste-insert-btn"
                                onClick={openHtmlModal}
                                disabled={disabled}
                            >
                                {insertHtmlLabel}
                            </button>
                        )}
                        {showInsertTemplate && (
                            <button
                                type="button"
                                className="ste-insert-btn"
                                onClick={handleInsertTemplate}
                                disabled={disabled}
                            >
                                Insert template
                            </button>
                        )}
                    </div>
                )}
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
                onKeyDown={handleKeyDown}
                suppressContentEditableWarning
            />
            {showCount && (
                <div className={`simple-text-editor__count ${isOverLimit ? 'is-over' : ''}`}>
                    {typeof maxLength === 'number' ? `${count}/${maxLength} characters` : `${count} characters`}
                </div>
            )}

            <Modal
                open={isHtmlModalOpen}
                onCancel={closeHtmlModal}
                footer={null}
                centered
                destroyOnClose
                width={720}
            >
                <div className="ste-html-modal">
                    <div className="ste-html-modal__header">
                        <h3 className="ste-html-modal__title">Insert HTML</h3>
                        <p className="ste-html-modal__subtitle">Paste HTML below and click Insert.</p>
                    </div>
                    <textarea
                        className="ste-html-textarea"
                        value={htmlDraft}
                        onChange={(event) => setHtmlDraft(event.target.value)}
                        placeholder="<p>Paste your HTML here...</p>"
                        rows={10}
                    />
                    <div className="ste-html-modal__footer">
                        <button
                            type="button"
                            className="ste-modal-btn ste-modal-btn--ghost"
                            onClick={closeHtmlModal}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="ste-modal-btn ste-modal-btn--primary"
                            onClick={confirmHtmlInsert}
                        >
                            Insert
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SimpleTextEditor;
