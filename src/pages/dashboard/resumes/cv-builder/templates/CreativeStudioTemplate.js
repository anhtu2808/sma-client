import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Eye, EyeOff } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const CreativeStudioTemplate = ({
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
        <div className="w-[850px] mx-auto mt-8 bg-white shadow-xl min-h-[1100px] relative font-sans flex">
            {/* Left Column (35%) - Dark Purple Sidebar */}
            <div className="w-[35%] bg-purple-800 text-white flex flex-col p-10 gap-8 min-h-full">

                {/* Avatar Box */}
                <div className="flex justify-center">
                    <div className="relative group w-40 h-40">
                        <img src={cvData.personalInfo.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-white/20 shadow-md" />
                        <button onClick={() => avatarInputRef?.current?.click()} className="absolute inset-0 m-auto w-10 h-10 bg-black/50 rounded-full shadow-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <LucideIcons.Camera size={18} />
                        </button>
                    </div>
                </div>

                <div className="text-center">
                    <EditableText
                        as="h2"
                        className="text-2xl font-bold uppercase tracking-wider mb-2"
                        value={cvData.personalInfo.fullName}
                        onChange={(val) => updateField('personalInfo.fullName', val)}
                    />
                    <EditableText
                        className="text-sm font-medium text-purple-200 uppercase tracking-widest"
                        value={cvData.personalInfo.title}
                        onChange={(val) => updateField('personalInfo.title', val)}
                    />
                </div>

                {/* Contact */}
                <SectionWrapper title="CONTACT" sectionKey="contact" titleClassName="text-sm border-b border-purple-500/50 pb-2 mb-4 font-bold text-white tracking-widest uppercase">
                    <div className="flex flex-col gap-4 text-sm text-purple-100">
                        <div className="flex gap-3 items-center">
                            <Mail size={16} className="text-purple-300 min-w-[16px]" />
                            <EditableText value={cvData.contact.emailInResume} onChange={v => updateField('contact.emailInResume', v)} />
                        </div>
                        <div className="flex gap-3 items-center">
                            <Phone size={16} className="text-purple-300 min-w-[16px]" />
                            <EditableText value={cvData.contact.phoneInResume} onChange={v => updateField('contact.phoneInResume', v)} />
                        </div>
                        <div className="flex gap-3 items-start">
                            <MapPin size={16} className="text-purple-300 mt-1 min-w-[16px]" />
                            <EditableText value={cvData.contact.addressInResume} onChange={v => updateField('contact.addressInResume', v)} />
                        </div>
                        {contactVisibility.githubLink && (
                            <div className="flex gap-3 items-center">
                                <Github size={16} className="text-purple-300 min-w-[16px]" />
                                <EditableText value={cvData.contact.githubLink} onChange={v => updateField('contact.githubLink', v)} />
                            </div>
                        )}
                        {contactVisibility.linkedinLink && (
                            <div className="flex gap-3 items-center">
                                <Linkedin size={16} className="text-purple-300 min-w-[16px]" />
                                <EditableText value={cvData.contact.linkedinLink} onChange={v => updateField('contact.linkedinLink', v)} />
                            </div>
                        )}
                        {contactVisibility.portfolioLink && (
                            <div className="flex gap-3 items-center">
                                <Globe size={16} className="text-purple-300 min-w-[16px]" />
                                <EditableText value={cvData.contact.portfolioLink} onChange={v => updateField('contact.portfolioLink', v)} />
                            </div>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2 print:hidden">
                            <button onClick={() => toggleContactVisibility('githubLink')} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${contactVisibility.githubLink ? 'bg-purple-600 text-white' : 'bg-purple-900 text-purple-400'}`}>
                                {contactVisibility.githubLink ? <Eye size={12} /> : <EyeOff size={12} />} GitHub
                            </button>
                            <button onClick={() => toggleContactVisibility('linkedinLink')} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${contactVisibility.linkedinLink ? 'bg-purple-600 text-white' : 'bg-purple-900 text-purple-400'}`}>
                                {contactVisibility.linkedinLink ? <Eye size={12} /> : <EyeOff size={12} />} LinkedIn
                            </button>
                            <button onClick={() => toggleContactVisibility('portfolioLink')} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${contactVisibility.portfolioLink ? 'bg-purple-600 text-white' : 'bg-purple-900 text-purple-400'}`}>
                                {contactVisibility.portfolioLink ? <Eye size={12} /> : <EyeOff size={12} />} Portfolio
                            </button>
                        </div>
                    </div>
                </SectionWrapper>

                {/* Skills */}
                <SectionWrapper title="SKILLS" sectionKey="skills" titleClassName="text-sm border-b border-purple-500/50 pb-2 mb-4 font-bold text-white tracking-widest uppercase" onAdd={() => updateField('skills', ['Skill', ...cvData.skills])}>
                    <div className="flex flex-col gap-3 text-sm text-purple-100">
                        {cvData.skills.map((skill, index) => (
                            <div key={index} className="flex items-center gap-2 group/skill relative">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                <EditableText value={skill} onChange={v => {
                                    const newSkills = [...cvData.skills]; newSkills[index] = v; updateField('skills', newSkills);
                                }} />
                                <button
                                    onClick={() => updateField('skills', cvData.skills.filter((_, i) => i !== index))}
                                    className="text-red-300 opacity-0 group-hover/skill:opacity-100 hover:bg-white/10 rounded p-0.5 ml-auto"
                                >
                                    <LucideIcons.X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>

                {/* Languages */}
                <SectionWrapper title="LANGUAGES" sectionKey="languages" titleClassName="text-sm border-b border-purple-500/50 pb-2 mb-4 font-bold text-white tracking-widest uppercase" onAdd={() => addItem('languages', { name: "Language", level: "Basic" })}>
                    <div className="flex flex-col gap-3">
                        {cvData.languages.map((lang, index) => (
                            <EditableItemWrapper key={lang.id} id={lang.id} section="languages" index={index} isFirst={index === 0} isLast={index === cvData.languages.length - 1}>
                                <div className="flex flex-col text-sm text-purple-100 gap-1">
                                    <EditableText className="font-semibold text-white" value={lang.name} onChange={v => {
                                        const newLang = [...cvData.languages]; newLang[index].name = v; updateField('languages', newLang);
                                    }} />
                                    <EditableText className="text-purple-300" value={lang.level} onChange={v => {
                                        const newLang = [...cvData.languages]; newLang[index].level = v; updateField('languages', newLang);
                                    }} />
                                </div>
                            </EditableItemWrapper>
                        ))}
                    </div>
                </SectionWrapper>
            </div>

            {/* Right Column (65%) */}
            <div className="w-[65%] p-12 flex flex-col gap-8">

                {/* Objective */}
                <SectionWrapper title="CAREER OBJECTIVE" sectionKey="objective" titleClassName="text-xl font-bold uppercase text-purple-800 mb-4 tracking-wide pb-2 border-b-2 border-purple-100">
                    <EditableText
                        as="p"
                        className="text-gray-600 leading-relaxed text-justify"
                        value={cvData.objective}
                        onChange={(val) => updateField('objective', val)}
                        multiline
                    />
                </SectionWrapper>

                {/* Main Content Layout */}
                {sectionOrder.map((sectionKey, index) => {
                    const isFirst = index === 0;
                    const isLast = index === sectionOrder.length - 1;

                    switch (sectionKey) {
                        case 'experience':
                            return (
                                <SectionWrapper
                                    key={sectionKey}
                                    title="WORK EXPERIENCE"
                                    sectionKey="experience"
                                    index={index}
                                    isFirst={isFirst}
                                    isLast={isLast}
                                    onAdd={() => addItem('experience', {
                                        role: "Vị trí", company: "Tên công ty", dateRange: "MM/YYYY - MM/YYYY", duration: "(... năm)", description: "Mô tả"
                                    })}
                                    titleClassName="text-xl font-bold uppercase text-purple-800 mb-4 tracking-wide pb-2 border-b-2 border-purple-100"
                                >
                                    <div className="flex flex-col gap-6">
                                        {cvData.experience.map((exp, itemIndex) => (
                                            <EditableItemWrapper key={exp.id} id={exp.id} section="experience" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.experience.length - 1}>
                                                <div className="flex flex-col gap-1 relative pl-4 border-l-2 border-purple-200 hover:border-purple-500 transition-colors">
                                                    <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-purple-500"></div>
                                                    <EditableText as="h4" className="font-bold text-gray-900 text-lg" value={exp.role} onChange={v => {
                                                        const dt = [...cvData.experience]; dt[itemIndex].role = v; updateField('experience', dt);
                                                    }} />
                                                    <EditableText as="p" className="text-purple-700 font-medium" value={exp.company} onChange={v => {
                                                        const dt = [...cvData.experience]; dt[itemIndex].company = v; updateField('experience', dt);
                                                    }} />
                                                    <div className="flex gap-2 text-xs text-gray-500 font-medium mt-1 mb-2 bg-gray-50 max-w-max px-2 py-1 rounded">
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
                                    title="EDUCATION"
                                    sectionKey="education"
                                    index={index}
                                    isFirst={isFirst}
                                    isLast={isLast}
                                    onAdd={() => addItem('education', {
                                        degree: "Bằng cấp", school: "Trường", dateRange: "MM/YYYY - MM/YYYY", duration: "(... năm)"
                                    })}
                                    titleClassName="text-xl font-bold uppercase text-purple-800 mb-4 tracking-wide pb-2 border-b-2 border-purple-100"
                                >
                                    <div className="flex flex-col gap-6">
                                        {cvData.education.map((edu, itemIndex) => (
                                            <EditableItemWrapper key={edu.id} id={edu.id} section="education" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.education.length - 1}>
                                                <div className="flex flex-col gap-1 relative pl-4 border-l-2 border-purple-200 hover:border-purple-500 transition-colors">
                                                    <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-purple-500"></div>
                                                    <EditableText as="h4" className="font-bold text-gray-900 text-lg" value={edu.degree} onChange={v => {
                                                        const dt = [...cvData.education]; dt[itemIndex].degree = v; updateField('education', dt);
                                                    }} />
                                                    <EditableText as="p" className="text-purple-700 font-medium" value={edu.school} onChange={v => {
                                                        const dt = [...cvData.education]; dt[itemIndex].school = v; updateField('education', dt);
                                                    }} />
                                                    <div className="flex gap-2 text-xs text-gray-500 font-medium mt-1 mb-2 bg-gray-50 max-w-max px-2 py-1 rounded">
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
                                    title="CERTIFICATIONS"
                                    sectionKey="certificates"
                                    index={index}
                                    isFirst={isFirst}
                                    isLast={isLast}
                                    onAdd={() => addItem('certificates', {
                                        name: "Tên chứng chỉ", issuer: "Tổ chức", year: "Năm", link: "Link"
                                    })}
                                    titleClassName="text-xl font-bold uppercase text-purple-800 mb-4 tracking-wide pb-2 border-b-2 border-purple-100"
                                >
                                    <div className="flex flex-col gap-4">
                                        {cvData.certificates.map((cert, itemIndex) => (
                                            <EditableItemWrapper key={cert.id} id={cert.id} section="certificates" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.certificates.length - 1}>
                                                <div className="flex flex-col gap-1 relative pl-4 border-l-2 border-purple-200 hover:border-purple-500 transition-colors">
                                                    <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-purple-500"></div>
                                                    <EditableText as="h4" className="font-bold text-gray-900" value={cert.name} onChange={v => {
                                                        const dt = [...cvData.certificates]; dt[itemIndex].name = v; updateField('certificates', dt);
                                                    }} />
                                                    <EditableText as="p" className="text-purple-700 text-sm" value={cert.issuer} onChange={v => {
                                                        const dt = [...cvData.certificates]; dt[itemIndex].issuer = v; updateField('certificates', dt);
                                                    }} />
                                                    <EditableText as="p" className="text-gray-500 text-xs font-medium" value={cert.year} onChange={v => {
                                                        const dt = [...cvData.certificates]; dt[itemIndex].year = v; updateField('certificates', dt);
                                                    }} />
                                                    <EditableText as="a" className="text-purple-500 hover:underline text-xs" value={cert.link} onChange={v => {
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
    );
};

export default CreativeStudioTemplate;
