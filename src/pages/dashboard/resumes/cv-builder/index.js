import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Col, Row, DatePicker } from "antd";
import {
    ArrowUp, ArrowDown, Trash2, Plus, GripVertical,
    Mail, Phone, MapPin, Download, Save
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import ModernMinimalistTemplate from "./templates/ModernMinimalistTemplate";
import ExecutiveProfessionalTemplate from "./templates/ExecutiveProfessionalTemplate";
import CreativeStudioTemplate from "./templates/CreativeStudioTemplate";
import TechInnovatorTemplate from "./templates/TechInnovatorTemplate";

export default function CvBuilder() {
    // Initial State mimicking the provided screenshot
    const [cvData, setCvData] = useState({
        personalInfo: {
            fullName: "NGUYỄN LÊ BẢO NGỌC",
            title: "SENIOR PRODUCT MANAGER",
            experienceYears: "7 NĂM KINH NGHIỆM",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", // Replace with realistic image if needed
        },
        objective: "Motivated and forward-thinking product owner with 7 years of experience in a dynamic SaaS environment. Eager to support SefTech's team with leadership and guidance over a wide range of product development efforts. In previous roles reduced the delivery time by 20% and was able to coordinate 95% of product completion in line with the company roadmap.",
        personalDetails: {
            dob: "19/04/1998",
            nationality: "Việt Nam",
            maritalStatus: "Độc thân",
            gender: "Nam"
        },
        languages: [
            { id: 'lang_1', name: "Tiếng Anh", level: "Trung Cấp" },
            { id: 'lang_2', name: "Tiếng Thổ Nhĩ Kỳ", level: "Bản Địa" }
        ],
        skills: [
            "Product management",
            "Communication", "English", "UI/UX",
            "Content Writing"
        ],
        contact: {
            email: "haonsvse172181@fpt.edu.vn",
            phone: "+84-975052978",
            address: "11 Doan Van Bo, Quận 4, Hồ Chí Minh, Việt Nam"
        },
        experience: [
            {
                id: "exp_1",
                role: "Senior Product Manager",
                company: "Navigos Group VN",
                dateRange: "01/2016  -  01/2023",
                duration: "(7 năm)",
                description: "Skilled and experienced Product Manager with experience in product marketing, product introduction, and the overall management of a product's life from conception to fruition. Experience in assessing customer desires and requirements and generating a product that successfully meets those standards."
            },
            {
                id: "exp_2",
                role: "Product Owner",
                company: "Navigos Group VN",
                dateRange: "01/2014  -  04/2016",
                duration: "(2 năm 3 tháng)",
                description: "Maximized applications' efficiency, data quality, scope, operability, and flexibility. Used various ideas from distributed computing, large-scale design, real-time data processing, data storage, ML, and AI to solve challenging dataset problems."
            }
        ],
        education: [
            {
                id: "edu_1",
                degree: "Bachelor of Science in Software Development",
                school: "Cử nhân - Master - Economics University",
                dateRange: "09/1997  -  07/2020",
                duration: "(22 năm 10 tháng)",
                description: "Relevant Coursework: Operating Systems Architecture, Linux/Unix Programming, Usability in Website and Software Design, C++ Programming I & II, Web Page Development, Relational Database Design & SQL, Data Engineering, Advanced Software Programming."
            }
        ],
        certificates: [
            {
                id: "cert_1",
                name: "PSPO I",
                issuer: "Scrum.org",
                year: "2015",
                link: "https://www.sample.site/PSPO1.pdf"
            },
            {
                id: "cert_2",
                name: "PMP",
                issuer: "PMI.org",
                year: "2017",
                link: "https://www.sample.site/PMP.pdf"
            }
        ],
        activities: [
            {
                id: "act_1",
                name: "Run for the Earth 2018",
                role: "Event Team Leader - NVG",
                dateRange: "02/2018  -  06/2018",
                description: "'Run for the Earth' is an annual trail run program to raise funds and increase the understanding of young people about environmental issues. As an Event Team Leader of 'Run for the Earth 2018', I have built and ran more than 5 events, including opening events, press conferences, and closing ceremonies with more than 250 thousand event participants and the fund of 1.5 million dollars raised."
            }
        ],
        references: [
            {
                id: "ref_1",
                name: "Tuan Phan",
                title: "Technical Lead - Navigos Group VN",
                contact: "tuan@navigosgroup.com - +84-919412059"
            },
            {
                id: "ref_2",
                name: "Ha Ngo",
                title: "QC Lead - Navigos Group VN",
                contact: "hango@navigosgroup.com - +84-919412059"
            }
        ]
    });

    const [sectionOrder, setSectionOrder] = useState([
        "experience",
        "education",
        "certificates",
        "activities",
        "references"
    ]);

    const [hoveredSection, setHoveredSection] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);

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

    const deleteItem = (section, id) => {
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

    // --- Reusable Components ---
    const EditableText = ({ value, onChange, className, as = "span", multiline = false }) => {
        const handleBlur = (e) => {
            if (e.target.innerText !== value) {
                onChange(e.target.innerText);
            }
        };

        const Tag = as;
        return (
            <Tag
                className={`outline-none border border-transparent hover:border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded px-1 transition-all ${className}`}
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur}
                dangerouslySetInnerHTML={{ __html: value }}
            />
        );
    };

    const SectionWrapper = ({ title, sectionKey, index, isFirst, isLast, onAdd, children, titleClassName }) => (
        <div
            className="group/section relative border border-transparent hover:border-[#1F8A70]/30 hover:bg-[#F8F9FA]/50 rounded-xl transition-colors -mx-4 px-4 py-4 mb-2"
        >
            <h3 className={titleClassName || "text-xl font-semibold text-[#1F8A70] mb-4"}>{title}</h3>

            <div className="absolute left-6 top-1 flex gap-2 z-20 opacity-0 group-hover/section:opacity-100 pointer-events-none group-hover/section:pointer-events-auto transition-opacity duration-200">
                {onAdd && (
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm transition-colors cursor-pointer"
                    >
                        <Plus size={16} />
                        Thêm {title.toLowerCase()}
                    </button>
                )}
                {index !== undefined && (
                    <>
                        <button
                            onClick={() => moveSection(index, 'up')}
                            disabled={isFirst}
                            className={`flex items-center justify-center w-8 h-8 rounded-full shadow-sm transition-colors cursor-pointer ${isFirst ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                        >
                            <ArrowUp size={16} />
                        </button>
                        <button
                            onClick={() => moveSection(index, 'down')}
                            disabled={isLast}
                            className={`flex items-center justify-center w-8 h-8 rounded-full shadow-sm transition-colors cursor-pointer ${isLast ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                        >
                            <ArrowDown size={16} />
                        </button>
                    </>
                )}
            </div>
            <div className="relative">
                {children}
            </div>
        </div>
    );

    const EditableItemWrapper = ({ children, section, index, id, isFirst, isLast }) => (
        <div
            className="group/item relative rounded-lg border border-transparent hover:border-gray-200 hover:shadow-sm transition-all -mx-4 px-4 py-2 mb-2"
        >
            {/* Outline indicator on the left simulating the diamond line */}
            <div className="absolute left-[-17px] top-4 w-2 h-2 rounded-sm border border-[#1F8A70] bg-white rotate-45 z-10" />

            {children}

            {/* Action Toolbar */}
            <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 flex flex-col gap-1 bg-white shadow-md border border-gray-100 rounded-md p-1 z-20 opacity-0 group-hover/item:opacity-100 pointer-events-none group-hover/item:pointer-events-auto transition-opacity duration-200">
                <button
                    onClick={() => moveItem(section, index, 'up')}
                    disabled={isFirst}
                    className={`p-1.5 rounded ${isFirst ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <ArrowUp size={16} />
                </button>
                <button
                    onClick={() => moveItem(section, index, 'down')}
                    disabled={isLast}
                    className={`p-1.5 rounded ${isLast ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <ArrowDown size={16} />
                </button>
                <button
                    onClick={() => deleteItem(section, id)}
                    className="p-1.5 rounded text-red-500 hover:bg-red-50"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );

    const [searchParams] = useSearchParams();
    const templateId = searchParams.get('template') || 'tpl_modern_1';

    let TemplateComponent = ModernMinimalistTemplate;
    if (templateId === 'tpl_prof_1') TemplateComponent = ExecutiveProfessionalTemplate;
    if (templateId === 'tpl_creative_1') TemplateComponent = CreativeStudioTemplate;
    if (templateId === 'tpl_modern_2') TemplateComponent = TechInnovatorTemplate;

    const templateProps = {
        cvData,
        sectionOrder,
        updateField,
        addItem,
        EditableText,
        SectionWrapper,
        EditableItemWrapper,
        LucideIcons
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] pb-12">

            {/* Top Toolbar (Mocked) */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <Link to="/dashboard/resumes" className="text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center gap-1">
                        ← Back
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                        <Save size={16} /> Lưu & Xem trước
                    </button>
                    <button className="px-4 py-2 bg-[#1F8A70] text-white rounded-md text-sm font-medium hover:bg-[#19755f] flex items-center gap-2">
                        <Download size={16} /> Tải PDF
                    </button>
                </div>
            </div>

            {/* Selected Template Component */}
            <TemplateComponent {...templateProps} />

            {/* Page indicator (mocked) */}
            <div className="w-[850px] mx-auto mt-2 text-right">
                <span className="text-xs text-gray-400 font-medium tracking-wide">Trang 1</span>
            </div>
        </div>
    );
}
