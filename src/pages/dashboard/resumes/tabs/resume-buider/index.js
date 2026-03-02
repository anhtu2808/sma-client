import React from "react";
import { Col, Row } from "antd";
import { TemplateCard } from "../../resume-card";

const CV_TEMPLATES = [
  {
    id: "tpl_modern_1",
    name: "Modern Minimalist",
    description: "Clean and contemporary design focusing on readability.",
    layout: "modern",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    themeColor: "bg-blue-600",
    isPremium: false,
  },
  {
    id: "tpl_prof_1",
    name: "Executive Professional",
    description: "Traditional layout suitable for corporate roles.",
    layout: "professional",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    themeColor: "bg-gray-800 dark:bg-gray-400",
    isPremium: false,
  },
  {
    id: "tpl_creative_1",
    name: "Creative Studio",
    description: "Stand out with bold colors and a unique structure.",
    layout: "creative",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    themeColor: "bg-purple-600",
    isPremium: true,
  },
  {
    id: "tpl_modern_2",
    name: "Tech Innovator",
    description: "Sleek dark design with modern organized sections.",
    layout: "modern",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    themeColor: "bg-teal-600",
    isPremium: true,
  }
];

const ResumeBuilderTab = () => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Sample Templates</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Choose a professionally designed template to get started</p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <Row gutter={[24, 24]}>
          {CV_TEMPLATES.map((template) => (
            <Col xs={24} sm={24} lg={12} xl={12} key={template.id}>
              <TemplateCard template={template} onSelect={(t) => console.log('Selected template', t)} />
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default ResumeBuilderTab;
