import React, { useContext, useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { CvBuilderContext } from '../CvBuilderContext';
import { SectionWrapper } from './SectionWrapper';
import { useGetSkillsQuery } from '@/apis/skillApi';
import toastMessage from '@/utils/toastMessage';

export const SkillSelector = ({ titleClassName, itemClassName, groupClassName, groupListClassName }) => {
    const { cvData, updateField } = useContext(CvBuilderContext);

    // Inline add-skill state
    const [isAdding, setIsAdding] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [groupName, setGroupName] = useState('');
    const [selectedSkillId, setSelectedSkillId] = useState(null);
    const [selectedSkillName, setSelectedSkillName] = useState('');
    const [yearsOfExp, setYearsOfExp] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const searchInputRef = useRef(null);
    const dropdownRef = useRef(null);
    const addFormRef = useRef(null);

    const { data: skillOptions = [], isFetching } = useGetSkillsQuery(
        { name: searchText, size: 15 },
        { skip: !isAdding || searchText.length < 1 }
    );

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDropdown]);

    // Group skills for display
    const groupedSkills = cvData.skills.reduce((acc, skill) => {
        const group = skill.groupName || 'Skills';
        if (!acc[group]) acc[group] = [];
        acc[group].push(skill);
        return acc;
    }, {});

    const handleRemoveSkill = (skillId) => {
        const updatedSkills = cvData.skills.filter(s => s.skillId !== skillId);
        updateField('skills', updatedSkills);
    };

    const handleSelectSkill = (skill) => {
        if (cvData.skills.some(s => s.skillId === skill.id)) {
            toastMessage.warning('This skill has already been added.');
            setShowDropdown(false);
            setSearchText('');
            return;
        }
        setSelectedSkillId(skill.id);
        setSelectedSkillName(skill.name);
        setSearchText(skill.name);
        setShowDropdown(false);
    };

    const handleAddSkill = () => {
        if (!groupName.trim()) {
            toastMessage.error('Please enter a skill group name.');
            return;
        }
        if (!selectedSkillId) {
            toastMessage.error('Please search and select a skill first.');
            return;
        }

        const newSkill = {
            id: `skill_${Date.now()}_${Math.random()}`,
            skillId: selectedSkillId,
            skillName: selectedSkillName,
            groupName: groupName.trim(),
            yearsOfExperience: yearsOfExp !== '' ? Number(yearsOfExp) : null,
        };

        updateField('skills', [...cvData.skills, newSkill]);
        // Reset form for next add
        setSearchText('');
        setSelectedSkillId(null);
        setSelectedSkillName('');
        setYearsOfExp('');
        // Keep groupName for consecutive adds to same group
    };

    const handleCancel = () => {
        setIsAdding(false);
        setSearchText('');
        setGroupName('');
        setSelectedSkillId(null);
        setSelectedSkillName('');
        setYearsOfExp('');
        setShowDropdown(false);
    };

    return (
        <SectionWrapper title="Skills" sectionKey="skills" titleClassName={titleClassName}>
            <div className="flex flex-col gap-4">
                {/* Grouped Skills Display */}
                <div className={groupListClassName || 'flex flex-col gap-6'}>
                    {Object.entries(groupedSkills).length === 0 && !isAdding && (
                        <div className="text-gray-400 text-sm italic print:hidden">No skills added yet</div>
                    )}
                    {Object.entries(groupedSkills).map(([group, skills]) => (
                        <div key={group} className="flex flex-col gap-2 break-inside-avoid-column">
                            <h4 className={`font-semibold text-[15px] border-b pb-1.5 mb-1 ${groupClassName || 'text-gray-800 border-gray-200'}`}>{group}</h4>
                            <div className="flex flex-wrap gap-2.5">
                                {skills.map((skill) => (
                                    <div key={skill.skillId} className={`inline-flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-sm text-[13px] font-medium group/skill transition-colors ${itemClassName || 'bg-transparent text-gray-800 border border-gray-200 print:border-none print:px-0'}`}>
                                        <span>{skill.skillName}</span>
                                        {skill.yearsOfExperience > 0 && (
                                            <span className="opacity-70 text-[11px] tracking-wide">({skill.yearsOfExperience}y)</span>
                                        )}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRemoveSkill(skill.skillId); }}
                                            className="opacity-50 hover:opacity-100 hover:text-red-500 transition-opacity print:hidden cursor-pointer flex items-center justify-center p-0.5"
                                        >
                                            <LucideIcons.X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Inline Add Skill Form */}
                {isAdding ? (
                    <div ref={addFormRef} className="print:hidden flex flex-col gap-2.5 p-3 rounded border border-blue-200 bg-blue-50/50" onClick={e => e.stopPropagation()}>
                        {/* Group Name */}
                        <input
                            type="text"
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                            placeholder="Skill Group (e.g. Frontend)"
                            className="w-full text-sm px-2.5 py-1.5 border border-gray-200 rounded-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white"
                        />

                        {/* Skill Search */}
                        <div className="relative" ref={dropdownRef}>
                            <div className="relative">
                                <LucideIcons.Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchText}
                                    onChange={e => {
                                        setSearchText(e.target.value);
                                        setSelectedSkillId(null);
                                        setSelectedSkillName('');
                                        setShowDropdown(true);
                                    }}
                                    onFocus={() => { if (searchText.length >= 1) setShowDropdown(true); }}
                                    placeholder="Search skill..."
                                    className="w-full text-sm pl-8 pr-2.5 py-1.5 border border-gray-200 rounded-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white"
                                />
                                {selectedSkillId && (
                                    <LucideIcons.Check size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-500" />
                                )}
                            </div>

                            {/* Search Dropdown */}
                            {showDropdown && searchText.length >= 1 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-[160px] overflow-y-auto py-1">
                                    {isFetching ? (
                                        <div className="px-3 py-2 text-xs text-gray-400 text-center">Searching...</div>
                                    ) : skillOptions.length === 0 ? (
                                        <div className="px-3 py-2 text-xs text-gray-400 text-center">No skills found</div>
                                    ) : (
                                        skillOptions.map(skill => (
                                            <button
                                                key={skill.id}
                                                type="button"
                                                onClick={() => handleSelectSkill(skill)}
                                                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer ${
                                                    cvData.skills.some(s => s.skillId === skill.id)
                                                        ? 'text-gray-300 cursor-not-allowed'
                                                        : 'text-gray-700'
                                                }`}
                                                disabled={cvData.skills.some(s => s.skillId === skill.id)}
                                            >
                                                {skill.name}
                                                {cvData.skills.some(s => s.skillId === skill.id) && (
                                                    <span className="ml-1.5 text-[10px] text-gray-400">(added)</span>
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Years of Experience */}
                        <select
                            value={yearsOfExp}
                            onChange={e => setYearsOfExp(e.target.value)}
                            className="w-full text-sm px-2.5 py-1.5 border border-gray-200 rounded-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white text-gray-700"
                        >
                            <option value="">Years of exp (optional)</option>
                            {Array.from({ length: 21 }, (_, i) => (
                                <option key={i} value={i}>{i} year{i !== 1 ? 's' : ''}</option>
                            ))}
                        </select>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                disabled={!selectedSkillId || !groupName.trim()}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <LucideIcons.Plus size={14} /> Add
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-3 py-1.5 rounded-sm text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Add Skill Button */
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsAdding(true); }}
                        className="print:hidden flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-500 transition-colors cursor-pointer py-1 group"
                    >
                        <LucideIcons.PlusCircle size={16} className="group-hover:text-blue-500" />
                        <span>Add Skill</span>
                    </button>
                )}
            </div>
        </SectionWrapper>
    );
};
