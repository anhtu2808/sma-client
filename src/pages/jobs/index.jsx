import React, { useState, useMemo } from 'react';
import { useGetJobsQuery } from '@/apis/jobApi';

// Import các components con
import JobHero from './sections/JobHero';
import JobFilterSidebar from './sections/JobFilterSidebar';
import JobList from './sections/JobList';

const MOCK_JOBS = [
    {
        id: "mock-1",
        name: "Senior Frontend Developer",
        companyName: "Tech Corp",
        companyLogo: "https://ui-avatars.com/api/?name=Tech+Corp&background=0D8ABC&color=fff",
        location: "San Francisco, CA",
        salaryMin: 4000,
        salaryMax: 6000,
        skills: [{ name: "React" }, { name: "TypeScript" }, { name: "Tailwind" }],
        createdDate: new Date().toISOString(),
        isHot: true
    },
    {
        id: "mock-2",
        name: "Backend Engineer",
        companyName: "Data Systems",
        companyLogo: "https://ui-avatars.com/api/?name=Data+Systems&background=ff5722&color=fff",
        location: "Remote",
        salaryMin: 3000,
        salaryMax: 5000,
        skills: [{ name: "Node.js" }, { name: "PostgreSQL" }, { name: "AWS" }],
        createdDate: new Date().toISOString(),
        isHot: false
    },
    {
        id: "mock-3",
        name: "UI/UX Designer",
        companyName: "Creative Studio",
        companyLogo: "https://ui-avatars.com/api/?name=Creative+Studio&background=673ab7&color=fff",
        location: "New York, NY",
        salaryMin: 2500,
        salaryMax: 4000,
        skills: [{ name: "Figma" }, { name: "Sketch" }, { name: "Adobe XD" }],
        createdDate: new Date().toISOString(),
        isHot: true
    },
    {
        id: "mock-4",
        name: "Full Stack Developer",
        companyName: "Startup Inc",
        companyLogo: "https://ui-avatars.com/api/?name=Startup+Inc&background=4caf50&color=fff",
        location: "Austin, TX",
        salaryMin: 3500,
        salaryMax: 5500,
        skills: [{ name: "React" }, { name: "Node.js" }, { name: "MongoDB" }],
        createdDate: new Date().toISOString(),
        isHot: false
    },
    {
        id: "mock-5",
        name: "DevOps Specialist",
        companyName: "Cloud Sol",
        companyLogo: "https://ui-avatars.com/api/?name=Cloud+Sol&background=607d8b&color=fff",
        location: "Remote",
        salaryMin: 4500,
        salaryMax: 7000,
        skills: [{ name: "Docker" }, { name: "Kubernetes" }, { name: "CI/CD" }],
        createdDate: new Date().toISOString(),
        isHot: true
    }
];

const Jobs = () => {
    const [filters, setFilters] = useState({
        name: '',
        location: '',
        jobLevel: '',
        salaryStart: '',
        skillId: []
    });

    // API Call
    const { data: jobData, isLoading, isError } = useGetJobsQuery({
        page: 0,
        size: 10,
        name: filters.name,
        location: filters.location,
        jobLevel: filters.jobLevel, // Updated param key
        salary: filters.salaryStart,
        skillId: filters.skillId
    });

    // Handlers
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleResetFilters = () => {
        setFilters({ name: '', location: '', jobLevel: '', salaryStart: '', skillId: [] });
    };

    // Data Transformation (Mapping API response to UI props)
    const formattedJobs = useMemo(() => {
        // if (!jobData?.content) return []; 
        // return jobData.content.map(job => ({
        const dataToMap = (jobData?.content && jobData.content.length > 0) ? jobData.content : MOCK_JOBS;

        return dataToMap.map(job => ({
            id: job.id,
            title: job.name,
            company: job.companyName || "Unknown Company",
            companyLogo: job.companyLogo,
            location: job.location || "Remote",
            salary: job.salaryMin && job.salaryMax ? `$${job.salaryMin} - $${job.salaryMax}` : "Negotiable",
            tags: job.skills ? job.skills.map(s => s.name) : [],
            postedTime: new Date(job.createdDate).toLocaleDateString(),
            isHot: job.isHot,
            variant: 'primary'
        }));
    }, [jobData]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#1a100c] pt-20">
            {/* 1. Hero Search Section */}
            <JobHero
                searchValue={filters.name}
                onSearchChange={(val) => handleFilterChange('name', val)}
            />

            <div className="container mx-auto px-4 md:px-6 pb-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* 2. Sidebar Filter Section */}
                    <JobFilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleResetFilters}
                    />

                    {/* 3. Main Job List Section */}
                    <main className="flex-1">
                        <JobList
                            jobs={formattedJobs}
                            isLoading={isLoading}
                            isError={isError}
                            onBookmark={(id) => console.log('Bookmark', id)}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Jobs;