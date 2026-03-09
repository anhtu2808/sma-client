import React, { useContext } from 'react';
import { Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { CvBuilderContext } from '../CvBuilderContext';

export const SectionWrapper = ({ title, sectionKey, index, isFirst, isLast, onAdd, children, titleClassName }) => {
    const { moveSection } = useContext(CvBuilderContext);
    return (
        <div
            className="group/section relative border border-transparent hover:border-[#1F8A70]/30 hover:bg-[#F8F9FA]/50 rounded-xl transition-colors -mx-4 px-4 py-4 mb-2"
        >
            <h3 className={titleClassName || "text-xl font-semibold text-[#1F8A70] mb-4"}>{title}</h3>

            <div className="absolute left-6 top-1 flex gap-2 z-20 opacity-0 group-hover/section:opacity-100 pointer-events-none group-hover/section:pointer-events-auto transition-opacity duration-200">
                {onAdd && (
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm transition-colors cursor-pointer"
                    >
                        <Plus size={16} />
                        Add {title.toLowerCase()}
                    </button>
                )}
                {index !== undefined && (
                    <>
                        <button
                            onClick={() => moveSection(index, 'up')}
                            disabled={isFirst}
                            className={`flex items-center justify-center w-8 h-8 rounded-full shadow-sm transition-colors cursor-pointer ${isFirst ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                        >
                            <ArrowUp size={16} />
                        </button>
                        <button
                            onClick={() => moveSection(index, 'down')}
                            disabled={isLast}
                            className={`flex items-center justify-center w-8 h-8 rounded-full shadow-sm transition-colors cursor-pointer ${isLast ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                        >
                            <ArrowDown size={16} />
                        </button>
                    </>
                )}
            </div>
            <div className="relative">
                {children}
            </div>
        </div>
    );
};
