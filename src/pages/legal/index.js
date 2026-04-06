import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetPublicPolicyQuery } from '@/apis/publicPolicyApi';
import { Spin, Breadcrumb, Tag } from 'antd';
import { ShieldCheck, FileText, Clock } from 'lucide-react';
import dayjs from 'dayjs';

const LegalPage = () => {
    const { type } = useParams();
    const policyType = type?.toUpperCase() === 'PRIVACY' ? 'PRIVACY' : 'TERMS';

    const { data, isLoading, isError } = useGetPublicPolicyQuery(policyType);
    const policy = data?.data;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [type]);

    if (isLoading) return <div className="h-screen flex items-center justify-center bg-white"><Spin size="large" tip="Loading document..." /></div>;
    if (isError || !policy) return <div className="text-center py-24 font-poppins text-gray-500 underline"><a href="/">Policy not found. Return to Home</a></div>;

    return (
        <div className="bg-white min-h-screen font-poppins">
            {/* --- HEADER AREA --- */}
            <div className="bg-[#f9fafb] border-b border-gray-100 py-12 md:py-20">
                <div className="max-w-4xl mx-auto px-6">
                    <Breadcrumb
                        items={[
                            { title: <a href="/" className="hover:text-orange-500">Home</a> },
                            { title: <span className="text-gray-400">Legal</span> },
                            { title: <span className="font-semibold text-gray-900">{policyType === 'PRIVACY' ? 'Privacy Policy' : 'Terms of Service'}</span> }
                        ]}
                    />

                    <div className="mt-10 flex flex-col md:flex-row md:items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${policyType === 'PRIVACY' ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'}`}>
                            {policyType === 'PRIVACY' ? <ShieldCheck size={32} /> : <FileText size={32} />}
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                {policyType === 'PRIVACY' ? 'Privacy Policy' : 'Terms of Service'}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mt-3">
                                <Tag color="default" className="font-bold border-none bg-gray-200 text-gray-700 px-3 py-0.5 rounded-full">
                                    Version {policy.version}
                                </Tag>
                                <span className="text-gray-400 text-sm flex items-center gap-1.5">
                                    <Clock size={16} /> Last updated: {dayjs(policy.updatedAt).format('MMMM DD, YYYY')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="max-w-4xl mx-auto  py-16 md:py-24">
                <div
                    className="legal-rich-text-container"
                    dangerouslySetInnerHTML={{ __html: policy.content }}
                />

                <div className="mt-24 pt-10 border-t border-gray-100">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <p className="text-sm text-gray-500 leading-relaxed italic">
                            By continuing to access and use the <strong>SmartRecruit</strong> platform, you acknowledge that you have read, understood, and agreed to the terms outlined in this {policyType.toLowerCase().replace('_', ' ')} document. If you do not agree, please discontinue use of our services.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                /* Container chính */
                .legal-rich-text-container {
                    font-size: 16px;
                    line-height: 1.8;
                    color: #4b5563; 
                }
 
                .legal-rich-text-container h1, 
                .legal-rich-text-container h2 {
                    font-size: 28px !important;
                    font-weight: 800 !important;
                    color: #111827 !important;
                    margin-top: 48px !important;
                    margin-bottom: 20px !important;
                    line-height: 1.3 !important;
                    display: block !important;
                }

                .legal-rich-text-container h3 {
                    font-size: 20px !important;
                    font-weight: 700 !important;
                    color: #1f2937 !important;
                    margin-top: 32px !important;
                    margin-bottom: 16px !important;
                    display: block !important;
                }
 
                .legal-rich-text-container p {
                    margin-bottom: 20px !important;
                    display: block !important;
                }
 
                .legal-rich-text-container ul {
                    list-style-type: disc !important;
                    padding-left: 24px !important;
                    margin-bottom: 24px !important;
                }

                .legal-rich-text-container li {
                    margin-bottom: 12px !important;
                    padding-left: 4px !important;
                }
 
                .legal-rich-text-container b, 
                .legal-rich-text-container strong {
                    font-weight: 700 !important;
                    color: #111827 !important;
                }
 
                .legal-rich-text-container hr {
                    border: 0;
                    border-top: 1px solid #f3f4f6;
                    margin: 48px 0;
                }
 
                .legal-rich-text-container > p:first-child:empty {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default LegalPage;