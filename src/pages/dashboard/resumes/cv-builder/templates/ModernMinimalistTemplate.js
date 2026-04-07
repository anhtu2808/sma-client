import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Eye, EyeOff } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const workingModelOptions = [
    { label: "On-site", value: "ONSITE" },
    { label: "Remote", value: "REMOTE" },
    { label: "Hybrid", value: "HYBRID" },
];
const employmentTypeOptions = [
    { label: "Full-time", value: "FULL_TIME" },
    { label: "Part-time", value: "PART_TIME" },
    { label: "Self-employed", value: "SELF_EMPLOYED" },
    { label: "Freelance", value: "FREELANCE" },
    { label: "Contract", value: "CONTRACT" },
    { label: "Internship", value: "INTERNSHIP" },
    { label: "Apprenticeship", value: "APPRENTICESHIP" },
    { label: "Seasonal", value: "SEASONAL" },
];
const degreeOptions = [
    { label: "High School", value: "HIGH_SCHOOL" },
    { label: "Associate", value: "ASSOCIATE" },
    { label: "Bachelor", value: "BACHELOR" },
    { label: "Master", value: "MASTER" },
    { label: "Doctorate", value: "DOCTORATE" },
    { label: "Certificate", value: "CERTIFICATE" },
];
const projectTypeOptions = [
    { label: "Personal", value: "PERSONAL" },
    { label: "Academic", value: "ACADEMIC" },
    { label: "Professional", value: "PROFESSIONAL" },
    { label: "Open Source", value: "OPEN_SOURCE" },
    { label: "Freelance", value: "FREELANCE" },
];

