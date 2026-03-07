import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Eye, EyeOff } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const ModernMinimalistTemplate = ({
    cvData,
    sectionOrder,
    updateField,
    addItem,
    EditableText,
    SectionWrapper,
    EditableItemWrapper,
    avatarInputRef,
    contactVisibility,
    toggleContactVisibility
}) => {
    return (
        <div className="w-[850px] mx-auto mt-8 bg-white shadow-xl min-h-[1100px] relative font-sans">
            {/* Header (Name, Title) */}
            <div className="px-12 pt-12 pb-6 bg-[#3b82f6] text-white rounded-t-lg">
                <EditableText
                    as="h1"
                    className="text-4xl font-bold uppercase mb-2 text-white"
                    value={cvData.personalInfo.fullName}
                    onChange={(val) => updateField('personalInfo.fullName', val)}
                />
                <div className="flex items-center gap-3 text-blue-100 font-medium">
                    <EditableText
                        value={cvData.personalInfo.title}
                        onChange={(val) => updateField('personalInfo.title', val)}
                    />
                    <span className="text-blue-200/50">|</span>
                    <EditableText
                        value={cvData.personalInfo.experienceYears}
                        onChange={(val) => updateField('personalInfo.experienceYears', val)}
                    />
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex px-12 pb-12 gap-10">

                {/* Left Column (35%) */}
                <div className="w-[35%] flex flex-col gap-8">

                    {/* Avatar Box */}
                    <div className="bg-[#F8F9FA] p-6 rounded-lg aspect-square flex items-center justify-center relative group">
                        <img src={cvData.personalInfo.avatar} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" />
                        <button onClick={() => avatarInputRef?.current?.click()} className="absolute inset-0 m-auto w-10 h-10 bg-white/90 rounded-full shadow-sm flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <LucideIcons.Camera size={18} />
                        </button>
                    </div>

                    {/* Objective */}
                    <SectionWrapper title="Career Objective" sectionKey="objective" titleClassName="text-xl font-semibold text-blue-600 mb-4">
                        <EditableText
                            as="p"
                            className="text-sm text-gray-600 leading-relaxed text-justify"
                            value={cvData.objective}
                            onChange={(val) => updateField('objective', val)}
                            multiline
                        />
                    </SectionWrapper>

                    {/* Languages */}
                    <SectionWrapper
                        title="Languages"
                        sectionKey="languages"
                        titleClassName="text-xl font-semibold text-blue-600 mb-4"
                        onAdd={() => addItem('languages', { name: "Ngôn ngữ mới", level: "Cơ bản" })}
                    >
                        <div className="flex flex-col gap-2">
                            {cvData.languages.map((lang, index) => (
                                <EditableItemWrapper key={lang.id} id={lang.id} section="languages" index={index} isFirst={index === 0} isLast={index === cvData.languages.length - 1}>
                                    <div className="grid grid-cols-[110px_1fr] text-sm items-center">
                                        <EditableText value={lang.name} onChange={v => {
                                            const newLang = [...cvData.languages]; newLang[index].name = v; updateField('languages', newLang);
                                        }} />
                                        <EditableText className="italic text-gray-600" value={lang.level} onChange={v => {
                                            const newLang = [...cvData.languages]; newLang[index].level = v; updateField('languages', newLang);
                                        }} />
                                    </div>
                                </EditableItemWrapper>
                            ))}
                        </div>
                    </SectionWrapper>

                    {/* Skills */}
                    <SectionWrapper title="Skills" sectionKey="skills" titleClassName="text-xl font-semibold text-blue-600 mb-4" onAdd={() => {
                        updateField('skills', ['Kỹ năng mới', ...cvData.skills]);
                    }}>
                        <div className="flex flex-col gap-2 text-sm text-gray-700">
                            {cvData.skills.map((skill, index) => (
                                <div key={index} className="flex items-center gap-1 group/skill relative">
                                    <EditableText value={skill} onChange={v => {
                                        const newSkills = [...cvData.skills]; newSkills[index] = v; updateField('skills', newSkills);
                                    }} />
                                    <button
                                        onClick={() => updateField('skills', cvData.skills.filter((_, i) => i !== index))}
                                        className="text-red-400 opacity-0 group-hover/skill:opacity-100 hover:bg-red-50 rounded p-0.5"
                                    >
                                        <LucideIcons.X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </SectionWrapper>

                    {/* Contact */}
                    <SectionWrapper title="Contact Info" sectionKey="contact" titleClassName="text-xl font-semibold text-blue-600 mb-4">
                        <div className="flex flex-col gap-3 text-sm text-gray-700">
                            <div className="flex gap-3">
                                <Mail size={16} className="text-blue-500 mt-0.5 min-w-[16px]" />
                                <EditableText value={cvData.contact.emailInResume} onChange={v => updateField('contact.emailInResume', v)} />
                            </div>
                            <div className="flex gap-3">
                                <Phone size={16} className="text-blue-500 mt-0.5 min-w-[16px]" />
                                <EditableText value={cvData.contact.phoneInResume} onChange={v => updateField('contact.phoneInResume', v)} />
                            </div>
                            <div className="flex gap-3">
                                <MapPin size={16} className="text-blue-500 mt-0.5 min-w-[16px]" />
                                <EditableText value={cvData.contact.addressInResume} onChange={v => updateField('contact.addressInResume', v)} />
                            </div>
                            {contactVisibility.githubLink && (
                                <div className="flex gap-3">
                                    <Github size={16} className="text-blue-500 mt-0.5 min-w-[16px]" />
                                    <EditableText value={cvData.contact.githubLink} onChange={v => updateField('contact.githubLink', v)} />
                                </div>
                            )}
                            {contactVisibility.linkedinLink && (
                                <div className="flex gap-3">
                                    <Linkedin size={16} className="text-blue-500 mt-0.5 min-w-[16px]" />
                                    <EditableText value={cvData.contact.linkedinLink} onChange={v => updateField('contact.linkedinLink', v)} />
                                </div>
                            )}
                            {contactVisibility.portfolioLink && (
                                <div className="flex gap-3">
                                    <Globe size={16} className="text-blue-500 mt-0.5 min-w-[16px]" />
                                    <EditableText value={cvData.contact.portfolioLink} onChange={v => updateField('contact.portfolioLink', v)} />
                                </div>
                            )}
                            <div className="flex gap-2 mt-2 print:hidden">
                                <button onClick={() => toggleContactVisibility('githubLink')} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${contactVisibility.githubLink ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                                    {contactVisibility.githubLink ? <Eye size={12} /> : <EyeOff size={12} />} GitHub
                                </button>
                                <button onClick={() => toggleContactVisibility('linkedinLink')} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${contactVisibility.linkedinLink ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                                    {contactVisibility.linkedinLink ? <Eye size={12} /> : <EyeOff size={12} />} LinkedIn
                                </button>
                                <button onClick={() => toggleContactVisibility('portfolioLink')} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${contactVisibility.portfolioLink ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                                    {contactVisibility.portfolioLink ? <Eye size={12} /> : <EyeOff size={12} />} Portfolio
                                </button>
                            </div>
                        </div>
                    </SectionWrapper>

                </div>

                {/* Right Column (65%) */}
                <div className="w-[65%] flex flex-col gap-8 relative">
                    {/* Vertical line connecting sections */}
                    <div className="absolute left-[-13px] top-2 bottom-0 w-px border-l-[1.5px] border-dashed border-blue-500/30" />

                    {sectionOrder.map((sectionKey, index) => {
                        const isFirst = index === 0;
                        const isLast = index === sectionOrder.length - 1;

                        switch (sectionKey) {
                            case 'experience':
                                return (
                                    <SectionWrapper
                                        key={sectionKey}
                                        title="Work Experience"
                                        sectionKey="experience"
                                        index={index}
                                        isFirst={isFirst}
                                        isLast={isLast}
                                        titleClassName="text-xl font-semibold text-blue-600 mb-4"
                                        onAdd={() => addItem('experience', {
                                            role: "Vị trí", company: "Tên công ty", dateRange: "MM/YYYY - MM/YYYY", duration: "(... năm)", description: "Mô tả công việc"
                                        })}
                                    >
                                        <div className="flex flex-col gap-6">
                                            {cvData.experience.map((exp, itemIndex) => (
                                                <EditableItemWrapper key={exp.id} id={exp.id} section="experience" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.experience.length - 1}>
                                                    <div className="flex flex-col gap-1">
                                                        <EditableText as="h4" className="font-bold text-gray-900" value={exp.role} onChange={v => {
                                                            const dt = [...cvData.experience]; dt[itemIndex].role = v; updateField('experience', dt);
                                                        }} />
                                                        <EditableText as="p" className="text-gray-600" value={exp.company} onChange={v => {
                                                            const dt = [...cvData.experience]; dt[itemIndex].company = v; updateField('experience', dt);
                                                        }} />
                                                        <div className="flex gap-2 text-xs text-gray-500 font-medium mb-1">
                                                            <EditableText value={exp.dateRange} onChange={v => {
                                                                const dt = [...cvData.experience]; dt[itemIndex].dateRange = v; updateField('experience', dt);
                                                            }} />
                                                            <EditableText value={exp.duration} onChange={v => {
                                                                const dt = [...cvData.experience]; dt[itemIndex].duration = v; updateField('experience', dt);
                                                            }} />
                                                        </div>
                                                        <EditableText as="p" className="text-sm text-gray-600 leading-relaxed text-justify" value={exp.description} onChange={v => {
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
                                        title="Education"
                                        sectionKey="education"
                                        index={index}
                                        isFirst={isFirst}
                                        isLast={isLast}
                                        titleClassName="text-xl font-semibold text-blue-600 mb-4"
                                        onAdd={() => addItem('education', {
                                            degree: "Bằng cấp", school: "Trường", dateRange: "MM/YYYY - MM/YYYY", duration: "(... năm)"
                                        })}
                                    >
                                        <div className="flex flex-col gap-6">
                                            {cvData.education.map((edu, itemIndex) => (
                                                <EditableItemWrapper key={edu.id} id={edu.id} section="education" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.education.length - 1}>
                                                    <div className="flex flex-col gap-1">
                                                        <EditableText as="h4" className="font-bold text-gray-900" value={edu.degree} onChange={v => {
                                                            const dt = [...cvData.education]; dt[itemIndex].degree = v; updateField('education', dt);
                                                        }} />
                                                        <EditableText as="p" className="text-gray-600" value={edu.school} onChange={v => {
                                                            const dt = [...cvData.education]; dt[itemIndex].school = v; updateField('education', dt);
                                                        }} />
                                                        <div className="flex gap-2 text-xs text-gray-500 font-medium mb-1">
                                                            <EditableText value={edu.dateRange} onChange={v => {
                                                                const dt = [...cvData.education]; dt[itemIndex].dateRange = v; updateField('education', dt);
                                                            }} />
                                                            <EditableText value={edu.duration} onChange={v => {
                                                                const dt = [...cvData.education]; dt[itemIndex].duration = v; updateField('education', dt);
                                                            }} />
                                                        </div>
                                                        {edu.description && (
                                                            <EditableText as="p" className="text-sm text-gray-600 leading-relaxed" value={edu.description} onChange={v => {
                                                                const dt = [...cvData.education]; dt[itemIndex].description = v; updateField('education', dt);
                                                            }} />
                                                        )}
                                                    </div>
                                                </EditableItemWrapper>
                                            ))}
                                        </div>
                                    </SectionWrapper>
                                );
                            case 'certificates':
                                return (
                                    <SectionWrapper
                                        key={sectionKey}
                                        title="Certifications"
                                        sectionKey="certificates"
                                        index={index}
                                        isFirst={isFirst}
                                        isLast={isLast}
                                        titleClassName="text-xl font-semibold text-blue-600 mb-4"
                                        onAdd={() => addItem('certificates', {
                                            name: "Tên chứng chỉ", issuer: "Tổ chức", year: "Năm", link: "Link"
                                        })}
                                    >
                                        <div className="flex flex-col gap-4">
                                            {cvData.certificates.map((cert, itemIndex) => (
                                                <EditableItemWrapper key={cert.id} id={cert.id} section="certificates" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.certificates.length - 1}>
                                                    <div className="flex flex-col gap-1">
                                                        <EditableText as="h4" className="font-bold text-gray-900" value={cert.name} onChange={v => {
                                                            const dt = [...cvData.certificates]; dt[itemIndex].name = v; updateField('certificates', dt);
                                                        }} />
                                                        <EditableText as="p" className="text-gray-600 text-sm" value={cert.issuer} onChange={v => {
                                                            const dt = [...cvData.certificates]; dt[itemIndex].issuer = v; updateField('certificates', dt);
                                                        }} />
                                                        <EditableText as="p" className="text-gray-500 text-xs font-medium" value={cert.year} onChange={v => {
                                                            const dt = [...cvData.certificates]; dt[itemIndex].year = v; updateField('certificates', dt);
                                                        }} />
                                                        <EditableText as="a" className="text-blue-500 hover:underline text-xs" value={cert.link} onChange={v => {
                                                            const dt = [...cvData.certificates]; dt[itemIndex].link = v; updateField('certificates', dt);
                                                        }} />
                                                    </div>
                                                </EditableItemWrapper>
                                            ))}
                                        </div>
                                    </SectionWrapper>
                                );

                            default:
                                return null;
                        }
                    })}

                </div>
            </div>
        </div>
    );
};

export default ModernMinimalistTemplate;
