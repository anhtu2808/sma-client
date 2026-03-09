import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Eye, EyeOff } from 'lucide-react';

const ExecutiveProfessionalTemplate = ({
    cvData,
    sectionOrder,
    updateField,
    addItem,
    EditableText,
    SectionWrapper,
    EditableItemWrapper,
    SkillSelector,
    contactVisibility,
    toggleContactVisibility,
    formatDateDisplay,
    EditableDateRange,
}) => {
    return (
        <div className="w-[850px] mx-auto mt-8 bg-white shadow-xl min-h-[1100px] relative font-serif text-gray-800">
            {/* Header: Centered, Classic */}
            <div className="px-14 pt-16 pb-8 text-center">
                <EditableText
                    as="h1"
                    className="text-4xl font-bold text-gray-900 uppercase tracking-widest mb-6"
                    value={cvData.personalInfo.fullName}
                    onChange={(val) => updateField('personalInfo.fullName', val)}
                />

                <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <EditableText value={cvData.contact.emailInResume} onChange={v => updateField('contact.emailInResume', v)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <EditableText value={cvData.contact.phoneInResume} onChange={v => updateField('contact.phoneInResume', v)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <EditableText value={cvData.contact.addressInResume} onChange={v => updateField('contact.addressInResume', v)} />
                    </div>
                    {contactVisibility.githubLink && (
                        <div className="flex items-center gap-2">
                            <Github size={14} />
                            <EditableText value={cvData.contact.githubLink} onChange={v => updateField('contact.githubLink', v)} />
                        </div>
                    )}
                    {contactVisibility.linkedinLink && (
                        <div className="flex items-center gap-2">
                            <Linkedin size={14} />
                            <EditableText value={cvData.contact.linkedinLink} onChange={v => updateField('contact.linkedinLink', v)} />
                        </div>
                    )}
                    {contactVisibility.portfolioLink && (
                        <div className="flex items-center gap-2">
                            <Globe size={14} />
                            <EditableText value={cvData.contact.portfolioLink} onChange={v => updateField('contact.portfolioLink', v)} />
                        </div>
                    )}
                </div>
                <div className="flex justify-center gap-2 mt-4 print:hidden">
                    <button onClick={() => toggleContactVisibility('githubLink')} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${contactVisibility.githubLink ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400'}`}>
                        {contactVisibility.githubLink ? <Eye size={12} /> : <EyeOff size={12} />} GitHub
                    </button>
                    <button onClick={() => toggleContactVisibility('linkedinLink')} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${contactVisibility.linkedinLink ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400'}`}>
                        {contactVisibility.linkedinLink ? <Eye size={12} /> : <EyeOff size={12} />} LinkedIn
                    </button>
                    <button onClick={() => toggleContactVisibility('portfolioLink')} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${contactVisibility.portfolioLink ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400'}`}>
                        {contactVisibility.portfolioLink ? <Eye size={12} /> : <EyeOff size={12} />} Portfolio
                    </button>
                </div>
            </div>

            <div className="px-14 border-b border-gray-300 mx-14 mb-8"></div>

            <div className="px-14 pb-16 flex flex-col gap-8">

                {/* Main Sections */}
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
                                    titleClassName="text-xl font-bold uppercase border-b-2 border-gray-800 pb-2 mb-4 text-gray-900"
                                    onAdd={() => addItem('experience', {
                                        title: "Position", company: "Company Name", startDate: "", endDate: "", isCurrent: false, description: "Job Description", workingModel: "ONSITE", employmentType: "FULL_TIME"
                                    })}
                                >
                                    <div className="flex flex-col gap-6">
                                        {cvData.experience.map((exp, itemIndex) => (
                                            <EditableItemWrapper key={exp.id} id={exp.id} section="experience" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.experience.length - 1}>
                                                <div className="flex flex-col gap-1.5 relative z-10">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="min-w-0 flex-1">
                                                            <EditableText as="h4" className="font-bold text-gray-900 text-lg" value={exp.title} onChange={v => updateField(`experience.${itemIndex}.title`, v)} />
                                                        </div>
                                                        <div className="flex-shrink-0 text-right flex flex-col items-end">
                                                            <EditableDateRange
                                                                startDate={exp.startDate}
                                                                endDate={exp.endDate}
                                                                isCurrent={exp.isCurrent}
                                                                onStartDateChange={v => updateField(`experience.${itemIndex}.startDate`, v)}
                                                                onEndDateChange={v => updateField(`experience.${itemIndex}.endDate`, v)}
                                                                onIsCurrentChange={v => updateField(`experience.${itemIndex}.isCurrent`, v)}
                                                                className="text-sm font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 text-sm text-gray-500">
                                                        <span>{exp.workingModel || 'ONSITE'}</span>
                                                        <span>•</span>
                                                        <span>{exp.employmentType || 'FULL_TIME'}</span>
                                                    </div>
                                                    <EditableText as="p" className="font-medium mt-0.5 text-sm" value={exp.company} onChange={v => updateField(`experience.${itemIndex}.company`, v)} />
                                                    <EditableText as="p" className="font-medium mt-0.5 text-sm" value={exp.description} onChange={v => updateField(`experience.${itemIndex}.description`, v)} />
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
                                    titleClassName="text-xl font-bold uppercase border-b-2 border-gray-800 pb-2 mb-4 text-gray-900"
                                    onAdd={() => addItem('education', {
                                        institution: "Institution Name", degree: "BACHELOR", majorField: "Major", gpa: 0, startDate: "", endDate: "", isCurrent: false
                                    })}
                                >
                                    <div className="flex flex-col gap-6">
                                        {cvData.education.map((edu, itemIndex) => (
                                            <EditableItemWrapper key={edu.id} id={edu.id} section="education" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.education.length - 1}>
                                                <div className="flex flex-col gap-1.5 relative z-10">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-gray-900 text-lg">{edu.degree || 'BACHELOR'}</span>
                                                                <EditableText as="h4" className="font-medium mt-0.5 text-sm" value={edu.majorField || 'Major'} onChange={v => updateField(`education.${itemIndex}.majorField`, v)} />
                                                            </div>
                                                            <EditableText as="p" className="font-medium mt-0.5 text-sm" value={edu.institution} onChange={v => updateField(`education.${itemIndex}.institution`, v)} />
                                                        </div>
                                                        <div className="flex-shrink-0 text-right flex flex-col items-end">
                                                            <EditableDateRange
                                                                startDate={edu.startDate}
                                                                endDate={edu.endDate}
                                                                isCurrent={edu.isCurrent}
                                                                onStartDateChange={v => updateField(`education.${itemIndex}.startDate`, v)}
                                                                onEndDateChange={v => updateField(`education.${itemIndex}.endDate`, v)}
                                                                onIsCurrentChange={v => updateField(`education.${itemIndex}.isCurrent`, v)}
                                                                className="text-sm font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded"
                                                            />
                                                            {edu.gpa > 0 && <span className="font-medium mt-0.5 text-sm">GPA: {edu.gpa}</span>}
                                                        </div>
                                                    </div>
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
                                    titleClassName="text-xl font-bold uppercase border-b-2 border-gray-800 pb-2 mb-4 text-gray-900"
                                    onAdd={() => addItem('certificates', {
                                        name: "Certificate Name", issuer: "Issuing Organization", credentialUrl: "https://", description: "Certificate description"
                                    })}
                                >
                                    <div className="flex flex-col gap-4">
                                        {cvData.certificates.map((cert, itemIndex) => (
                                            <EditableItemWrapper key={cert.id} id={cert.id} section="certificates" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.certificates.length - 1}>
                                                <div className="flex flex-col gap-1.5 relative z-10">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="min-w-0 flex-1">
                                                            <EditableText as="h4" className="font-bold text-gray-900 text-lg" value={cert.name} onChange={v => updateField(`certificates.${itemIndex}.name`, v)} />
                                                        </div>
                                                    </div>
                                                    <EditableText as="p" className="font-medium mt-0.5 text-sm" value={cert.description} onChange={v => updateField(`certificates.${itemIndex}.description`, v)} />
                                                    <EditableText as="p" className="text-gray-600 hover:underline text-sm" value={cert.issuer} onChange={v => updateField(`certificates.${itemIndex}.issuer`, v)} />
                                                    <EditableText as="a" className="text-gray-600 hover:underline text-sm" value={cert.credentialUrl} onChange={v => updateField(`certificates.${itemIndex}.credentialUrl`, v)} />
                                                </div>
                                            </EditableItemWrapper>
                                        ))}
                                    </div>
                                </SectionWrapper>
                            );
                        case 'projects':
                            return (
                                <SectionWrapper
                                    key={sectionKey}
                                    title="PROJECTS"
                                    sectionKey="projects"
                                    index={index}
                                    isFirst={isFirst}
                                    isLast={isLast}
                                    titleClassName="text-xl font-bold uppercase border-b-2 border-gray-800 pb-2 mb-4 text-gray-900"
                                    onAdd={() => addItem('projects', {
                                        title: "Project Name", position: "Role/Position", description: "Project Description", startDate: "", endDate: "", isCurrent: false, projectUrl: "https://project-url.com", projectType: "PROFESSIONAL", teamSize: 1
                                    })}
                                >
                                    <div className="flex flex-col gap-6">
                                        {cvData.projects.map((proj, itemIndex) => (
                                            <EditableItemWrapper key={proj.id} id={proj.id} section="projects" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.projects.length - 1}>
                                                <div className="flex flex-col gap-1.5 relative z-10">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="min-w-0 flex-1">
                                                            <EditableText as="h4" className="font-bold text-gray-900 text-lg" value={proj.title} onChange={v => updateField(`projects.${itemIndex}.title`, v)} />
                                                        </div>
                                                        <div className="flex-shrink-0 text-right flex flex-col items-end">
                                                            <EditableDateRange
                                                                startDate={proj.startDate}
                                                                endDate={proj.endDate}
                                                                isCurrent={proj.isCurrent}
                                                                onStartDateChange={v => updateField(`projects.${itemIndex}.startDate`, v)}
                                                                onEndDateChange={v => updateField(`projects.${itemIndex}.endDate`, v)}
                                                                onIsCurrentChange={v => updateField(`projects.${itemIndex}.isCurrent`, v)}
                                                                className="text-sm font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded"
                                                            />
                                                        </div>
                                                    </div>
                                                    <EditableText as="p" className="font-medium mt-0.5 text-sm" value={proj.position} onChange={v => updateField(`projects.${itemIndex}.position`, v)} />
                                                    <div className="font-medium mt-0.5 text-sm">
                                                        <span>{proj.projectType || 'PROFESSIONAL'}</span>
                                                        <span className="mx-1">•</span>
                                                        <span>Team: {proj.teamSize || '1'}</span>
                                                    </div>
                                                    <EditableText as="p" className="font-medium mt-0.5 text-sm" value={proj.description} onChange={v => updateField(`projects.${itemIndex}.description`, v)} />
                                                    <EditableText as="a" className="text-gray-600 hover:underline text-sm" value={proj.projectUrl || "https://project-url.com"} onChange={v => updateField(`projects.${itemIndex}.projectUrl`, v)} />
                                                </div>
                                            </EditableItemWrapper>
                                        ))}
                                    </div>
                                </SectionWrapper>
                            );
                        default: return null;
                    }
                })}

                {/* 2-Column Grid for smaller sections */}
                <div className="grid grid-cols-2 gap-8 mt-4">

                    {/* Skills */}
                    <SkillSelector titleClassName="text-xl font-bold uppercase border-b-2 border-gray-800 pb-2 mb-4 text-gray-900" />

                </div>

            </div>
        </div >
    );
};

export default ExecutiveProfessionalTemplate;
