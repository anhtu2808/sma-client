import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useGetJobByIdQuery, useGetJobQuestionsQuery } from '@/apis/jobApi';
import { useGetCandidateResumesQuery, useUploadFilesMutation } from '@/apis/resumeApi';
import { useApplyJobMutation } from '@/apis/applicationApi';
import Card from '@/components/Card';
import { toast } from 'react-hot-toast';
import { APPLICATION_ERROR_CODE } from '@/constant';

import ResumeSelection from '@/pages/application/steps/ResumeSelection';
import PersonalInfo from '@/pages/application/steps/PersonalInfo';
import JobQuestions from '@/pages/application/steps/JobQuestions';
import CoverLetter from '@/pages/application/steps/CoverLetter';

import Header from '@/pages/application/header';
import SubmitCTA from './submit-cta';

const Application = () => {
    const { id: jobId } = useParams();
    const navigate = useNavigate();

    const [uploadFiles, { isLoading: isUploading }] = useUploadFilesMutation();
    const [applyJob, { isLoading: isApplying }] = useApplyJobMutation();

    const { data: jobData, isLoading: jobLoading } = useGetJobByIdQuery(jobId, {
        skip: !jobId || jobId === 'undefined'
    });
    const job = jobData?.data;

    const { data: questionsData, isLoading: questionsLoading } = useGetJobQuestionsQuery(
        { jobId, params: { page: 0, size: 100 } },
        { skip: !jobId }
    );
    const questions = Array.isArray(questionsData) ? questionsData : questionsData?.content || [];

    const { data: resumes, isLoading: resumesLoading } = useGetCandidateResumesQuery({ type: 'ORIGINAL' });

    const [selectedResumeId, setSelectedResumeId] = useState(null);
    const [newlyUploadedResume, setNewlyUploadedResume] = useState(null);
    const [answers, setAnswers] = useState({});
    const [contactInfo, setContactInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        coverLetter: ''
    });

    const [errors, setErrors] = useState({});

    // 3. Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactInfo(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
        // Clear error when user types
        if (errors[questionId]) {
            setErrors(prev => ({ ...prev, [questionId]: null }));
        }
    };

    const handleSelectResume = (resumeId, isNew = false) => {
        setSelectedResumeId(resumeId);
        if (!isNew) {
            setNewlyUploadedResume(null);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('files', file);

        try {
            const uploadRes = await uploadFiles(formData).unwrap();

            const mockResumeResponse = {
                id: 34, 
                fileName: uploadRes[0].originalFileName,
                status: "DRAFT"
            };

            setNewlyUploadedResume(mockResumeResponse);
            setSelectedResumeId(mockResumeResponse.id);
            toast.success("Resume uploaded and selected successfully!");
        } catch (err) {
            toast.error("Failed to upload file.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedResumeId) {
            toast.error("Please select or upload a resume.");
            return;
        }

        // Validation
        const newErrors = {};
        
        // Validate Personal Info
        if (!contactInfo.fullName.trim()) newErrors.fullName = "Full Name is required";
        if (!contactInfo.email.trim()) {
            newErrors.email = "Email Address is required";
        } else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
             newErrors.email = "Email Address is invalid";
        }
        if (!contactInfo.phone.trim()) newErrors.phone = "Phone Number is required";

        // Validate Questions
        questions.forEach(q => {
            if (q.isRequired && !answers[q.id]?.trim()) {
                newErrors[q.id] = "This answer is required";
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Please check your input and try again.");
            return;
        }

        const payload = {
            jobId: parseInt(jobId),
            resumeId: selectedResumeId,
            ...contactInfo,
            answers: Object.keys(answers).map(qId => ({
                questionId: parseInt(qId),
                answerContent: answers[qId]
            }))
        };

        try {
            // Gọi API nộp đơn
            await applyJob(payload).unwrap();
            toast.success("Application submitted successfully!");
            navigate(`/jobs/${jobId}/application/success`, { state: { companyName: job?.company?.name } });
        } catch (err) {
            const errorData = err?.data;
            const errorCode = errorData?.code;

            if (errorCode) {
                switch (errorCode) {
                    case APPLICATION_ERROR_CODE.MAX_APPLY_ATTEMPTS_REACHED:
                        toast.error("Limit reached: You have already applied twice for this position.");
                        break;
                    case APPLICATION_ERROR_CODE.ALREADY_REJECTED_FOR_THIS_JOB:
                        toast.error("You cannot re-apply after being rejected for this role.");
                        break;
                    case APPLICATION_ERROR_CODE.CANNOT_REAPPLY_AFTER_PROCESSING:
                        toast.error("Your application is already being processed.");
                        break;
                    case APPLICATION_ERROR_CODE.REQUIRED_QUESTION_NOT_ANSWERED:
                        toast.error("Please answer all required questions marked with (*).");
                        break;

                    case APPLICATION_ERROR_CODE.RESUME_STILL_PARSING:
                        toast.error("AI is still analyzing your CV. Please wait a few seconds.");
                        break;
                    case APPLICATION_ERROR_CODE.RESUME_PARSE_FAILED:
                        toast.error("CV analysis failed. Please upload a clearer version.");
                        break;
                    case APPLICATION_ERROR_CODE.RESUME_ALREADY_DELETED:
                        toast.error("The selected resume no longer exists.");
                        break;
                    case APPLICATION_ERROR_CODE.NOT_HAVE_PERMISSION:
                        toast.error("You don't have permission to use this resume.");
                        break;

                    default:
                        toast.error(errorData.message || "An unexpected error occurred.");
                }
            } else if (err?.status === 400 && errorData?.errors) {
                Object.values(errorData.errors).forEach(msg => toast.error(msg));
            } else {
                toast.error("Server connection lost. Please try again later.");
            }
        }
    };

    useEffect(() => {
        if (resumes && resumes.length > 0) {
            const defaultResume = resumes.find(r => r.isDefault) || resumes[0];
            setSelectedResumeId(defaultResume.id);
        }
    }, [resumes]);

    const isLoading = jobLoading || resumesLoading || questionsLoading;
    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#F3F4F6]">
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F3F4F6] py-10 px-6 font-body">
            <div className="max-w-5xl mx-auto">
                <Header/>

                <Card className="!p-8 md:!p-10 border border-gray-100 bg-white shadow-sm hover:shadow-md rounded-2xl">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* STEP 1: RESUME SELECTION */}
                        <ResumeSelection
                            resumes={resumes}
                            selectedResumeId={selectedResumeId}
                            newlyUploadedResume={newlyUploadedResume}
                            isUploading={isUploading}
                            onSelectResume={handleSelectResume}
                            onUpload={handleFileUpload}
                        />

                        {/* STEP 2: PERSONAL INFO */}
                        <PersonalInfo
                            contactInfo={contactInfo}
                            onChange={handleInputChange}
                        />

                        {/* STEP 3: QUESTIONS */}
                        <JobQuestions
                            questions={questions}
                            answers={answers}
                            onAnswerChange={handleAnswerChange}
                            errors={errors}
                        />

                        {/* STEP 4: COVER LETTER */}
                        <CoverLetter
                            contactInfo={contactInfo}
                            onChange={handleInputChange}
                            stepNumber={questions.length > 0 ? "04" : "03"}
                        />

                        {/* SUBMIT SECTION */}
                        <SubmitCTA isApplying={isApplying} />
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Application;
