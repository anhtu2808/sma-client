import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const ExecutiveProfessionalTemplate = ({
    cvData,
    sectionOrder,
    updateField,
    addItem,
    EditableText,
    SectionWrapper,
    EditableItemWrapper
}) => {
    return (
        <div className="w-[850px] mx-auto mt-8 bg-white shadow-xl min-h-[1100px] relative font-serif text-gray-800">
            {/* Header: Centered, Classic */}
            <div className="px-14 pt-16 pb-8 text-center">
                <EditableText
                    as="h1"
                    className="text-4xl font-bold text-gray-900 uppercase tracking-widest mb-3"
                    value={cvData.personalInfo.fullName}
                    onChange={(val) => updateField('personalInfo.fullName', val)}
                />
                <EditableText
                    className="text-lg text-gray-600 tracking-wider uppercase mb-6"
                    value={cvData.personalInfo.title}
                    onChange={(val) => updateField('personalInfo.title', val)}
                />

                <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <EditableText value={cvData.contact.email} onChange={v => updateField('contact.email', v)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <EditableText value={cvData.contact.phone} onChange={v => updateField('contact.phone', v)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <EditableText value={cvData.contact.address} onChange={v => updateField('contact.address', v)} />
                    </div>
                </div>
            </div>

            <div className="px-14 border-b border-gray-300 mx-14 mb-8"></div>

            {/* Body: Single Column Stacked */}
            <div className="px-14 pb-16 flex flex-col gap-8">

                {/* Objective */}
                <SectionWrapper title="TÓM TẮT NĂNG LỰC" sectionKey="objective" titleClassName="text-xl font-bold uppercase border-b-2 border-gray-800 pb-2 mb-4 text-gray-900">
                    <EditableText
                        as="p"
                        className="text-gray-700 leading-relaxed text-justify"
                        value={cvData.objective}
                        onChange={(val) => updateField('objective', val)}
                        multiline
                    />
                </SectionWrapper>

                {/* Main Sections from standard order */}
                {sectionOrder.map((sectionKey, index) => {
                    const isFirst = index === 0;
                    const isLast = index === sectionOrder.length - 1;

                    switch (sectionKey) {
                        case 'experience':
                            return (
                                <SectionWrapper
                                    key={sectionKey}
                                    title="KINH NGHIỆM LÀM VIỆC"
                                    sectionKey="experience"
                                    index={index}
                                    isFirst={isFirst}
                                    isLast={isLast}
                                    onAdd={() => addItem('experience', {
                                        role: "Vị trí", company: "Tên công ty", dateRange: "MM/YYYY - MM/YYYY", duration: "(... năm)", description: "Mô tả công việc"
                                    })}
                                >
                                    <div className="flex flex-col gap-6">
                                        {cvData.experience.map((exp, itemIndex) => (
                                            <EditableItemWrapper key={exp.id} id={exp.id} section="experience" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.experience.length - 1}>
                                                <div className="grid grid-cols-[1fr_200px] mb-2">
                                                    <div>
                                                        <EditableText as="h4" className="font-bold text-gray-900 text-lg" value={exp.role} onChange={v => {
                                                            const dt = [...cvData.experience]; dt[itemIndex].role = v; updateField('experience', dt);
                                                        }} />
                                                        <EditableText as="p" className="text-gray-700 font-medium italic" value={exp.company} onChange={v => {
                                                            const dt = [...cvData.experience]; dt[itemIndex].company = v; updateField('experience', dt);
                                                        }} />
                                                    </div>
                                                    <div className="text-right flex flex-col items-end text-sm text-gray-600 font-medium">
                                                        <EditableText value={exp.dateRange} onChange={v => {
                                                            const dt = [...cvData.experience]; dt[itemIndex].dateRange = v; updateField('experience', dt);
                                                        }} />
                                                        <EditableText className="text-xs text-gray-500" value={exp.duration} onChange={v => {
                                                            const dt = [...cvData.experience]; dt[itemIndex].duration = v; updateField('experience', dt);
                                                        }} />
                                                    </div>
                                                </div>
                                                <EditableText as="p" className="text-gray-700 leading-relaxed text-justify" value={exp.description} onChange={v => {
                                                    const dt = [...cvData.experience]; dt[itemIndex].description = v; updateField('experience', dt);
                                                }} />
                                            </EditableItemWrapper>
                                        ))}
                                    </div>
                                </SectionWrapper>
                            );
                        case 'education':
                            return (
                                <SectionWrapper
                                    key={sectionKey}
                                    title="HỌC VẤN"
                                    sectionKey="education"
                                    index={index}
                                    isFirst={isFirst}
                                    isLast={isLast}
                                    onAdd={() => addItem('education', {
                                        degree: "Bằng cấp", school: "Trường", dateRange: "MM/YYYY - MM/YYYY", duration: "(... năm)"
                                    })}
                                >
                                    <div className="flex flex-col gap-6">
                                        {cvData.education.map((edu, itemIndex) => (
                                            <EditableItemWrapper key={edu.id} id={edu.id} section="education" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.education.length - 1}>
                                                <div className="grid grid-cols-[1fr_200px] mb-2">
                                                    <div>
                                                        <EditableText as="h4" className="font-bold text-gray-900 text-lg" value={edu.degree} onChange={v => {
                                                            const dt = [...cvData.education]; dt[itemIndex].degree = v; updateField('education', dt);
                                                        }} />
                                                        <EditableText as="p" className="text-gray-700 font-medium" value={edu.school} onChange={v => {
                                                            const dt = [...cvData.education]; dt[itemIndex].school = v; updateField('education', dt);
                                                        }} />
                                                    </div>
                                                    <div className="text-right flex flex-col items-end text-sm text-gray-600 font-medium">
                                                        <EditableText value={edu.dateRange} onChange={v => {
                                                            const dt = [...cvData.education]; dt[itemIndex].dateRange = v; updateField('education', dt);
                                                        }} />
                                                    </div>
                                                </div>
                                                {edu.description && (
                                                    <EditableText as="p" className="text-gray-700 leading-relaxed" value={edu.description} onChange={v => {
                                                        const dt = [...cvData.education]; dt[itemIndex].description = v; updateField('education', dt);
                                                    }} />
                                                )}
                                            </EditableItemWrapper>
                                        ))}
                                    </div>
                                </SectionWrapper>
                            );
                        // Implement other standard cases here if needed, or rely on the smaller sections below
                        default: return null;
                    }
                })}

                {/* 2-Column Grid for smaller sections */}
                <div className="grid grid-cols-2 gap-8 mt-4">

                    {/* Skills */}
                    <SectionWrapper title="KỸ NĂNG" sectionKey="skills" onAdd={() => updateField('skills', ['Kỹ năng mới', ...cvData.skills])}>
                        <ul className="list-disc pl-5 text-gray-700 flex flex-col gap-2">
                            {cvData.skills.map((skill, index) => (
                                <li key={index} className="group/skill relative">
                                    <EditableText value={skill} onChange={v => {
                                        const newSkills = [...cvData.skills]; newSkills[index] = v; updateField('skills', newSkills);
                                    }} />
                                    <button
                                        onClick={() => updateField('skills', cvData.skills.filter((_, i) => i !== index))}
                                        className="absolute -left-6 top-1 text-red-400 opacity-0 group-hover/skill:opacity-100 hover:bg-red-50 rounded p-0.5"
                                    >
                                        <LucideIcons.X size={12} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </SectionWrapper>

                    {/* Languages */}
                    <SectionWrapper title="NGOẠI NGỮ" sectionKey="languages" onAdd={() => addItem('languages', { name: "Ngôn ngữ", level: "Trình độ" })}>
                        <div className="flex flex-col gap-3">
                            {cvData.languages.map((lang, index) => (
                                <EditableItemWrapper key={lang.id} id={lang.id} section="languages" index={index} isFirst={index === 0} isLast={index === cvData.languages.length - 1}>
                                    <div className="flex justify-between items-center text-gray-700">
                                        <EditableText className="font-medium" value={lang.name} onChange={v => {
                                            const newLang = [...cvData.languages]; newLang[index].name = v; updateField('languages', newLang);
                                        }} />
                                        <EditableText className="italic text-gray-500" value={lang.level} onChange={v => {
                                            const newLang = [...cvData.languages]; newLang[index].level = v; updateField('languages', newLang);
                                        }} />
                                    </div>
                                </EditableItemWrapper>
                            ))}
                        </div>
                    </SectionWrapper>

                </div>

            </div>
        </div>
    );
};

export default ExecutiveProfessionalTemplate;
