import React, { useState } from "react";
import { Col, Row } from "antd";
import toastMessage from "@/utils/toastMessage";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TemplateCard } from "../resume-card";
import UseTemplateModal from "./UseTemplateModal";
import { useCreateResumeBuilderMutation, useCloneResumeBuilderMutation } from "@/apis/resumeApi";

import ExecutiveProfessionalImg from "@/assets/template/ExecutiveProfessional.png";
import ProfessionalATSImg from "@/assets/template/ProfessionalATS.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '../../../../utils/icons';

export const CV_TEMPLATES = [
    {
        id: "tpl_prof_2",
        name: "Professional Template",
        description: "Standard single column ATS-friendly minimalist design.",
        layout: "professional",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        themeColor: "bg-blue-600",
        isPremium: true,
        preview: ProfessionalATSImg,
    },
    {
        id: "tpl_prof_1",
        name: "Executive Professional",
        description: "Traditional layout suitable for corporate roles.",
        layout: "professional",
        bgColor: "bg-gray-100 dark:bg-gray-800",
        themeColor: "bg-gray-800 dark:bg-gray-400",
        isPremium: false,
        preview: ExecutiveProfessionalImg,
    }
];

const TemplateSelection = () => {
    const navigate = useNavigate();
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const jobId = searchParams.get("jobId");

    const [createResumeBuilder, { isLoading: isCreating }] = useCreateResumeBuilderMutation();
    const [cloneResumeBuilder, { isLoading: isCloning }] = useCloneResumeBuilderMutation();

    const handleTemplateClick = (template) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
    };

    const handleCreateNew = async (template) => {
        try {
            const newResume = await createResumeBuilder({
                resumeName: `[${template.id}] Mới`
            }).unwrap();
            setIsModalOpen(false);
            const jobPart = jobId ? `&jobId=${jobId}` : "";
            navigate(`/dashboard/resumes/builder?template=${template.id}&resumeId=${newResume.id}${jobPart}`);
        } catch (error) {
            toastMessage.error("Không thể tạo CV mới. Vui lòng thử lại.");
        }
    };

    const handleSelectExisting = async (template, resumeId) => {
        try {
            const clonedResume = await cloneResumeBuilder({ resumeId }).unwrap();
            setIsModalOpen(false);
            const jobPart = jobId ? `&jobId=${jobId}` : "";
            navigate(`/dashboard/resumes/builder?template=${template.id}&resumeId=${clonedResume.id}${jobPart}`);
        } catch (error) {
            toastMessage.error("Không thể clone CV. Vui lòng thử lại.");
        }
    };

    return (
        <div>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <button
                                    onClick={() => navigate('/dashboard/resumes')}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="text-[20px]" />
                                </button>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Choose a Template</h1>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 ml-8">Select a professionally designed template to get started building your resume.</p>
                        </div>
                    </div>
                </Col>

                <Col span={24}>
                    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <Row gutter={[24, 24]}>
                            {CV_TEMPLATES.map((template) => (
                                <Col xs={24} sm={24} lg={12} xl={12} key={template.id}>
                                    <TemplateCard template={template} onSelect={handleTemplateClick} />
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Col>
            </Row>

            <UseTemplateModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                template={selectedTemplate}
                onCreateNew={handleCreateNew}
                onSelectExisting={handleSelectExisting}
                isCreating={isCreating}
                isCloning={isCloning}
            />
        </div>
    );
};

export default TemplateSelection;
