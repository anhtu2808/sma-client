import React from 'react';
import { Form, DatePicker, message } from 'antd';
import Loading from '@/components/Loading';
import Input from "@/components/Input";
import Select from "@/components/Select";
import Switch from "@/components/Switch";
import { workingModelOptions } from '@/constant/job';
import { useGetSkillsQuery } from "@/apis/skillApi";
import dayjs from 'dayjs';

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

export default function PropertiesSidebar({ activeSection, cvData, updateField }) {
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

    // Skill search state
    const [skillSearchText, setSkillSearchText] = React.useState("");
    const { data: skillOptions = [], isFetching: isFetchingSkills } = useGetSkillsQuery(
        { name: skillSearchText, size: 20 },
        { skip: section !== 'skills' }
    );
    const [tempGroup, setTempGroup] = React.useState("");
    const [tempExperience, setTempExperience] = React.useState("");
    const [tempSkillId, setTempSkillId] = React.useState(null);

    const handleExperienceChange = (expVal) => {
        setTempExperience(expVal);

        if (!tempGroup.trim()) {
            message.error("Please enter a skill group name.");
            return;
        }

        if (!tempSkillId) {
            message.error("Please select a skill before selecting years of experience.");
            return;
        }

        handleAddSkill(tempSkillId, expVal);
    };

    const handleAddSkill = (skillId, expVal) => {
        const selectedSkill = skillOptions.find(s => s.id === skillId);
        if (!selectedSkill) return;

        if (cvData.skills.some(s => s.skillId === skillId)) {
            message.warning("This skill has already been added.");
            return;
        }

        const newSkill = {
            id: `skill_${Date.now()}_${Math.random()}`,
            skillId: selectedSkill.id,
            skillName: selectedSkill.name,
            groupName: tempGroup.trim(),
            yearsOfExperience: (expVal !== undefined && expVal !== null && expVal !== '') ? Number(expVal) : null
        };

        updateField('skills', [...cvData.skills, newSkill]);
        setSkillSearchText("");
        setTempSkillId(null);
        setTempExperience("");
    };

    if (!activeSection) {
        return (
            <div className="w-80 bg-white border-r border-gray-200 h-full p-6 text-center shadow-sm z-10 hidden lg:block overflow-y-auto shrink-0">
                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 mt-20">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <span className="material-icons-round text-3xl">touch_app</span>
                    </div>
                    <p>Select an item on the right to edit properties</p>
                </div>
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
            case 'experience':
                return (
                    <>
                        <Form.Item label="Working Model" name="workingModel">
                            <Select fullWidth="true" options={workingModelOptions.filter(o => o.value)} placeholder="Select model" />
                        </Form.Item>
                        <Form.Item label="Employment Type" name="employmentType">
                            <Select fullWidth="true" options={employmentTypeOptions} placeholder="Select employment type" />
                        </Form.Item>
                    </>
                );
            case 'education':
                return (
                    <>
                        <Form.Item label="Degree" name="degree">
                            <Select fullWidth="true" options={degreeOptions} placeholder="Select degree" />
                        </Form.Item>
                        <Form.Item label="GPA" name="gpa">
                            <Input type="number" step="0.1" placeholder="e.g: 3.5" />
                        </Form.Item>
                    </>
                );
            case 'projects':
                return (
                    <>
                        <Form.Item label="Project Type" name="projectType">
                            <Select fullWidth="true" options={projectTypeOptions} placeholder="Select project type" />
                        </Form.Item>
                        <Form.Item label="Team Size" name="teamSize">
                            <Input type="number" min={1} placeholder="Number of members" />
                        </Form.Item>
                    </>
                );
            case 'certificates':
                return (
                    <>
                        <Form.Item label="Issuer" name="issuer">
                            <Input placeholder="e.g: Coursera, AWS" />
                        </Form.Item>
                        <Form.Item label="Credential URL" name="credentialUrl">
                            <Input placeholder="https://..." />
                        </Form.Item>
                    </>
                );
            case 'skills':
                return (
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Skill Group</label>
                            <Input
                                placeholder="e.g., Frontend, Backend..."
                                value={tempGroup}
                                onChange={e => setTempGroup(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search and add skill</label>
                            <Select
                                showSearch
                                placeholder="Type to search..."
                                value={tempSkillId}
                                onSearch={(val) => setSkillSearchText(val)}
                                onChange={val => setTempSkillId(val)}
                                filterOption={false}
                                loading={isFetchingSkills}
                                notFoundContent={skillSearchText ? (isFetchingSkills ? <Loading size={24} inline /> : "Not found") : "Type to search"}
                                className="w-full"
                                fullWidth={true}
                                options={skillOptions.map(s => ({
                                    value: s.id,
                                    label: s.name,
                                }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                            <Select
                                placeholder="Select years"
                                value={tempExperience || undefined}
                                onChange={handleExperienceChange}
                                options={Array.from({ length: 21 }, (_, i) => ({ label: `${i} years`, value: i }))}
                                className="w-full"
                                fullWidth="true"
                            />
                        </div>
                    </div>
                );
            default:
                return <div className="text-gray-500 text-sm">No settings available for this section.</div>;
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
                <span className="material-icons-round text-primary-600">tune</span>
                Properties
            </h3>

            <div className="bg-blue-50 text-blue-800 p-3 rounded-md mb-6 text-sm font-medium border border-blue-100 flex items-center gap-2">
                <span className="material-icons-round text-blue-500 text-lg">edit</span>
                Editing: {sectionLabels[section] || section}
            </div>

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
