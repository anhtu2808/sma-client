import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const ModernMinimalistTemplate = ({
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
            {/* Header (Name, Title) */}
            <div className="px-12 pt-12 pb-6">
                <EditableText
                    as="h1"
                    className="text-4xl font-bold text-[#1F8A70] uppercase mb-2"
                    value={cvData.personalInfo.fullName}
                    onChange={(val) => updateField('personalInfo.fullName', val)}
                />
                <div className="flex items-center gap-3 text-gray-600 font-medium">
                    <EditableText
                        value={cvData.personalInfo.title}
                        onChange={(val) => updateField('personalInfo.title', val)}
                    />
                    <span className="text-gray-400">|</span>
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
                        <button className="absolute inset-0 m-auto w-10 h-10 bg-white/90 rounded-full shadow-sm flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <LucideIcons.Camera size={18} />
                        </button>
                    </div>

                    {/* Objective */}
                    <SectionWrapper title="Mục Tiêu Nghề Nghiệp" sectionKey="objective">
                        <EditableText
                            as="p"
                            className="text-sm text-gray-600 leading-relaxed text-justify"
                            value={cvData.objective}
                            onChange={(val) => updateField('objective', val)}
                            multiline
                        />
                    </SectionWrapper>

                    {/* Personal Details */}
                    <SectionWrapper title="Thông Tin Cá Nhân" sectionKey="personalDetails">
                        <div className="flex flex-col gap-3 text-sm">
                            <div className="grid grid-cols-[110px_1fr] items-center">
                                <span className="text-gray-500">Ngày sinh</span>
                                <EditableText className="font-medium text-gray-800" value={cvData.personalDetails.dob} onChange={v => updateField('personalDetails.dob', v)} />
                            </div>
                            <div className="grid grid-cols-[110px_1fr] items-center">
                                <span className="text-gray-500">Quốc tịch</span>
                                <EditableText className="font-medium text-gray-800" value={cvData.personalDetails.nationality} onChange={v => updateField('personalDetails.nationality', v)} />
                            </div>
                            <div className="grid grid-cols-[110px_1fr] items-center">
                                <span className="text-gray-500">Tình trạng hôn nhân</span>
                                <EditableText className="font-medium text-gray-800" value={cvData.personalDetails.maritalStatus} onChange={v => updateField('personalDetails.maritalStatus', v)} />
                            </div>
                            <div className="grid grid-cols-[110px_1fr] items-center">
                                <span className="text-gray-500">Giới tính</span>
                                <EditableText className="font-medium text-gray-800" value={cvData.personalDetails.gender} onChange={v => updateField('personalDetails.gender', v)} />
                            </div>
                        </div>
                    </SectionWrapper>

                    {/* Languages */}
                    <SectionWrapper
                        title="Ngoại Ngữ"
                        sectionKey="languages"
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
                    <SectionWrapper title="Kỹ Năng" sectionKey="skills" onAdd={() => {
                        updateField('skills', ['Kỹ năng mới', ...cvData.skills]);
                    }}>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-700">
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
                    <SectionWrapper title="Thông Tin Liên Hệ" sectionKey="contact">
                        <div className="flex flex-col gap-3 text-sm text-gray-700">
                            <div className="flex gap-3">
                                <Mail size={16} className="text-[#1F8A70] mt-0.5 min-w-[16px]" />
                                <EditableText value={cvData.contact.email} onChange={v => updateField('contact.email', v)} />
                            </div>
                            <div className="flex gap-3">
                                <Phone size={16} className="text-[#1F8A70] mt-0.5 min-w-[16px]" />
                                <EditableText value={cvData.contact.phone} onChange={v => updateField('contact.phone', v)} />
                            </div>
                            <div className="flex gap-3">
                                <MapPin size={16} className="text-[#1F8A70] mt-0.5 min-w-[16px]" />
                                <EditableText value={cvData.contact.address} onChange={v => updateField('contact.address', v)} />
                            </div>
                        </div>
                    </SectionWrapper>

                </div>

                {/* Right Column (65%) */}
                <div className="w-[65%] flex flex-col gap-8 relative">
                    {/* Vertical line connecting sections */}
                    <div className="absolute left-[-13px] top-2 bottom-0 w-px border-l-[1.5px] border-dashed border-[#1F8A70]/30" />

                    {sectionOrder.map((sectionKey, index) => {
                        const isFirst = index === 0;
                        const isLast = index === sectionOrder.length - 1;

                        switch (sectionKey) {
                            case 'experience':
                                return (
                                    <SectionWrapper
                                        key={sectionKey}
                                        title="Kinh Nghiệm Làm Việc"
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
                                        title="Học Vấn"
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
                                        title="Chứng Chỉ"
                                        sectionKey="certificates"
                                        index={index}
                                        isFirst={isFirst}
                                        isLast={isLast}
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
                            case 'activities':
                                return (
                                    <SectionWrapper
                                        key={sectionKey}
                                        title="Hoạt Động"
                                        sectionKey="activities"
                                        index={index}
                                        isFirst={isFirst}
                                        isLast={isLast}
                                        onAdd={() => addItem('activities', {
                                            name: "Tên hoạt động", role: "Vai trò", dateRange: "MM/YYYY - MM/YYYY", description: "Mô tả"
                                        })}
                                    >
                                        <div className="flex flex-col gap-6">
                                            {cvData.activities.map((act, itemIndex) => (
                                                <EditableItemWrapper key={act.id} id={act.id} section="activities" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.activities.length - 1}>
                                                    <div className="flex flex-col gap-1">
                                                        <EditableText as="h4" className="font-bold text-gray-900" value={act.name} onChange={v => {
                                                            const dt = [...cvData.activities]; dt[itemIndex].name = v; updateField('activities', dt);
                                                        }} />
                                                        <EditableText as="p" className="text-gray-600" value={act.role} onChange={v => {
                                                            const dt = [...cvData.activities]; dt[itemIndex].role = v; updateField('activities', dt);
                                                        }} />
                                                        <EditableText as="p" className="text-gray-500 text-xs font-medium mb-1" value={act.dateRange} onChange={v => {
                                                            const dt = [...cvData.activities]; dt[itemIndex].dateRange = v; updateField('activities', dt);
                                                        }} />
                                                        <EditableText as="p" className="text-sm text-gray-600 leading-relaxed text-justify" value={act.description} onChange={v => {
                                                            const dt = [...cvData.activities]; dt[itemIndex].description = v; updateField('activities', dt);
                                                        }} />
                                                    </div>
                                                </EditableItemWrapper>
                                            ))}
                                        </div>
                                    </SectionWrapper>
                                );
                            case 'references':
                                return (
                                    <SectionWrapper
                                        key={sectionKey}
                                        title="Người Tham Khảo"
                                        sectionKey="references"
                                        index={index}
                                        isFirst={isFirst}
                                        isLast={isLast}
                                        onAdd={() => addItem('references', {
                                            name: "Tên", title: "Chức vụ", contact: "Liên hệ"
                                        })}
                                    >
                                        <div className="flex flex-col gap-4">
                                            {cvData.references.map((ref, itemIndex) => (
                                                <EditableItemWrapper key={ref.id} id={ref.id} section="references" index={itemIndex} isFirst={itemIndex === 0} isLast={itemIndex === cvData.references.length - 1}>
                                                    <div className="flex flex-col gap-1">
                                                        <EditableText as="h4" className="font-bold text-gray-900" value={ref.name} onChange={v => {
                                                            const dt = [...cvData.references]; dt[itemIndex].name = v; updateField('references', dt);
                                                        }} />
                                                        <EditableText as="p" className="text-gray-600 text-sm" value={ref.title} onChange={v => {
                                                            const dt = [...cvData.references]; dt[itemIndex].title = v; updateField('references', dt);
                                                        }} />
                                                        <EditableText as="p" className="text-gray-600 text-sm" value={ref.contact} onChange={v => {
                                                            const dt = [...cvData.references]; dt[itemIndex].contact = v; updateField('references', dt);
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
