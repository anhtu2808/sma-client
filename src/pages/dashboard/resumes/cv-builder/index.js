import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { api } from "@/apis/baseApi";
import toastMessage from "@/utils/toastMessage";
import Loading from "@/components/Loading";
import dayjs from "dayjs";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import {
    ArrowUp, ArrowDown, Trash2, Plus,
    Download, Save, FileCheck,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import ModernMinimalistTemplate from "./templates/ModernMinimalistTemplate";
import ExecutiveProfessionalTemplate from "./templates/ExecutiveProfessionalTemplate";
import CreativeStudioTemplate from "./templates/CreativeStudioTemplate";
import TechInnovatorTemplate from "./templates/TechInnovatorTemplate";
import PropertiesSidebar from "./PropertiesSidebar";
import Button from "@/components/Button";
import {
    useGetResumeQuery,
    useUploadFilesMutation,
    useCreateResumeExperienceMutation,
    useUpdateResumeExperienceMutation,
    useCreateResumeExperienceDetailMutation,
    useUpdateResumeExperienceDetailMutation,
    useDeleteResumeExperienceMutation,
    useCreateResumeEducationMutation,
    useUpdateResumeEducationMutation,
    useDeleteResumeEducationMutation,
    useCreateResumeCertificationMutation,
    useUpdateResumeCertificationMutation,
    useDeleteResumeCertificationMutation,
    useCreateResumeProjectMutation,
    useUpdateResumeProjectMutation,
    useDeleteResumeProjectMutation,
    useCreateResumeSkillMutation,
    useUpdateResumeSkillMutation,
    useDeleteResumeSkillMutation,
    useUpdateCandidateResumeMutation,
    useExportResumeToOriginalMutation,
} from "@/apis/resumeApi";
import { useGetSkillsQuery } from "@/apis/skillApi";

import { CvBuilderContext } from "./CvBuilderContext";
import { EditableText } from "./components/EditableText";
import { EditableDateRange } from "./components/EditableDateRange";
import { SectionWrapper } from "./components/SectionWrapper";
import { EditableItemWrapper } from "./components/EditableItemWrapper";
import { SkillSelector } from "./components/SkillSelector";
import InlineSelect from "./components/InlineSelect";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '../../../../utils/icons';

// --- Date formatting helper ---

const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};



