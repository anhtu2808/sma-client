import React, { useContext } from 'react';
import * as LucideIcons from 'lucide-react';
import { CvBuilderContext } from '../CvBuilderContext';
import { SectionWrapper } from './SectionWrapper';

export const SkillSelector = ({ titleClassName, itemClassName, groupClassName, groupListClassName }) => {
    const { cvData, activeSection, setActiveSection, updateField } = useContext(CvBuilderContext);

    // Group skills for display
    const groupedSkills = cvData.skills.reduce((acc, skill) => {
        const group = skill.groupName || "Skills";
        if (!acc[group]) acc[group] = [];
        acc[group].push(skill);
        return acc;
    }, {});

    const isActive = activeSection?.section === 'skills';

    const handleRemoveSkill = (skillId) => {
        const updatedSkills = cvData.skills.filter(s => s.skillId !== skillId);
        updateField('skills', updatedSkills);
    };

    return (
        <SectionWrapper title="Skills" sectionKey="skills" titleClassName={titleClassName}>
            <div
                onClick={(e) => { e.stopPropagation(); setActiveSection({ section: 'skills', index: 0 }); }}
                className={`flex flex-col gap-4 rounded-lg border transition-all -mx-4 px-4 py-2 cursor-pointer min-h-[50px] ${isActive ? 'border-primary-500 shadow-sm bg-primary-50/10' : 'border-transparent hover:border-gray-200 hover:shadow-sm'}`}
            >
                {/* Selected Skills List (Grouped) */}
                <div className={groupListClassName || 'flex flex-col gap-6'}>
                    {Object.entries(groupedSkills).length === 0 && (
                        <div className="text-gray-400 text-sm italic">Click to add skills from Sidebar</div>
                    )}
                    {Object.entries(groupedSkills).map(([group, skills]) => (
                        <div key={group} className="flex flex-col gap-2 break-inside-avoid-column">
                            <h4 className={`font-semibold text-[15px] border-b pb-1.5 mb-1 ${groupClassName || 'text-gray-800 border-gray-200'}`}>{group}</h4>
                            <div className="flex flex-wrap gap-2.5">
                                {skills.map((skill) => (
                                    <div key={skill.skillId} className={`inline-flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-medium group/skill transition-colors ${itemClassName || 'bg-transparent text-gray-800 border border-gray-200'}`}>
                                        <span>{skill.skillName}</span>
                                        {skill.yearsOfExperience > 0 && (
                                            <span className="opacity-70 text-[11px] tracking-wide">({skill.yearsOfExperience} years)</span>
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
            </div>
        </SectionWrapper>
    );
};
