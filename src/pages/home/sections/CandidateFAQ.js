import React, { useState, useEffect } from 'react';
import { useGetPublicFaqsQuery } from '@/apis/faqApi';
import { ChevronDown, Search, Sparkles, HelpCircle } from 'lucide-react';
import Reveal from '@/components/Reveal/Reveal';

const CandidateFAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setActiveIndex(null);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading, isFetching } = useGetPublicFaqsQuery({
        size: 50,
        keyword: debouncedSearch
    });

    const rawFaqs = data?.data?.content || [];

    const faqs = rawFaqs.filter(faq =>
        faq.category === 'CANDIDATE' || faq.category === 'GENERAL'
    );

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-20">
            {/* Header Section */}
            <Reveal>
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-heading tracking-tight">
                        How can we help you?
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
                        Find answers to common questions about AI matching, profiles, and the application process.
                    </p>
                </div>
            </Reveal>

            {/* Search Box */}
            <Reveal delay={0.1}>
                <div className="relative mb-12 max-w-2xl mx-auto">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <Search className={`${isFetching ? 'animate-pulse text-orange-500' : 'text-gray-400'}`} size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for a question (e.g. password, AI score...)"
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 outline-none transition-all text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {isFetching && (
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-orange-500 animate-pulse">
                            SEARCHING...
                        </div>
                    )}
                </div>
            </Reveal>

            {/* Accordion List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex flex-col items-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-gray-400 font-medium">Loading help articles...</p>
                    </div>
                ) : faqs.length > 0 ? (
                    faqs.map((faq, index) => (
                        <Reveal key={faq.id} delay={index * 0.05}>
                            <div className={`group border rounded-[24px] transition-all duration-500 overflow-hidden ${activeIndex === index
                                ? 'border-orange-200 bg-orange-50/40 shadow-xl shadow-orange-900/5'
                                : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                                }`}>
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full px-7 py-6 flex items-center justify-between text-left focus:outline-none"
                                >
                                    <div className="flex flex-col gap-1.5">
                                        <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${faq.category === 'CANDIDATE' ? 'text-blue-500' : 'text-emerald-500'
                                            }`}>
                                            {faq.category === 'CANDIDATE' ? '• User Guide' : '• General Information'}
                                        </span>
                                        <span className={`text-base md:text-lg font-bold transition-colors duration-300 ${activeIndex === index ? 'text-orange-600' : 'text-gray-800 group-hover:text-gray-900'
                                            }`}>
                                            {faq.question}
                                        </span>
                                    </div>
                                    <div className={`flex-shrink-0 ml-4 p-1.5 rounded-full transition-all duration-500 ${activeIndex === index ? 'bg-orange-100 text-orange-600 rotate-180' : 'bg-gray-50 text-gray-300'
                                        }`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </button>

                                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${activeIndex === index ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                    <div className="px-7 pb-8 text-gray-600 text-sm md:text-[15px] leading-relaxed border-t border-orange-100/50 pt-5 mt-1 whitespace-pre-line">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))
                ) : (
                    <div className="text-center py-24 bg-white rounded-[32px] border border-dashed border-gray-200">
                        <HelpCircle size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-gray-900 font-bold mb-1">No results found</h3>
                        <p className="text-gray-400 text-sm">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>

            {/* Minimal Footer Support */}
            <Reveal delay={0.3}>
                <div className="mt-12 text-center border-t border-gray-100 pt-8">
                    <p className="text-gray-500 text-sm">
                        Still have questions? Contact us at{' '}
                        <a
                            href="mailto:smart.recruit.business@gmail.com"
                            className="text-orange-600 font-bold hover:text-orange-500 transition-colors underline underline-offset-4"
                        >
                            smart.recruit.business@gmail.com
                        </a>
                    </p>
                </div>
            </Reveal>
        </div>
    );
};

export default CandidateFAQ;