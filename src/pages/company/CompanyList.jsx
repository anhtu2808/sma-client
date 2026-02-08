import React, { useState } from 'react';
import CompanyCard from '@/components/CompanyCard';
import Pagination from '@/components/Pagination';
import SearchHero from '@/components/SearchHero';
import DataList from '@/components/DataList';
import { useGetCompaniesQuery } from '@/apis/companyApi';

const CompanyList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const ITEMS_PER_PAGE = 8;

    // Query Params
    const queryParams = {
        page: currentPage - 1, // API is 0-indexed
        size: ITEMS_PER_PAGE,
        ...(searchTerm && { name: searchTerm }),
    };

    // API Call
    const { data: companyData, isLoading, isError } = useGetCompaniesQuery(queryParams);

    // Data Transformation
    const companies = companyData?.data?.content || companyData?.content || [];
    const totalPages = companyData?.data?.totalPages || companyData?.totalPages || 0;
    const totalElements = companyData?.data?.totalElements || companyData?.totalElements || 0;

    const handleSearchChange = (val) => {
        setSearchTerm(val);
        setCurrentPage(1); // Reset to page 1 on search
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#1a100c]">
            <SearchHero
                title="Discover Top Companies"
                subtitle="Explore approved companies and find your next workplace."
                searchValue={searchTerm}
                onSearchChange={handleSearchChange}
                placeholder="Search companies..."
                className="!mb-8"
            />

            <div className="container mx-auto px-4 md:px-6 pb-20">
                {/* Header Info */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <p className="text-slate-500 dark:text-[#8c6b5d]">
                        Showing <span className="font-bold text-slate-900 dark:text-white">{totalElements}</span> results
                    </p>
                </div>

                <DataList
                    data={companies}
                    isLoading={isLoading}
                    isError={isError}
                    emptyMessage="No companies found"
                    emptySubMessage="Try adjusting your search terms."
                >
                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {companies.map((company) => (
                            <CompanyCard
                                key={company.id}
                                name={company.name}
                                logo={company.logo}
                                industry={company.companyIndustry || "Unknown Industry"}
                                location={company.country || "Unknown Location"}
                                followers={company.followerNumber || 0}
                                isApproved={company.companyStatus === "APPROVED"}
                                onViewDetails={() => console.log('View', company.id)}
                            />
                        ))}
                    </div>
                </DataList>

                {/* Pagination */}
                {totalPages > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
};

export default CompanyList;
