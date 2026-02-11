import React from 'react';
import { User } from 'lucide-react';
import Input from '@/components/Input';
import StepWrapper from './StepWrapper';

const PersonalInfo = ({ contactInfo, onChange, errors = {} }) => {
    return (
        <StepWrapper
            icon={<User size={18} />}
            title="Personal Information"
            step="02"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label={<span>Full Name <span className="text-red-500">*</span></span>}
                    name="fullName"
                    required
                    value={contactInfo.fullName}
                    onChange={onChange}
                    placeholder="John Doe"
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                />
                <Input
                    label={<span>Email Address <span className="text-red-500">*</span></span>}
                    name="email"
                    type="email"
                    required
                    value={contactInfo.email}
                    onChange={onChange}
                    placeholder="john@example.com"
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <Input
                    label={<span>Phone Number <span className="text-red-500">*</span></span>}
                    name="phone"
                    required
                    className="md:col-span-2"
                    value={contactInfo.phone}
                    onChange={onChange}
                    placeholder="+84 900 000 000"
                    error={!!errors.phone}
                    helperText={errors.phone}
                />
            </div>
        </StepWrapper>
    );
};

export default PersonalInfo;
