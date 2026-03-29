import React from 'react';
import { Form } from 'antd';
import Button from "@/components/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faEyeSlash, faHandPointer, faSliders } from '../../../../utils/icons';

const employmentTypeOptions = [
    { label: "Full-time", value: "FULL_TIME" },
    { label: "Part-time", value: "PART_TIME" },
    { label: "Self-employed", value: "SELF_EMPLOYED" },
    { label: "Freelance", value: "FREELANCE" },
    { label: "Contract", value: "CONTRACT" },
    { label: "Internship", value: "INTERNSHIP" },
    { label: "Apprenticeship", value: "APPRENTICESHIP" },
    { label: "Seasonal", value: "SEASONAL" }
];

const degreeOptions = [
    { label: "High School", value: "HIGH_SCHOOL" },
    { label: "Associate", value: "ASSOCIATE" },
    { label: "Bachelor", value: "BACHELOR" },
    { label: "Master", value: "MASTER" },
    { label: "Doctorate", value: "DOCTORATE" },
    { label: "Certificate", value: "CERTIFICATE" }
];

const projectTypeOptions = [
    { label: "Personal", value: "PERSONAL" },
    { label: "Academic", value: "ACADEMIC" },
    { label: "Professional", value: "PROFESSIONAL" },
    { label: "Open Source", value: "OPEN_SOURCE" },
    { label: "Freelance", value: "FREELANCE" }
];

export default function PropertiesSidebar({ activeSection, cvData, updateField, sectionOrder, addSection }) {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (!activeSection) {
            form.resetFields();
            return;
        }

        const { section, index } = activeSection;
        const currentData = cvData[section]?.[index];

        if (currentData) {
            form.setFieldsValue(currentData);
        }
    }, [activeSection, cvData, form]);

    const { section, index } = activeSection || {};

    if (!activeSection) {
        const availableSections = [
            { key: 'experience', label: 'Work Experience' },
            { key: 'education', label: 'Education' },
            { key: 'certificates', label: 'Certifications' },
            { key: 'projects', label: 'Projects' }
        ];

        const missingSections = sectionOrder ? availableSections.filter(s => !sectionOrder.includes(s.key)) : [];

        return (
            <div className="w-80 bg-white border-r border-gray-200 h-full p-6 text-center shadow-sm z-10 hidden lg:block overflow-y-auto shrink-0 flex flex-col justify-between">
                <div>
                    <div className="flex flex-col items-center justify-center text-gray-500 gap-4 mt-20">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <FontAwesomeIcon icon={faHandPointer} className="text-3xl" />
                        </div>
                        <p>Select an item on the right to edit properties</p>
                    </div>
                </div>
                {missingSections.length > 0 && (
                    <div className="mt-12 text-left bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                            <FontAwesomeIcon icon={faEyeSlash} className="text-[16px]" />
                            Hidden Sections
                        </h4>
                        <div className="flex flex-col gap-2">
                            {missingSections.map(s => (
                                <Button
                                    key={s.key}
                                    mode='secondary'
                                    shape='rounded'
                                    onClick={() => addSection(s.key)}
                                    className="!justify-start flex items-center gap-2 bg-white border border-gray-200 hover:border-[#1F8A70] hover:text-[#1F8A70] text-gray-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer w-full text-left shadow-sm hover:shadow"
                                >
                                    <FontAwesomeIcon icon={faCirclePlus} className="text-lg" />
                                    {s.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }


    const handleValuesChange = (changedValues, allValues) => {
        const currentList = [...cvData[section]];
        currentList[index] = { ...currentList[index], ...changedValues };
        updateField(section, currentList);
    };

    const renderFormFields = () => {
        switch (section) {
            case 'skills':
                return <div className="text-gray-500 text-sm">Skills can be added and removed directly on the resume. Use the "Add Skill" button in the Skills section.</div>;

            default:
                return <div className="text-gray-500 text-sm">Select fields are now editable directly on the resume. Click on the values to change them.</div>;
        }
    };

    const sectionLabels = {
        experience: 'Work Experience',
        education: 'Education',
        projects: 'Projects',
        certificates: 'Certifications',
        skills: 'Skills'
    };

    return (
        <div className="w-80 bg-white border-r border-gray-200 h-full p-6 shadow-sm z-10 hidden lg:block overflow-y-auto shrink-0 sticky top-0 max-h-screen">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faSliders} className="text-primary-600" />
                Properties
            </h3>

            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
                className="props-sidebar-form"
            >
                {renderFormFields()}
            </Form>
        </div>
    );
}