const ModernMinimalistTemplate = ({
    cvData,
    sectionOrder,
    updateField,
    addItem,
    EditableText,
    SectionWrapper,
    EditableItemWrapper,
    SkillSelector,
    InlineSelect,
    avatarInputRef,
    contactVisibility,
    toggleContactVisibility,
    formatDateDisplay,
    EditableDateRange,
}) => {
    return (
        <div className="w-[850px] mx-auto mt-8 bg-white shadow-xl min-h-[1100px] relative font-sans print:min-h-0 print:w-full print:mt-0 print:shadow-none">
            {/* Header (Name, Title) */}
            <div className="px-12 pt-12 pb-6 bg-[#3b82f6] text-white rounded-t-lg print:rounded-none print:pt-8 print:pb-4">
                <EditableText
                    as="h1"
                    className="text-4xl font-bold text-blue-900 mb-1 truncate"
                    value={cvData.personalInfo.fullName}
                    onChange={(val) => updateField('personalInfo.fullName', val)}
                />
                <EditableText
                    as="h2"
                    className="text-xl font-medium text-blue-100 truncate"
                    value={cvData.personalInfo.jobTitle}
                    onChange={(val) => updateField('personalInfo.jobTitle', val)}
                />
            </div>

            {/* Main Content Layout */}
            <div className="flex px-12 pb-12 gap-10 print:px-8 print:pb-6 print:gap-6">

                {/* Left Column (35%) */}
                <div className="w-[35%] flex flex-col gap-8 print:gap-4">

                    {/* Avatar Box */}
                    <div className="bg-[#F8F9FA] p-6 rounded-lg aspect-square flex items-center justify-center relative group print:aspect-auto print:p-4">
                        <img src={cvData.personalInfo.avatar} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" />
                        <button onClick={() => avatarInputRef?.current?.click()} className="absolute inset-0 m-auto w-10 h-10 bg-white/90 rounded-full shadow-sm flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <LucideIcons.Camera size={18} />
                        </button>
                    </div>

                    {/* Contact (now before Skills) */}
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

                    {/* Skills (Moved below Contact Info) */}
                    <div className="mt-2">
                        <SkillSelector titleClassName="text-xl font-semibold text-blue-600 mb-4" />
                    </div>

                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-8 relative print:block print:space-y-8">
                    {/* Vertical line - hidden on print for cleaner looks */}
                    <div className="absolute left-[-13px] top-2 bottom-0 w-px border-l-[1.5px] border-dashed border-blue-500/30 print:hidden" />

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
                                            title: "Position", company: "Company Name", startDate: "", endDate: "", isCurrent: false, description: "Job Description", workingModel: "ONSITE", employmentType: "FULL_TIME"
                                        })}
                                    >
                                        <div className="flex flex-col gap-6 print:block print:space-y-6">
                                            {cvData.experience.map((exp, itemIndex) => (
                                                <EditableItemWrapper key={exp.id} id={exp.id} section="experience" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.experience.length - 1}>
                                                    <div className="flex flex-col gap-1.5 print:block print:space-y-1.5">
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
                                                                    className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="font-medium mt-0.5 text-sm">
                                                            <InlineSelect value={exp.workingModel} options={workingModelOptions} onChange={v => updateField(`experience.${itemIndex}.workingModel`, v)} />
                                                            <span className="mx-1">•</span>
                                                            <InlineSelect value={exp.employmentType} options={employmentTypeOptions} onChange={v => updateField(`experience.${itemIndex}.employmentType`, v)} />
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
                                        title="Education"
                                        sectionKey="education"
                                        index={index}
                                        isFirst={isFirst}
                                        isLast={isLast}
                                        titleClassName="text-xl font-semibold text-blue-600 mb-4"
                                        onAdd={() => addItem('education', {
                                            institution: "Institution Name", degree: "BACHELOR", majorField: "Major", gpa: 0, startDate: "", endDate: "", isCurrent: false
                                        })}
                                    >
                                        <div className="flex flex-col gap-6 print:block print:space-y-6">
                                            {cvData.education.map((edu, itemIndex) => (
                                                <EditableItemWrapper key={edu.id} id={edu.id} section="education" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.education.length - 1}>
                                                    <div className="flex flex-col gap-1.5 print:block print:space-y-1.5">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex flex-col">
                                                                    <InlineSelect className="font-bold text-gray-900 text-lg" value={edu.degree} options={degreeOptions} onChange={v => updateField(`education.${itemIndex}.degree`, v)} />
                                                                    <EditableText as="h4" className="font-medium mt-0.5 text-sm" value={edu.majorField} onChange={v => updateField(`education.${itemIndex}.majorField`, v)} />
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
                                                                    className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded"
                                                                />
                                                                <div className="flex items-center gap-1 mt-0.5 justify-end">
                                                                    <span className={`font-medium text-sm ${!edu.gpa ? "text-gray-400 print:hidden" : ""}`}>GPA:</span>
                                                                    <EditableText as="span" className={`font-medium text-sm min-w-[20px] ${!edu.gpa ? "print:hidden" : ""}`} value={edu.gpa} onChange={v => updateField(`education.${itemIndex}.gpa`, v)} />
                                                                </div>
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
                                        title="Certifications"
                                        sectionKey="certificates"
                                        index={index}
                                        isFirst={isFirst}
                                        isLast={isLast}
                                        titleClassName="text-xl font-semibold text-blue-600 mb-4"
                                        onAdd={() => addItem('certificates', {
                                            name: "Certificate Name", issuer: "Issuing Organization", credentialUrl: "https://", description: "Certificate description"
                                        })}
                                    >
                                        <div className="flex flex-col gap-4 print:block print:space-y-4">
                                            {cvData.certificates.map((cert, itemIndex) => (
                                                <EditableItemWrapper key={cert.id} id={cert.id} section="certificates" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.certificates.length - 1}>
                                                    <div className="flex flex-col gap-1.5 print:block print:space-y-1.5">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="min-w-0 flex-1">
                                                                <EditableText as="h4" className="font-bold text-gray-900 text-lg" value={cert.name} onChange={v => updateField(`certificates.${itemIndex}.name`, v)} />
                                                            </div>
                                                        </div>
                                                        <EditableText as="p" className="font-medium mt-0.5 text-sm" value={cert.description} onChange={v => updateField(`certificates.${itemIndex}.description`, v)} />
                                                        <EditableText as="p" className="text-blue-500 hover:underline text-sm" value={cert.issuer} onChange={v => updateField(`certificates.${itemIndex}.issuer`, v)} />
                                                        <EditableText as="a" className="text-blue-500 hover:underline text-sm" value={cert.credentialUrl} onChange={v => updateField(`certificates.${itemIndex}.credentialUrl`, v)} />
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
                                        title="Projects"
                                        sectionKey="projects"
                                        index={index}
                                        isFirst={isFirst}
                                        isLast={isLast}
                                        titleClassName="text-xl font-semibold text-blue-600 mb-4"
                                        onAdd={() => addItem('projects', {
                                            title: "Project Name", position: "Role/Position", description: "Project Description", startDate: "", endDate: "", isCurrent: false, projectUrl: "https://project-url.com", projectType: "PROFESSIONAL", teamSize: 1
                                        })}
                                    >
                                        <div className="flex flex-col gap-6 print:block print:space-y-6">
                                            {cvData.projects.map((proj, itemIndex) => (
                                                <EditableItemWrapper key={proj.id} id={proj.id} section="projects" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.projects.length - 1}>
                                                    <div className="flex flex-col gap-1.5 print:block print:space-y-1.5">
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
                                                                    className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded"
                                                                />
                                                            </div>
                                                        </div>
                                                        <EditableText as="p" className="font-medium mt-0.5 text-sm" value={proj.position} onChange={v => updateField(`projects.${itemIndex}.position`, v)} />
                                                        <div className="font-medium mt-0.5 text-sm flex items-center">
                                                            <InlineSelect value={proj.projectType} options={projectTypeOptions} onChange={v => updateField(`projects.${itemIndex}.projectType`, v)} />
                                                            <span className="mx-1">•</span>
                                                            <span className={`${!proj.teamSize ? "text-gray-400 print:hidden" : ""}`}>Team:</span>
                                                            <EditableText as="span" className={`ml-1 min-w-[20px] ${!proj.teamSize ? "print:hidden" : ""}`} value={proj.teamSize} onChange={v => updateField(`projects.${itemIndex}.teamSize`, v)} />
                                                        </div>
                                                        <EditableText as="p" className="font-medium mt-0.5 text-sm" value={proj.description} onChange={v => updateField(`projects.${itemIndex}.description`, v)} />
                                                        <EditableText as="a" className="text-blue-500 hover:underline text-sm" value={proj.projectUrl || "https://project-url.com"} onChange={v => updateField(`projects.${itemIndex}.projectUrl`, v)} />
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
        </div >
    );
};

export default ModernMinimalistTemplate;
