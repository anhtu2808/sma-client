import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const TechInnovatorTemplate = ({
    cvData,
    sectionOrder,
    updateField,
    addItem,
    EditableText,
    SectionWrapper,
    EditableItemWrapper
}) => {
    return (
        <div className="w-[850px] mx-auto mt-8 bg-white shadow-xl min-h-[1100px] relative font-sans">

            {/* Header Block - Distinctive Dark Teal */}
            <div className="bg-teal-800 text-white px-12 py-10 flex justify-between items-center">
                <div className="flex-1">
                    <EditableText
                        as="h1"
                        className="text-4xl font-extrabold tracking-tight mb-2 text-teal-50 uppercase"
                        value={cvData.personalInfo.fullName}
                        onChange={(val) => updateField('personalInfo.fullName', val)}
                    />
                    <EditableText
                        className="text-xl text-teal-200 font-medium tracking-wide"
                        value={cvData.personalInfo.title}
                        onChange={(val) => updateField('personalInfo.title', val)}
                    />
                </div>

                {/* Avatar Box inside Header */}
                <div className="ml-8 relative group w-28 h-28 shrink-0">
                    <img src={cvData.personalInfo.avatar} alt="Avatar" className="w-full h-full rounded border-2 border-teal-400 object-cover shadow-lg" />
                    <button className="absolute inset-0 m-auto w-10 h-10 bg-black/50 rounded shadow-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <LucideIcons.Camera size={18} />
                    </button>
                </div>
            </div>

            {/* Contact Bar - Subheader */}
            <div className="bg-teal-900 text-teal-100 px-12 py-3 flex gap-8 text-sm font-medium justify-center shadow-inner">
                <div className="flex items-center gap-2">
                    <Mail size={16} className="text-teal-400" />
                    <EditableText value={cvData.contact.email} onChange={v => updateField('contact.email', v)} />
                </div>
                <div className="flex items-center gap-2">
                    <Phone size={16} className="text-teal-400" />
                    <EditableText value={cvData.contact.phone} onChange={v => updateField('contact.phone', v)} />
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-teal-400" />
                    <EditableText value={cvData.contact.address} onChange={v => updateField('contact.address', v)} />
                </div>
            </div>

            {/* Main Content Split */}
            <div className="flex px-12 py-10 gap-10">
                {/* Left Column (30%) */}
                <div className="w-[30%] flex flex-col gap-8 border-r border-gray-200 pr-8">

                    <SectionWrapper title="MỤC TIÊU" sectionKey="objective" titleClassName="text-lg font-bold text-teal-800 mb-4 uppercase tracking-wider">
                        <EditableText as="p" className="text-sm text-gray-600 leading-relaxed text-justify" value={cvData.objective} onChange={(val) => updateField('objective', val)} multiline />
                    </SectionWrapper>

                    <SectionWrapper title="KỸ NĂNG" sectionKey="skills" titleClassName="text-lg font-bold text-teal-800 mb-4 uppercase tracking-wider" onAdd={() => updateField('skills', ['Kỹ năng', ...cvData.skills])}>
                        <div className="flex flex-col gap-2">
                            {cvData.skills.map((skill, index) => (
                                <div key={index} className="group/skill relative bg-gray-50 px-3 py-1.5 rounded text-sm text-gray-700 font-medium border border-gray-100">
                                    <EditableText value={skill} onChange={v => {
                                        const newSkills = [...cvData.skills]; newSkills[index] = v; updateField('skills', newSkills);
                                    }} />
                                    <button
                                        onClick={() => updateField('skills', cvData.skills.filter((_, i) => i !== index))}
                                        className="absolute right-2 top-1.5 text-red-500 opacity-0 group-hover/skill:opacity-100 hover:bg-red-50 rounded p-0.5"
                                    >
                                        <LucideIcons.X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </SectionWrapper>

                    <SectionWrapper title="NGOẠI NGỮ" sectionKey="languages" titleClassName="text-lg font-bold text-teal-800 mb-4 uppercase tracking-wider" onAdd={() => addItem('languages', { name: "Ngôn ngữ", level: "Cơ bản" })}>
                        <div className="flex flex-col gap-4">
                            {cvData.languages.map((lang, index) => (
                                <EditableItemWrapper key={lang.id} id={lang.id} section="languages" index={index} isFirst={index === 0} isLast={index === cvData.languages.length - 1}>
                                    <div className="flex flex-col text-sm border-l-2 border-teal-500 pl-3">
                                        <EditableText className="font-bold text-gray-800" value={lang.name} onChange={v => {
                                            const newLang = [...cvData.languages]; newLang[index].name = v; updateField('languages', newLang);
                                        }} />
                                        <EditableText className="text-teal-600 font-medium" value={lang.level} onChange={v => {
                                            const newLang = [...cvData.languages]; newLang[index].level = v; updateField('languages', newLang);
                                        }} />
                                    </div>
                                </EditableItemWrapper>
                            ))}
                        </div>
                    </SectionWrapper>

                </div>

                {/* Right Column (70%) */}
                <div className="w-[70%] flex flex-col gap-8 pb-12">
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
                                        titleClassName="text-xl font-bold text-teal-800 border-b-2 border-teal-100 pb-2 mb-4 uppercase tracking-wider"
                                    >
                                        <div className="flex flex-col gap-6">
                                            {cvData.experience.map((exp, itemIndex) => (
                                                <EditableItemWrapper key={exp.id} id={exp.id} section="experience" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.experience.length - 1}>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <EditableText as="h4" className="font-bold text-gray-900 text-lg" value={exp.role} onChange={v => {
                                                                    const dt = [...cvData.experience]; dt[itemIndex].role = v; updateField('experience', dt);
                                                                }} />
                                                                <EditableText as="p" className="text-teal-700 font-medium" value={exp.company} onChange={v => {
                                                                    const dt = [...cvData.experience]; dt[itemIndex].company = v; updateField('experience', dt);
                                                                }} />
                                                            </div>
                                                            <div className="text-right bg-teal-50 px-2 py-1 rounded">
                                                                <EditableText className="text-xs font-bold text-teal-800 block" value={exp.dateRange} onChange={v => {
                                                                    const dt = [...cvData.experience]; dt[itemIndex].dateRange = v; updateField('experience', dt);
                                                                }} />
                                                                <EditableText className="text-[10px] text-teal-600 font-medium uppercase tracking-wider block" value={exp.duration} onChange={v => {
                                                                    const dt = [...cvData.experience]; dt[itemIndex].duration = v; updateField('experience', dt);
                                                                }} />
                                                            </div>
                                                        </div>
                                                        <EditableText as="p" className="text-sm text-gray-600 leading-relaxed text-justify mt-2" value={exp.description} onChange={v => {
                                                            const dt = [...cvData.experience]; dt[itemIndex].description = v; updateField('experience', dt);
                                                        }} />
                                                    </div>
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
                                        titleClassName="text-xl font-bold text-teal-800 border-b-2 border-teal-100 pb-2 mb-4 uppercase tracking-wider"
                                    >
                                        <div className="flex flex-col gap-6">
                                            {cvData.education.map((edu, itemIndex) => (
                                                <EditableItemWrapper key={edu.id} id={edu.id} section="education" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.education.length - 1}>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <EditableText as="h4" className="font-bold text-gray-900 text-lg" value={edu.degree} onChange={v => {
                                                                    const dt = [...cvData.education]; dt[itemIndex].degree = v; updateField('education', dt);
                                                                }} />
                                                                <EditableText as="p" className="text-teal-700 font-medium" value={edu.school} onChange={v => {
                                                                    const dt = [...cvData.education]; dt[itemIndex].school = v; updateField('education', dt);
                                                                }} />
                                                            </div>
                                                            <div className="text-right bg-teal-50 px-2 py-1 rounded">
                                                                <EditableText className="text-xs font-bold text-teal-800 block" value={edu.dateRange} onChange={v => {
                                                                    const dt = [...cvData.education]; dt[itemIndex].dateRange = v; updateField('education', dt);
                                                                }} />
                                                            </div>
                                                        </div>
                                                        {edu.description && (
                                                            <EditableText as="p" className="text-sm text-gray-600 leading-relaxed mt-2" value={edu.description} onChange={v => {
                                                                const dt = [...cvData.education]; dt[itemIndex].description = v; updateField('education', dt);
                                                            }} />
                                                        )}
                                                    </div>
                                                </EditableItemWrapper>
                                            ))}
                                        </div>
                                    </SectionWrapper>
                                );
                            default: return null;
                        }
                    })}
                </div>
            </div>

        </div>
    );
};

export default TechInnovatorTemplate;
