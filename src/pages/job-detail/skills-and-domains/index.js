import React from 'react';

const SkillsAndDomains = ({ skills, expertise, domains }) => {
    return (
        <>
            {/* Skills */}
            {skills.length > 0 && (
                <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <span key={skill.id} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Expertise & Domains */}
            {expertise && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span className="font-semibold text-gray-700">Job Expertise:</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">{expertise.name}</span>
                </div>
            )}
            {domains.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-semibold text-gray-700">Job Domain:</span>
                    {domains.map((domain) => (
                        <span key={domain.id} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">{domain.name}</span>
                    ))}
                </div>
            )}
        </>
    );
};

export default SkillsAndDomains;
