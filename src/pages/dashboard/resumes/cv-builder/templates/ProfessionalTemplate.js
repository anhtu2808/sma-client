import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
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

const ProfessionalTemplate = ({
    cvData,
    sectionOrder,
    updateField,
    addItem,
    EditableText,
    SectionWrapper,
    EditableItemWrapper,
    SkillSelector,
    InlineSelect,
    contactVisibility,
    toggleContactVisibility,
    EditableDateRange,
    avatarInputRef,
}) => {
    return (
        <div className="w-[850px] mx-auto mt-8 bg-white shadow-xl min-h-[1100px] relative font-sans print:min-h-0 print:w-full print:mt-0 print:shadow-none print:break-inside-avoid">
            <div className="px-10 pt-10 pb-10 print:px-8 print:py-8">
                {/* Header Info */}
                <div className="mb-4 flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1 min-w-0">
                        <EditableText
                            as="h1"
                            className="text-[28px] font-bold text-[#2551A5] uppercase tracking-wide leading-tight mb-1 truncate"
                            value={cvData.personalInfo.fullName}
                            onChange={(val) => updateField('personalInfo.fullName', val)}
                        />
                        <EditableText
                            as="h2"
                            className="text-[18px] font-bold text-[#2551A5] leading-snug mb-3 truncate"
                            value={cvData.personalInfo.jobTitle}
                            onChange={(val) => updateField('personalInfo.jobTitle', val)}
                        />

                        <div className="text-[13px] leading-[1.4] text-gray-900 flex flex-col gap-0.5 mt-2">
                            <div className="flex gap-2">
                                <strong>Phone:</strong>
                                <EditableText value={cvData.contact.phoneInResume} onChange={v => updateField('contact.phoneInResume', v)} className="flex-1" />
                            </div>
                            <div className="flex gap-2">
                                <strong>Email:</strong>
                                <EditableText value={cvData.contact.emailInResume} onChange={v => updateField('contact.emailInResume', v)} className="flex-1" />
                            </div>
                            <div className="flex gap-2">
                                <strong>Address:</strong>
                                <EditableText value={cvData.contact.addressInResume} onChange={v => updateField('contact.addressInResume', v)} className="flex-1" />
                            </div>
                            {contactVisibility.portfolioLink && (
                                <div className="flex gap-2">
                                    <strong>Website:</strong>
                                    <EditableText value={cvData.contact.portfolioLink} onChange={v => updateField('contact.portfolioLink', v)} className="flex-1 text-[#2551A5] hover:underline" />
                                </div>
                            )}
                            {contactVisibility.githubLink && (
                                <div className="flex gap-2">
                                    <strong>GitHub:</strong>
                                    <EditableText value={cvData.contact.githubLink} onChange={v => updateField('contact.githubLink', v)} className="flex-1 text-[#2551A5] hover:underline" />
                                </div>
                            )}
                            {contactVisibility.linkedinLink && (
                                <div className="flex gap-2">
                                    <strong>LinkedIn:</strong>
                                    <EditableText value={cvData.contact.linkedinLink} onChange={v => updateField('contact.linkedinLink', v)} className="flex-1 text-[#2551A5] hover:underline" />
                                </div>
                            )}

                            <div className="flex gap-2 mt-2 print:hidden">
                                <button onClick={() => toggleContactVisibility('portfolioLink')} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${contactVisibility.portfolioLink ? 'bg-[#2551A5]/10 text-[#2551A5]' : 'bg-gray-100 text-gray-400'}`}>
                                    {contactVisibility.portfolioLink ? <Eye size={12} /> : <EyeOff size={12} />} Website
                                </button>
                                <button onClick={() => toggleContactVisibility('githubLink')} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${contactVisibility.githubLink ? 'bg-[#2551A5]/10 text-[#2551A5]' : 'bg-gray-100 text-gray-400'}`}>
                                    {contactVisibility.githubLink ? <Eye size={12} /> : <EyeOff size={12} />} GitHub
                                </button>
                                <button onClick={() => toggleContactVisibility('linkedinLink')} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${contactVisibility.linkedinLink ? 'bg-[#2551A5]/10 text-[#2551A5]' : 'bg-gray-100 text-gray-400'}`}>
                                    {contactVisibility.linkedinLink ? <Eye size={12} /> : <EyeOff size={12} />} LinkedIn
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Avatar Box */}
                    <div className="flex-shrink-0 relative group print:p-0">
                        <img src={cvData.personalInfo.avatar} alt="Avatar" className="w-[130px] h-[130px] object-cover border-[3px] border-[#2551A5] shadow-sm print:shadow-none" />
                        <button onClick={() => avatarInputRef?.current?.click()} className="absolute inset-0 m-auto w-10 h-10 bg-white/90 rounded-full shadow-sm flex items-center justify-center text-[#2551A5] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer print:hidden">
                            <LucideIcons.Camera size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-1 mt-6">
                    {/* Skills usually ordered explicitly or inline grouped, here we force Skills at top or use ordered */}

                    {/* Inject skills dynamically below Header? The match report usually has skills first or after summary. We'll render it naturally if not in sectionOrder. But in cvBuilder it handles skill in left or we can add it here. */}
                    <div className="mt-4 mb-2">
                        <SkillSelector titleClassName="text-[18px] font-bold text-[#2551A5] uppercase tracking-wider mb-2" hideBorder={true} />
                        <hr className="border-[#2551A5] border-t-[1.5px] mt-1 -translate-y-2 mb-4" />
                    </div>

                    {sectionOrder.map((sectionKey, index) => {
                        const isFirst = index === 0;
                        const isLast = index === sectionOrder.length - 1;

                        const SectionHeadingOptions = {
                            titleClassName: "text-[18px] font-bold text-[#2551A5] uppercase tracking-wider pt-2",
                        };

                        const HeaderChildren = () => (
                            <hr className="border-[#2551A5] border-t-[1.5px] mt-1 mb-3" />
                        );

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
                                        {...SectionHeadingOptions}
                                        headerExtension={<HeaderChildren />}
                                        onAdd={() => addItem('experience', {
                                            title: "Position", company: "Company Name", startDate: "", endDate: "", isCurrent: false, description: "Job Description", workingModel: "ONSITE", employmentType: "FULL_TIME"
                                        })}
                                    >
                                        <div className="flex flex-col gap-5 print:block print:space-y-4">
                                            {cvData.experience.map((exp, itemIndex) => (
                                                <EditableItemWrapper key={exp.id} id={exp.id} section="experience" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.experience.length - 1} contentClassName="pl-0">
                                                    <div className="flex flex-col text-[13px] text-gray-900 leading-relaxed print:break-inside-avoid">
                                                        <div className="flex justify-between items-start mb-0.5 gap-2">
                                                            <div className="flex-1 font-bold">
                                                                <EditableText as="span" value={exp.company} onChange={v => updateField(`experience.${itemIndex}.company`, v)} />
                                                                <span>&nbsp;-&nbsp;</span>
                                                                <EditableText as="span" value={exp.title} onChange={v => updateField(`experience.${itemIndex}.title`, v)} />
                                                                <span className="font-normal text-gray-700 ml-1">
                                                                    (
                                                                    <InlineSelect value={exp.workingModel} options={workingModelOptions} onChange={v => updateField(`experience.${itemIndex}.workingModel`, v)} />
                                                                    ,&nbsp;
                                                                    <InlineSelect value={exp.employmentType} options={employmentTypeOptions} onChange={v => updateField(`experience.${itemIndex}.employmentType`, v)} />
                                                                    )
                                                                </span>
                                                            </div>
                                                            <div className="flex-shrink-0 text-right font-bold text-gray-900 whitespace-nowrap">
                                                                <EditableDateRange
                                                                    startDate={exp.startDate}
                                                                    endDate={exp.endDate}
                                                                    isCurrent={exp.isCurrent}
                                                                    onStartDateChange={v => updateField(`experience.${itemIndex}.startDate`, v)}
                                                                    onEndDateChange={v => updateField(`experience.${itemIndex}.endDate`, v)}
                                                                    onIsCurrentChange={v => updateField(`experience.${itemIndex}.isCurrent`, v)}
                                                                    className="px-1 py-0.5 hover:bg-gray-100 rounded"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="text-justify mt-1">
                                                            <EditableText as="div" className="whitespace-pre-line text-[13px] leading-[1.6]" value={exp.description} onChange={v => updateField(`experience.${itemIndex}.description`, v)} />
                                                        </div>
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
                                        {...SectionHeadingOptions}
                                        headerExtension={<HeaderChildren />}
                                        onAdd={() => addItem('education', {
                                            institution: "Institution Name", degree: "BACHELOR", majorField: "Major", gpa: 0, startDate: "", endDate: "", isCurrent: false
                                        })}
                                    >
                                        <div className="flex flex-col gap-4 print:block print:space-y-4">
                                            {cvData.education.map((edu, itemIndex) => (
                                                <EditableItemWrapper key={edu.id} id={edu.id} section="education" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.education.length - 1} contentClassName="pl-0">
                                                    <div className="flex flex-col text-[13px] text-gray-900 leading-[1.6] print:break-inside-avoid">
                                                        <div className="flex justify-between items-start gap-2 mb-1">
                                                            <div className="flex-1 font-bold">
                                                                <EditableText as="span" value={edu.institution} onChange={v => updateField(`education.${itemIndex}.institution`, v)} />
                                                            </div>
                                                            <div className="flex-shrink-0 text-right font-bold text-gray-900 whitespace-nowrap">
                                                                <EditableDateRange
                                                                    startDate={edu.startDate}
                                                                    endDate={edu.endDate}
                                                                    isCurrent={edu.isCurrent}
                                                                    onStartDateChange={v => updateField(`education.${itemIndex}.startDate`, v)}
                                                                    onEndDateChange={v => updateField(`education.${itemIndex}.endDate`, v)}
                                                                    onIsCurrentChange={v => updateField(`education.${itemIndex}.isCurrent`, v)}
                                                                    className="px-1 py-0.5 hover:bg-gray-100 rounded"
                                                                />
                                                            </div>
                                                        </div>
                                                        <ul className="list-disc list-inside ml-2 space-y-0.5">
                                                            <li>
                                                                <InlineSelect value={edu.degree} options={degreeOptions} onChange={v => updateField(`education.${itemIndex}.degree`, v)} />
                                                                <span>&nbsp;-&nbsp;</span>
                                                                <EditableText as="span" value={edu.majorField} onChange={v => updateField(`education.${itemIndex}.majorField`, v)} />
                                                            </li>
                                                            <li className={`flex items-center gap-1 ${!edu.gpa || edu.gpa == 0 ? "print:hidden" : ""}`}>
                                                                <span className={`font-semibold text-gray-900 ${!edu.gpa || edu.gpa == 0 ? "text-gray-400" : ""}`}>GPA:</span>
                                                                <EditableText type="number" as="span" className="min-w-[20px]" value={edu.gpa || ""} onChange={v => updateField(`education.${itemIndex}.gpa`, v)} />
                                                            </li>
                                                        </ul>
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
                                        {...SectionHeadingOptions}
                                        headerExtension={<HeaderChildren />}
                                        onAdd={() => addItem('certificates', {
                                            name: "Certificate Name", issuer: "Issuing Organization", credentialUrl: "https://", description: "Certificate description"
                                        })}
                                    >
                                        <div className="flex flex-col gap-4 print:block print:space-y-4">
                                            {cvData.certificates.map((cert, itemIndex) => (
                                                <EditableItemWrapper key={cert.id} id={cert.id} section="certificates" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.certificates.length - 1} contentClassName="pl-0">
                                                    <div className="flex flex-col text-[13px] text-gray-900 leading-[1.6] print:break-inside-avoid">
                                                        <div className="font-bold mb-0.5">
                                                            <EditableText as="span" value={cert.name} onChange={v => updateField(`certificates.${itemIndex}.name`, v)} />
                                                        </div>
                                                        <div className="mb-0.5">
                                                            <span className="text-gray-700">Issued by: </span>
                                                            <EditableText as="span" value={cert.issuer} onChange={v => updateField(`certificates.${itemIndex}.issuer`, v)} />
                                                        </div>
                                                        <EditableText as="div" className="mb-0.5 text-justify" value={cert.description} onChange={v => updateField(`certificates.${itemIndex}.description`, v)} />
                                                        <div>
                                                            <EditableText as="a" className="text-[#2551A5] hover:underline" value={cert.credentialUrl} onChange={v => updateField(`certificates.${itemIndex}.credentialUrl`, v)} />
                                                        </div>
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
                                        {...SectionHeadingOptions}
                                        headerExtension={<HeaderChildren />}
                                        onAdd={() => addItem('projects', {
                                            title: "Project Name", position: "Role/Position", description: "Project Description", startDate: "", endDate: "", isCurrent: false, projectUrl: "https://project-url.com", projectType: "PROFESSIONAL", teamSize: 1
                                        })}
                                    >
                                        <div className="flex flex-col gap-5 print:block print:space-y-4">
                                            {cvData.projects.map((proj, itemIndex) => (
                                                <EditableItemWrapper key={proj.id} id={proj.id} section="projects" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.projects.length - 1} contentClassName="pl-0">
                                                    <div className="flex flex-col text-[13px] text-gray-900 leading-relaxed print:break-inside-avoid">
                                                        <div className="flex justify-between items-start gap-2 mb-1">
                                                            <div className="flex-1 font-bold">
                                                                <EditableText as="span" value={proj.title} onChange={v => updateField(`projects.${itemIndex}.title`, v)} />
                                                                <span>&nbsp;-&nbsp;</span>
                                                                <InlineSelect value={proj.projectType} options={projectTypeOptions} onChange={v => updateField(`projects.${itemIndex}.projectType`, v)} />
                                                            </div>
                                                            <div className="flex-shrink-0 text-right font-bold whitespace-nowrap">
                                                                <EditableDateRange
                                                                    startDate={proj.startDate}
                                                                    endDate={proj.endDate}
                                                                    isCurrent={proj.isCurrent}
                                                                    onStartDateChange={v => updateField(`projects.${itemIndex}.startDate`, v)}
                                                                    onEndDateChange={v => updateField(`projects.${itemIndex}.endDate`, v)}
                                                                    onIsCurrentChange={v => updateField(`projects.${itemIndex}.isCurrent`, v)}
                                                                    className="px-1 py-0.5 hover:bg-gray-100 rounded"
                                                                />
                                                            </div>
                                                        </div>
                                                        <EditableText as="div" className="text-justify whitespace-pre-line text-[13px] leading-[1.6] mb-1.5" value={proj.description} onChange={v => updateField(`projects.${itemIndex}.description`, v)} />

                                                        <ul className="list-disc list-inside ml-2 space-y-0.5">
                                                            <li className="flex items-center gap-1 group">
                                                                <strong>Position:</strong>
                                                                <EditableText as="span" className="min-w-[30px]" value={proj.position} onChange={v => updateField(`projects.${itemIndex}.position`, v)} />
                                                            </li>
                                                            <li className="flex items-center gap-1 group">
                                                                <strong>Team Size:</strong>
                                                                <EditableText as="span" type="number" className="min-w-[20px]" value={proj.teamSize} onChange={v => updateField(`projects.${itemIndex}.teamSize`, v)} />
                                                            </li>
                                                            <li className="flex items-center gap-1 group">
                                                                <strong>URL:</strong>
                                                                <EditableText as="a" className="text-[#2551A5] hover:underline" value={proj.projectUrl} onChange={v => updateField(`projects.${itemIndex}.projectUrl`, v)} />
                                                            </li>
                                                        </ul>
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

export default ProfessionalTemplate;
