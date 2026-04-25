import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetJobByIdQuery } from '@/apis/jobApi';
import {
    DollarSign, ShieldCheck, CalendarOff, Clock, GraduationCap,
    Coffee, Monitor, Building2, Trees, MoreHorizontal
} from 'lucide-react';

const BENEFIT_ICONS = {
    FINANCIAL: DollarSign,
    INSURANCE: ShieldCheck,
    TIME_OFF: CalendarOff,
    FLEXIBILITY: Clock,
    DEVELOPMENT: GraduationCap,
    LEISURE: Coffee,
    EQUIPMENT: Monitor,
    AMENITIES: Building2,
    WORK_ENVIRONMENT: Trees,
    OTHER: MoreHorizontal,
};

const Benefits = () => {
    const { id } = useParams();
    const { data: jobData } = useGetJobByIdQuery(id);
    const benefits = jobData?.data?.benefits;

    if (!benefits || benefits.length === 0) return null;

    return (
        <div className="p-6 md:p-8">
            <h3 className="text-gray-900 text-lg font-bold mb-4">What We Can Offer</h3>
            <div className="space-y-3">
                {benefits.map((benefit) => {
                    const Icon = BENEFIT_ICONS[benefit.type] || MoreHorizontal;
                    return (
                        <div key={benefit.id} className="flex items-center gap-3 border border-gray-200 rounded-lg p-4">
                            <div className="shrink-0 w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                                <Icon className="w-[18px] h-[18px] text-blue-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{benefit.name}</p>
                                {benefit.description && benefit.description !== benefit.name && (
                                    <p className="text-sm text-gray-500 mt-0.5">{benefit.description}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Benefits;
