import React, { useState } from "react";
import { Col, Row, message } from "antd";
import { useNavigate } from "react-router-dom";
import { TemplateCard } from "../resume-card";
import UseTemplateModal from "./UseTemplateModal";
import { useCreateResumeBuilderMutation, useCloneResumeBuilderMutation } from "@/apis/resumeApi";

import ModernMinimalistImg from "@/assets/template/ModernMinimalist.png";
import ExecutiveProfessionalImg from "@/assets/template/ExecutiveProfessional.png";
import CreativeStudioImg from "@/assets/template/CreativeStudio.png";
import TechInnovatorImg from "@/assets/template/TechInnovator.png";

export const CV_TEMPLATES = [
    {
        id: "tpl_modern_1",
        name: "Modern Minimalist",
        description: "Clean and contemporary design focusing on readability.",
        layout: "modern",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        themeColor: "bg-blue-600",
        isPremium: false,
        preview: ModernMinimalistImg,
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
    },
    {
        id: "tpl_creative_1",
        name: "Creative Studio",
        description: "Stand out with bold colors and a unique structure.",
        layout: "creative",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        themeColor: "bg-purple-600",
        isPremium: true,
        preview: CreativeStudioImg,
    },
    {
        id: "tpl_modern_2",
        name: "Tech Innovator",
        description: "Sleek dark design with modern organized sections.",
        layout: "modern",
        bgColor: "bg-teal-50 dark:bg-teal-900/20",
        themeColor: "bg-teal-600",
        isPremium: true,
        preview: TechInnovatorImg,
    }
];

const TemplateSelection = () => {
    const navigate = useNavigate();
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            navigate(`/dashboard/resumes/builder?template=${template.id}&resumeId=${newResume.id}`);
        } catch (error) {
            message.error("Không thể tạo CV mới. Vui lòng thử lại.");
        }
    };

    const handleSelectExisting = async (template, resumeId) => {
        try {
            const clonedResume = await cloneResumeBuilder({ resumeId }).unwrap();
            setIsModalOpen(false);
            navigate(`/dashboard/resumes/builder?template=${template.id}&resumeId=${clonedResume.id}`);
        } catch (error) {
            message.error("Không thể clone CV. Vui lòng thử lại.");
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
                                    <span className="material-icons-round text-[20px]">arrow_back</span>
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