export default function CvBuilder({ onBack }) {
    const { id: paramResumeId } = useParams();
    const [searchParams] = useSearchParams();
    const resumeId = paramResumeId || searchParams.get("resumeId");
    const navigate = useNavigate();
    const pdfRef = useRef(null);
    const avatarInputRef = useRef(null);

    const dispatch = useDispatch();
    const [uploadFiles] = useUploadFilesMutation();
    const [createExperience] = useCreateResumeExperienceMutation();
    const [updateExperience] = useUpdateResumeExperienceMutation();
    const [createExperienceDetail] = useCreateResumeExperienceDetailMutation();
    const [updateExperienceDetail] = useUpdateResumeExperienceDetailMutation();
    const [createEducation] = useCreateResumeEducationMutation();
    const [updateEducation] = useUpdateResumeEducationMutation();
    const [createCertification] = useCreateResumeCertificationMutation();
    const [updateCertification] = useUpdateResumeCertificationMutation();
    const [createProject] = useCreateResumeProjectMutation();
    const [updateProject] = useUpdateResumeProjectMutation();
    const [deleteProject] = useDeleteResumeProjectMutation();
    const [createSkill] = useCreateResumeSkillMutation();
    const [updateSkill] = useUpdateResumeSkillMutation();
    const [deleteSkill] = useDeleteResumeSkillMutation();
    const [deleteExperience] = useDeleteResumeExperienceMutation();
    const [deleteEducation] = useDeleteResumeEducationMutation();
    const [deleteCertification] = useDeleteResumeCertificationMutation();
    const [updateCandidateResume] = useUpdateCandidateResumeMutation();
    const [exportResumeToOriginal] = useExportResumeToOriginalMutation();
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [activeSection, setActiveSection] = useState(null);


    const { data: resumeData, isLoading: isFetchingResume, refetch } = useGetResumeQuery(
        { resumeId },
        { skip: !resumeId }
    );

    const handleDownloadPdf = () => {
        window.print();
    };

    const handleExportToApply = async () => {
        if (!resumeId) return toastMessage.error("Resume not found.");
        setIsExporting(true);
        try {
            const element = pdfRef.current;

            // Convert cross-origin avatar to inline base64 so html2canvas can render it
            const avatarImg = element.querySelector('img[alt="Avatar"]');
            let originalSrc = null;
            if (avatarImg && avatarImg.src && !avatarImg.src.startsWith('data:')) {
                originalSrc = avatarImg.src;
                try {
                    const response = await fetch(avatarImg.src);
                    const blob = await response.blob();
                    const dataUrl = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                    avatarImg.src = dataUrl;
                } catch (e) {
                    console.warn("Could not convert avatar to base64, it may be missing in PDF:", e);
                }
            }

            const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });

            // Restore original avatar src after capture
            if (originalSrc) {
                avatarImg.src = originalSrc;
            }

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            let heightLeft = imgHeight, position = 0;
            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            const pdfBlob = pdf.output("blob");
            const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
            if (pdfBlob.size > MAX_FILE_SIZE) {
                toastMessage.error("Exported PDF exceeds 10MB. Please reduce CV content and try again.");
                return;
            }

            const fileName = `${cvData.personalInfo?.fullName || "Resume"}_CV.pdf`;
            const formData = new FormData();
            formData.append("files", new File([pdfBlob], fileName, { type: "application/pdf" }));
            const uploadResult = await uploadFiles(formData).unwrap();
            const uploadedUrl = (Array.isArray(uploadResult) ? uploadResult[0] : uploadResult)?.downloadUrl;
            if (!uploadedUrl) throw new Error("Upload failed");

            await exportResumeToOriginal({ resumeId, payload: { resumeUrl: uploadedUrl, fileName } }).unwrap();
            toastMessage.success("CV exported! You can now use it to apply for jobs.");
            navigate("/dashboard/resumes");
        } catch (err) {
            console.error("Export to apply error:", err);
            toastMessage.error("Failed to export CV. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    // Initial State with API-compatible field names
    const [cvData, setCvData] = useState({
        personalInfo: {
            fullName: "Your Name",
            jobTitle: "Your Job Title",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        },
        skills: [],
        contact: {
            emailInResume: "mail@fpt.edu.vn",
            phoneInResume: "+84",
            addressInResume: "District 9, Ho Chi Minh, Viet Nam",
            githubLink: "github.com/username",
            linkedinLink: "linkedin.com/in/username",
            portfolioLink: "portfolio.dev"
        },
        experience: [
            {
                id: "exp_1",
                title: "Job Title",
                company: "Company Name",
                startDate: "2016-01-01",
                endDate: "2023-01-01",
                isCurrent: false,
                workingModel: "ONSITE",
                employmentType: "FULL_TIME",
                description: "Job Description"
            },
        ],
        education: [
            {
                id: "edu_1",
                institution: "University Name",
                degree: "Degree",
                majorField: "Major Field",
                gpa: 0,
                startDate: "2016-09-01",
                endDate: "2020-07-01",
                isCurrent: false,
            }
        ],
        certificates: [
            {
                id: "cert_1",
                name: "Certificate Name",
                issuer: "Certificate Issuer",
                credentialUrl: "https://www.sample.site/PSPO1.pdf",
                description: "Certificate Description"
            },
        ],
        projects: [
            {
                id: "proj_1",
                title: "Project Name",
                position: "Project Position",
                description: "Project Description",
                startDate: "2022-01-01",
                endDate: "2023-06-01",
                isCurrent: false,
                projectUrl: "https://project.vn",
                teamSize: 0,
                projectType: "PROFESSIONAL",
            }
        ],
    });

    useEffect(() => {
        if (resumeData) {
            setCvData(prevData => ({
                ...prevData,
                personalInfo: {
                    ...prevData.personalInfo,
                    fullName: resumeData.fullName || prevData.personalInfo.fullName,
                    jobTitle: resumeData.jobTitle || prevData.personalInfo.jobTitle,
                    avatar: resumeData.avatar || prevData.personalInfo.avatar,
                },
                contact: {
                    ...prevData.contact,
                    emailInResume: resumeData.emailInResume || prevData.contact.emailInResume,
                    phoneInResume: resumeData.phoneInResume || prevData.contact.phoneInResume,
                    addressInResume: resumeData.addressInResume || prevData.contact.addressInResume,
                    githubLink: resumeData.githubLink || prevData.contact.githubLink,
                    linkedinLink: resumeData.linkedinLink || prevData.contact.linkedinLink,
                    portfolioLink: resumeData.portfolioLink || prevData.contact.portfolioLink
                },
                skills: resumeData.skillGroups && resumeData.skillGroups.length > 0
                    ? resumeData.skillGroups.flatMap(g => g.skills?.map(s => ({
                        id: s.id,
                        skillId: s.skillId || s.id,
                        skillName: s.name || s.skillName,
                        groupName: g.name || "Skills",
                        yearsOfExperience: s.yearsOfExperience || 0,
                    })) || [])
                    : prevData.skills,
                experience: resumeData.experiences && resumeData.experiences.length > 0
                    ? resumeData.experiences.map(exp => ({
                        id: exp.id || `exp_${Date.now()}_${Math.random()}`,
                        detailId: exp.details?.[0]?.id || null, // Capture detail ID for PUT updates
                        title: exp.details?.[0]?.title || exp.title || "",
                        company: exp.company || "",
                        startDate: exp.startDate || "",
                        endDate: exp.endDate || "",
                        isCurrent: exp.isCurrent || false,
                        description: exp.details?.[0]?.description || exp.description || "",
                        workingModel: exp.workingModel || null,
                        employmentType: exp.employmentType || null,
                    }))
                    : prevData.experience,
                education: resumeData.educations && resumeData.educations.length > 0
                    ? resumeData.educations.map(edu => ({
                        id: edu.id || `edu_${Date.now()}_${Math.random()}`,
                        institution: edu.institution || "",
                        degree: edu.degree || "",
                        majorField: edu.majorField || "",
                        gpa: edu.gpa || 0,
                        startDate: edu.startDate || "",
                        endDate: edu.endDate || "",
                        isCurrent: edu.isCurrent || false,
                    }))
                    : prevData.education,
                certificates: resumeData.certifications && resumeData.certifications.length > 0
                    ? resumeData.certifications.map(cert => ({
                        id: cert.id || `cert_${Date.now()}_${Math.random()}`,
                        name: cert.name || "",
                        issuer: cert.issuer || "",
                        credentialUrl: cert.credentialUrl || "",
                        description: cert.description || "",
                    }))
                    : prevData.certificates,
                projects: resumeData.projects && resumeData.projects.length > 0
                    ? resumeData.projects.map(proj => ({
                        id: proj.id || `proj_${Date.now()}_${Math.random()}`,
                        title: proj.title || "",
                        position: proj.position || "",
                        description: proj.description || "",
                        startDate: proj.startDate || "",
                        endDate: proj.endDate || "",
                        isCurrent: proj.isCurrent || false,
                        projectUrl: proj.projectUrl || "",
                        teamSize: proj.teamSize || null,
                        projectType: proj.projectType || null,
                    }))
                    : prevData.projects,
            }));
        }
    }, [resumeData]);

    const [sectionOrder, setSectionOrder] = useState([
        "experience",
        "education",
        "certificates",
        "projects"
    ]);

    useEffect(() => {
        if (resumeId) {
            const savedOrder = localStorage.getItem(`cv_layout_${resumeId}`);
            if (savedOrder) {
                try {
                    setSectionOrder(JSON.parse(savedOrder));
                    return;
                } catch (e) {
                    console.warn("Failed to parse saved section layout, reverting to default.", e);
                }
            }
        }
        // Fallback to default if no saved layout or on new resumes
        setSectionOrder([
            "experience",
            "education",
            "certificates",
            "projects"
        ]);
    }, [resumeId]);

    const [hoveredSection, setHoveredSection] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);

    const [contactVisibility, setContactVisibility] = useState({
        githubLink: true,
        linkedinLink: true,
        portfolioLink: true
    });

    const toggleContactVisibility = (key) => {
        setContactVisibility(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // --- Actions ---
    const updateField = (path, value) => {
        const keys = path.split('.');
        setCvData(prev => {
            const newData = { ...prev };
            let current = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    const moveItem = (section, index, direction) => {
        setCvData(prev => {
            const newList = [...prev[section]];
            if (direction === 'up' && index > 0) {
                [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
            } else if (direction === 'down' && index < newList.length - 1) {
                [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
            }
            return { ...prev, [section]: newList };
        });
    };

    const moveSection = (index, direction) => {
        setSectionOrder(prev => {
            const newList = [...prev];
            if (direction === 'up' && index > 0) {
                [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
            } else if (direction === 'down' && index < newList.length - 1) {
                [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
            }
            return newList;
        });
    };

    const removeSection = (sectionKey) => {
        setSectionOrder(prev => prev.filter(key => key !== sectionKey));
    };

    const addSection = (sectionKey) => {
        setSectionOrder(prev => {
            if (prev.includes(sectionKey)) return prev;
            return [...prev, sectionKey];
        });
    };

    const deleteItem = async (section, id) => {
        // If it does not start with typical local prefixes, it's likely a saved item.
        const isNew = String(id).startsWith(section + "_") || String(id).startsWith("exp_") || String(id).startsWith("experience_") || String(id).startsWith("edu_") || String(id).startsWith("education_") || String(id).startsWith("proj_") || String(id).startsWith("projects_") || String(id).startsWith("cert_") || String(id).startsWith("certificates_") || String(id).startsWith("skill_");

        if (!isNew && resumeId) {
            try {
                if (section === 'experience') {
                    await deleteExperience({ resumeId, experienceId: id }).unwrap();
                } else if (section === 'education') {
                    await deleteEducation({ resumeId, educationId: id }).unwrap();
                } else if (section === 'projects') {
                    await deleteProject({ resumeId, projectId: id }).unwrap();
                } else if (section === 'certificates') {
                    await deleteCertification({ resumeId, certificationId: id }).unwrap();
                } else if (section === 'skills') {
                    await deleteSkill({ resumeId, resumeSkillId: id }).unwrap();
                }
            } catch (error) {
                console.error("Delete API error:", error);
            }
        }

        setCvData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };

    const addItem = (section, defaultItem) => {
        setCvData(prev => ({
            ...prev,
            [section]: [{ ...defaultItem, id: `${section}_${Date.now()}` }, ...prev[section]]
        }));
    };


    // --- Save Handler ---
    const handleSave = async () => {
        if (!resumeId) {
            toastMessage.error("Không tìm thấy Resume ID.");
            return;
        }

        setIsSaving(true);
        try {
            // Save personal info
            try {
                const currentTemplate = searchParams.get('template') || 'tpl_modern_1';
                await updateCandidateResume({
                    resumeId,
                    payload: {
                        resumeName: `[${currentTemplate}] ${cvData.personalInfo.fullName || 'My Resume'}`,
                        fileName: `[${currentTemplate}] ${cvData.personalInfo.fullName || 'My Resume'}.pdf`,
                        fullName: cvData.personalInfo.fullName,
                        jobTitle: cvData.personalInfo.jobTitle,
                        avatar: cvData.personalInfo.avatar,
                        addressInResume: cvData.contact.addressInResume,
                        phoneInResume: cvData.contact.phoneInResume,
                        emailInResume: cvData.contact.emailInResume,
                        githubLink: cvData.contact.githubLink,
                        linkedinLink: cvData.contact.linkedinLink,
                        portfolioLink: cvData.contact.portfolioLink
                    }
                }).unwrap();
            } catch (err) {
                console.warn("Failed to save personal info to profile. Continuing with other sections.", err);
            }

            // Delete removed experiences before saving
            const currentExpIds = cvData.experience.map(e => String(e.id));
            const originalExpIds = resumeData?.experiences?.map(e => String(e.id)) || [];
            const deletedExpIds = originalExpIds.filter(id => !currentExpIds.includes(id));
            for (const id of deletedExpIds) {
                if (!id.startsWith("exp_") && !id.startsWith("experience_")) {
                    try {
                        await deleteExperience({ resumeId, experienceId: id }).unwrap();
                    } catch (e) {
                        console.warn("Delete experience error or already deleted:", e);
                    }
                }
            }

            // Save experiences with details
            for (let i = 0; i < cvData.experience.length; i++) {
                const exp = cvData.experience[i];
                const isNew = String(exp.id).startsWith("exp_") || String(exp.id).startsWith("experience_");

                let expResultId = exp.id;

                if (isNew) {
                    const expResult = await createExperience({
                        resumeId,
                        payload: {
                            company: exp.company,
                            startDate: exp.startDate || null,
                            endDate: exp.endDate || null,
                            isCurrent: exp.isCurrent || false,
                            workingModel: exp.workingModel || null,
                            employmentType: exp.employmentType || null,
                            orderIndex: i,
                        }
                    }).unwrap();
                    expResultId = expResult?.id;

                    // Immediately update local state with server ID to prevent
                    // duplicate items when refetch + useEffect runs later
                    const oldExpId = exp.id;
                    setCvData(prev => ({
                        ...prev,
                        experience: prev.experience.map(e =>
                            e.id === oldExpId ? { ...e, id: expResultId } : e
                        ),
                    }));
                } else {
                    await updateExperience({
                        resumeId,
                        experienceId: exp.id,
                        payload: {
                            company: exp.company,
                            startDate: exp.startDate || null,
                            endDate: exp.endDate || null,
                            isCurrent: exp.isCurrent || false,
                            workingModel: exp.workingModel || null,
                            employmentType: exp.employmentType || null,
                            orderIndex: i,
                        }
                    }).unwrap();
                }

                // Create or update experience detail (title + description)
                if (expResultId) {
                    if (isNew || !exp.detailId) {
                        const detailResult = await createExperienceDetail({
                            resumeId,
                            experienceId: expResultId,
                            payload: {
                                title: exp.title || "",
                                description: exp.description || "",
                                startDate: exp.startDate || null,
                                endDate: exp.endDate || null,
                                isCurrent: exp.isCurrent || false,
                                orderIndex: 0,
                            }
                        }).unwrap();

                        // Update detailId so subsequent saves use update instead of create
                        setCvData(prev => ({
                            ...prev,
                            experience: prev.experience.map(e =>
                                e.id === expResultId ? { ...e, detailId: detailResult?.id } : e
                            ),
                        }));
                    } else {
                        await updateExperienceDetail({
                            resumeId,
                            experienceDetailId: exp.detailId,
                            payload: {
                                title: exp.title || "",
                                description: exp.description || "",
                                startDate: exp.startDate || null,
                                endDate: exp.endDate || null,
                                isCurrent: exp.isCurrent || false,
                                orderIndex: 0,
                            }
                        }).unwrap();
                    }
                }
            }

            // Delete removed educations before saving
            const currentEduIds = cvData.education.map(e => String(e.id));
            const originalEduIds = resumeData?.educations?.map(e => String(e.id)) || [];
            const deletedEduIds = originalEduIds.filter(id => !currentEduIds.includes(id));
            for (const id of deletedEduIds) {
                if (!id.startsWith("edu_") && !id.startsWith("education_")) {
                    try {
                        await deleteEducation({ resumeId, educationId: id }).unwrap();
                    } catch (e) {
                        console.warn("Delete education error or already deleted:", e);
                    }
                }
            }

            // Save educations
            for (let i = 0; i < cvData.education.length; i++) {
                const edu = cvData.education[i];
                const isNew = String(edu.id).startsWith("edu_") || String(edu.id).startsWith("education_");

                const payload = {
                    institution: edu.institution,
                    degree: edu.degree || "BACHELOR",
                    majorField: edu.majorField || "",
                    gpa: edu.gpa || 0,
                    startDate: edu.startDate || null,
                    endDate: edu.endDate || null,
                    isCurrent: edu.isCurrent || false,
                    orderIndex: i,
                };

                if (isNew) {
                    await createEducation({
                        resumeId,
                        payload
                    }).unwrap();
                } else {
                    await updateEducation({
                        resumeId,
                        educationId: edu.id,
                        payload
                    }).unwrap();
                }
            }

            // Delete removed certifications before saving
            const currentCertIds = cvData.certificates.map(e => String(e.id));
            const originalCertIds = resumeData?.certifications?.map(e => String(e.id)) || [];
            const deletedCertIds = originalCertIds.filter(id => !currentCertIds.includes(id));
            for (const id of deletedCertIds) {
                if (!id.startsWith("cert_") && !id.startsWith("certificates_")) {
                    try {
                        await deleteCertification({ resumeId, certificationId: id }).unwrap();
                    } catch (e) {
                        console.warn("Delete certification error or already deleted:", e);
                    }
                }
            }

            // Save certifications
            for (const cert of cvData.certificates) {
                const isNew = String(cert.id).startsWith("cert_") || String(cert.id).startsWith("certificates_");

                const payload = {
                    name: cert.name,
                    issuer: cert.issuer || "",
                    credentialUrl: cert.credentialUrl || "",
                    description: cert.description || "",
                };

                if (isNew) {
                    await createCertification({
                        resumeId,
                        payload
                    }).unwrap();
                } else {
                    await updateCertification({
                        resumeId,
                        certificationId: cert.id,
                        payload
                    }).unwrap();
                }
            }

            // Delete removed projects before saving
            const currentProjIds = cvData.projects.map(e => String(e.id));
            const originalProjIds = resumeData?.projects?.map(e => String(e.id)) || [];
            const deletedProjIds = originalProjIds.filter(id => !currentProjIds.includes(id));
            for (const id of deletedProjIds) {
                if (!id.startsWith("proj_") && !id.startsWith("projects_")) {
                    try {
                        await deleteProject({ resumeId, projectId: id }).unwrap();
                    } catch (e) {
                        console.warn("Delete project error or already deleted:", e);
                    }
                }
            }

            // Save projects
            for (let i = 0; i < cvData.projects.length; i++) {
                const proj = cvData.projects[i];
                const isNew = String(proj.id).startsWith("proj_") || String(proj.id).startsWith("projects_");

                const payload = {
                    title: proj.title,
                    position: proj.position || "",
                    description: proj.description || "",
                    startDate: proj.startDate || null,
                    endDate: proj.endDate || null,
                    isCurrent: proj.isCurrent || false,
                    projectUrl: proj.projectUrl || "",
                    teamSize: proj.teamSize || null,
                    projectType: proj.projectType || null,
                    orderIndex: i,
                };

                if (isNew) {
                    await createProject({
                        resumeId,
                        payload
                    }).unwrap();
                } else {
                    await updateProject({
                        resumeId,
                        projectId: proj.id,
                        payload
                    }).unwrap();
                }
            }

            // Delete removed skills before saving
            const currentSkillIds = cvData.skills.map(s => String(s.id));
            const originalSkills = resumeData?.skillGroups?.flatMap(g => g.skills) || [];
            const deletedSkills = originalSkills.filter(s => !currentSkillIds.includes(String(s.id)));
            for (const s of deletedSkills) {
                if (!String(s.id).startsWith("skill_")) {
                    try {
                        await deleteSkill({ resumeId, resumeSkillId: s.id }).unwrap();
                    } catch (e) {
                        console.warn("Delete skill error or already deleted:", e);
                    }
                }
            }

            // Save skills
            for (const skill of cvData.skills) {
                const isNew = String(skill.id).startsWith("skill_") || !skill.id;

                const payload = {
                    skillId: skill.skillId,
                    yearsOfExperience: skill.yearsOfExperience || 0,
                    groupName: skill.groupName || "Skills",
                };

                if (isNew) {
                    await createSkill({
                        resumeId,
                        payload
                    }).unwrap();
                } else {
                    await updateSkill({
                        resumeId,
                        resumeSkillId: skill.id, // Using correct relation ID
                        payload
                    }).unwrap();
                }
            }

            // Save section order to localStorage against this specific resume
            if (sectionOrder && sectionOrder.length > 0) {
                localStorage.setItem(`cv_layout_${resumeId}`, JSON.stringify(sectionOrder));
            }

            toastMessage.success("Save CV successfully!");
            dispatch(api.util.invalidateTags(['Resumes']));
            await refetch();
        } catch (error) {
            console.error("Save error:", error);
            toastMessage.error("Có lỗi xảy ra khi lưu CV. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    };



    const templateId = searchParams.get('template') || 'tpl_modern_1';

    let TemplateComponent = ModernMinimalistTemplate;
    if (templateId === 'tpl_prof_1') TemplateComponent = ExecutiveProfessionalTemplate;
    if (templateId === 'tpl_creative_1') TemplateComponent = CreativeStudioTemplate;
    if (templateId === 'tpl_modern_2') TemplateComponent = TechInnovatorTemplate;

    const handleAvatarUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toastMessage.error('Chỉ hỗ trợ file ảnh (PNG, JPG, JPEG, GIF).');
            event.target.value = '';
            return;
        }

        try {
            const formData = new FormData();
            formData.append('files', file);

            const uploadedFiles = await uploadFiles(formData).unwrap();
            const uploadedFile = Array.isArray(uploadedFiles) ? uploadedFiles[0] : null;

            if (!uploadedFile?.downloadUrl) {
                throw new Error('Upload failed');
            }

            updateField('personalInfo.avatar', uploadedFile.downloadUrl);
            toastMessage.success('Cập nhật ảnh đại diện thành công!');
        } catch (error) {
            console.error('Avatar upload error:', error);
            toastMessage.error('Có lỗi xảy ra khi tải ảnh lên.');
        } finally {
            event.target.value = '';
        }
    };

    const templateProps = {
        cvData,
        sectionOrder,
        updateField,
        addItem,
        EditableText,
        SectionWrapper,
        EditableItemWrapper,
        SkillSelector,
        InlineSelect,
        LucideIcons,
        avatarInputRef,
        contactVisibility,
        toggleContactVisibility,
        formatDateDisplay,
        EditableDateRange,
    };

    if (isFetchingResume) {
        return (
            <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center gap-4">
                <Loading size={60} />
                <span className="text-gray-500 font-medium font-sans">Đang tải dữ liệu hồ sơ...</span>
            </div>
        );
    }

    return (
        <CvBuilderContext.Provider value={{ activeSection, setActiveSection, cvData, updateField, moveSection, removeSection, moveItem, deleteItem }}>
            <div className="flex h-screen overflow-hidden bg-[#F3F4F6] print:bg-white print:h-auto print:block print:overflow-visible">
                {/* Properties Sidebar on the Left */}
                <div className="print:hidden">
                    <PropertiesSidebar activeSection={activeSection} cvData={cvData} updateField={updateField} sectionOrder={sectionOrder} addSection={addSection} />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto flex flex-col relative pb-12 print:block print:overflow-visible print:pb-0" onClick={() => setActiveSection(null)}>
                    {/* Top Toolbar */}
                    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 print:hidden">
                        <div className="flex items-center gap-6">
                            <Button mode="ghost" onClick={() => navigate('/dashboard/resumes')} className="text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center gap-1">
                                <FontAwesomeIcon icon={faArrowLeft} className="text-[16px]" />
                                Back
                            </Button>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                mode="secondary"
                                shape="rounded"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                            >
                                {isSaving ? <Loading size={16} inline /> : <Save size={16} />}
                                {isSaving ? "Saving..." : "Save CV"}
                            </Button>
                            <Button
                                mode="primary"
                                shape="rounded"
                                onClick={handleDownloadPdf}
                                className="px-4 py-2 bg-[#1F8A70] text-white rounded-md text-sm font-medium hover:bg-[#19755f] flex items-center gap-2">
                                <Download size={16} /> Download PDF
                            </Button>
                            <Button
                                mode="primary"
                                shape="rounded"
                                onClick={handleExportToApply}
                                disabled={isExporting || isSaving}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                            >
                                {isExporting ? <Loading size={16} inline /> : <FileCheck size={16} />}
                                {isExporting ? "Exporting..." : "Export to Apply"}
                            </Button>
                        </div>
                    </div>

                    {/* Selected Template Component */}
                    <div ref={pdfRef} className="print-cv-section shadow-none">
                        <TemplateComponent {...templateProps} />
                    </div>

                    {/* Hidden file input for avatar upload */}
                    <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                    />
                </div>
            </div>
        </CvBuilderContext.Provider>
    );
}
