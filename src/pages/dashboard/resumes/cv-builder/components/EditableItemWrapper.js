import React, { useContext } from 'react';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { CvBuilderContext } from '../CvBuilderContext';

export const EditableItemWrapper = ({ children, section, index, id, isFirst, isLast }) => {
    const { activeSection, setActiveSection, moveItem, deleteItem } = useContext(CvBuilderContext);
    const isActive = activeSection?.section === section && activeSection?.index === index;
    return (
        <div
            onClick={(e) => { e.stopPropagation(); setActiveSection({ section, index }); }}
            className={`group/item relative rounded-lg border transition-all -mx-4 px-4 py-2 mb-2 cursor-pointer ${isActive ? 'border-primary-500 shadow-sm bg-primary-50/10' : 'border-transparent hover:border-gray-200 hover:shadow-sm'}`}
        >
            {children}

            {/* Action Toolbar */}
            <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 flex flex-col gap-1 bg-white shadow-md border border-gray-100 rounded-md p-1 z-20 opacity-0 group-hover/item:opacity-100 pointer-events-none group-hover/item:pointer-events-auto transition-opacity duration-200">
                <button
                    onClick={() => moveItem(section, index, 'up')}
                    disabled={isFirst}
                    className={`p-1.5 rounded ${isFirst ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <ArrowUp size={16} />
                </button>
                <button
                    onClick={() => moveItem(section, index, 'down')}
                    disabled={isLast}
                    className={`p-1.5 rounded ${isLast ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <ArrowDown size={16} />
                </button>
                <button
                    onClick={() => deleteItem(section, id)}
                    className="p-1.5 rounded text-red-500 hover:bg-red-50"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};
