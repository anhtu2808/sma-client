import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useGetJobByIdQuery, useGetJobQuestionsQuery } from '@/apis/jobApi';
import {
    useGetCandidateResumesQuery,
    useGetResumeByIdQuery,
    useParseCandidateResumeMutation,
    useUploadCandidateResumeMutation,
    useUploadFilesMutation,
} from '@/apis/resumeApi';
import { useGetInvitationByIdQuery } from '@/apis/invitationApi';
import { useApplyJobMutation } from '@/apis/applicationApi';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import { toast } from 'react-toastify';
import { APPLICATION_ERROR_CODE } from '@/constant';
import { useStartMatchingDetailMutation } from "@/apis/matchingApi";

import ResumeSelection from '@/pages/application/steps/ResumeSelection';
import PersonalInfo from '@/pages/application/steps/PersonalInfo';
import JobQuestions from '@/pages/application/steps/JobQuestions';
import CoverLetter from '@/pages/application/steps/CoverLetter';

import Header from '@/pages/application/header';
import SubmitCTA from './submit-cta';

const isSupportedResumeFile = (fileName = '') => /\.(pdf|doc|docx)$/i.test((fileName || '').trim());

const normalizeResumeList = (resumes) => (
    Array.isArray(resumes) ? resumes : resumes?.content || []
);

const buildLockedResume = (resumeDetail, invitation) => {
    if (resumeDetail?.id) {
        return resumeDetail;
    }

    const invitedResume = invitation?.candidate;
    if (!invitedResume?.resumeId) {
        return null;
    }

    return {
        id: invitedResume.resumeId,
        resumeName: invitedResume.resumeName,
        fileName: invitedResume.resumeName,
        resumeUrl: invitedResume.resumeUrl,
        type: invitedResume.resumeType,
    };
};

const Application = () => {
    const { id: jobId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const invitationIdFromQuery = new URLSearchParams(location.search).get('invitationId');
    const invitationId = invitationIdFromQuery || location.state?.invitationId || null;
    const suggestedResumeId = location.state?.preselectedResumeId ?? location.state?.presetResumeId;

    const [uploadFiles, { isLoading: isUploadingFile }] = useUploadFilesMutation();
    const [uploadCandidateResume, { isLoading: isSavingResume }] = useUploadCandidateResumeMutation();
    const [parseCandidateResume] = useParseCandidateResumeMutation();
    const [applyJob, { isLoading: isApplying }] = useApplyJobMutation();
    const [startMatchingDetail, { isLoading: isStartingMatching }] = useStartMatchingDetailMutation();
    const { data: jobData, isLoading: jobLoading } = useGetJobByIdQuery(jobId, {
        skip: !jobId || jobId === 'undefined'
    });
    const job = jobData?.data;

    const { data: questionsData, isLoading: questionsLoading } = useGetJobQuestionsQuery(
        { jobId, params: { page: 0, size: 100 } },
        { skip: !jobId }
    );
    const questions = Array.isArray(questionsData) ? questionsData : questionsData?.content || [];

    const {
        data: invitation,
        isLoading: invitationLoading,
    } = useGetInvitationByIdQuery(invitationId, { skip: !invitationId });

    const isAcceptedInvitation = invitation?.status === 'ACCEPTED';
    const invitedResumeId = invitation?.candidate?.resumeId ?? null;
    const isResumeLocked = Boolean(invitationId && isAcceptedInvitation);

    const {
        data: resumes,
        isLoading: resumesLoading,
    } = useGetCandidateResumesQuery(
        { type: 'ORIGINAL', jobId },
        { skip: !jobId || isResumeLocked }
    );

    const {
        data: invitedResumeDetail,
        isLoading: invitedResumeLoading,
        isError: invitedResumeError,
    } = useGetResumeByIdQuery(invitedResumeId, {
        skip: !isResumeLocked || !invitedResumeId,
    });

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

    const candidateResumes = useMemo(() => normalizeResumeList(resumes), [resumes]);
    const lockedResume = useMemo(
        () => buildLockedResume(invitedResumeDetail, invitation),
        [invitedResumeDetail, invitation]
    );
    const isLockedResumeUnavailable = isResumeLocked && (!invitedResumeId || invitedResumeError);
    const availableResumes = useMemo(
        () => (isResumeLocked ? (lockedResume ? [lockedResume] : []) : candidateResumes),
        [candidateResumes, isResumeLocked, lockedResume]
    );

    useEffect(() => {
        if (!isResumeLocked) {
            return;
        }

        setSelectedResumeId(invitedResumeId ?? null);
        setNewlyUploadedResume(null);
    }, [isResumeLocked, invitedResumeId]);

    useEffect(() => {
        if (isResumeLocked || !suggestedResumeId || selectedResumeId) return;
        const found = availableResumes.find((resume) => resume?.id === suggestedResumeId);
        if (found) {
            setSelectedResumeId(found.id);
        }
    }, [availableResumes, isResumeLocked, selectedResumeId, suggestedResumeId]);

    useEffect(() => {
        if (isResumeLocked || selectedResumeId) return;
        if (availableResumes.length > 0) {
            const defaultResume = availableResumes.find((resume) => resume.isDefault) || availableResumes[0];
            setSelectedResumeId(defaultResume.id);
        }
    }, [availableResumes, isResumeLocked, selectedResumeId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactInfo((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
        if (errors[questionId]) {
            setErrors((prev) => ({ ...prev, [questionId]: null }));
        }
    };

    const handleSelectResume = (resumeId, isNew = false) => {
        if (isResumeLocked) {
            return;
        }

        setSelectedResumeId(resumeId);
        if (!isNew) {
            setNewlyUploadedResume(null);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || isResumeLocked) return;

        const formData = new FormData();
        formData.append('files', file);

        try {
            const uploadRes = await uploadFiles(formData).unwrap();
            const uploadedFile = Array.isArray(uploadRes) ? uploadRes[0] : null;

            if (!uploadedFile?.downloadUrl) {
                throw new Error("Upload file failed.");
            }

            const createdResume = await uploadCandidateResume({
                resumeName: file.name,
                fileName: uploadedFile.originalFileName || file.name,
                resumeUrl: uploadedFile.downloadUrl,
            }).unwrap();

            const uploadedFileName = (uploadedFile.originalFileName || file.name || "").toLowerCase();
            if (isSupportedResumeFile(uploadedFileName) && createdResume?.id) {
                const parseResult = await parseCandidateResume({ resumeId: createdResume.id });
                if ("error" in parseResult) {
                    toast("Resume uploaded. AI parsing is currently unavailable; you can parse manually from Dashboard later.");
                }
            }

            setNewlyUploadedResume(createdResume);
            setSelectedResumeId(createdResume?.id ?? null);
            toast.success("Resume uploaded and selected successfully!");
        } catch (err) {
            const message = err?.data?.message || err?.message || "Failed to upload resume.";
            toast.error(message);
        } finally {
            e.target.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLockedResumeUnavailable) {
            toast.error("The invited resume is no longer available. Please contact the recruiter.");
            return;
        }

        if (isResumeLocked && invitedResumeId && selectedResumeId !== invitedResumeId) {
            toast.error("You must apply with the invited resume that you accepted.");
            return;
        }

        if (!selectedResumeId) {
            toast.error("Please select or upload a resume.");
            return;
        }

        const newErrors = {};

        if (!contactInfo.fullName.trim()) newErrors.fullName = "Full Name is required";
        if (!contactInfo.email.trim()) {
            newErrors.email = "Email Address is required";
        } else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
            newErrors.email = "Email Address is invalid";
        }
        if (!contactInfo.phone.trim()) newErrors.phone = "Phone Number is required";

        questions.forEach((question) => {
            if (question.isRequired && !answers[question.id]?.trim()) {
                newErrors[question.id] = "This answer is required";
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Please check your input and try again.");
            return;
        }

        const payload = {
            jobId: parseInt(jobId, 10),
            resumeId: selectedResumeId,
            ...contactInfo,
            answers: Object.keys(answers).map((questionId) => ({
                questionId: parseInt(questionId, 10),
                answerContent: answers[questionId]
            }))
        };

        try {
            await applyJob(payload).unwrap();
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
                Object.values(errorData.errors).forEach((message) => toast.error(message));
            } else {
                toast.error("Server connection lost. Please try again later.");
            }
        }
    };

    const isUploading = isUploadingFile || isSavingResume;
    const isLoading = jobLoading
        || questionsLoading
        || (Boolean(invitationId) && invitationLoading)
        || (isResumeLocked ? invitedResumeLoading : resumesLoading);

    const handleCheckMatch = async (resumeId) => {
        try {
            const evaluationId = await startMatchingDetail({
                jobId: parseInt(jobId, 10),
                resumeId,
            }).unwrap();

            if (evaluationId) {
                navigate(`/match-report/${evaluationId}`, {
                    state: { jobId, resumeId, matchSource: "new" }
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("AI matching failed to start. Please try again.");
        }
    };

    if (isLoading) {
        return <Loading fullScreen className="bg-[#F3F4F6]" />;
    }

    return (
        <div className="min-h-screen bg-[#F3F4F6] py-10 px-6 font-body">
            <div className="max-w-7xl mx-auto">
                <Header />

                <Card className="!p-8 md:!p-10 border border-gray-100 bg-white shadow-sm hover:shadow-md rounded-2xl">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <ResumeSelection
                            jobId={jobId}
                            resumes={availableResumes}
                            selectedResumeId={selectedResumeId}
                            newlyUploadedResume={newlyUploadedResume}
                            isUploading={isUploading}
                            onSelectResume={handleSelectResume}
                            onUpload={handleFileUpload}
                            onCheckMatch={handleCheckMatch}
                            isStartingMatching={isStartingMatching}
                            isLocked={isResumeLocked}
                            lockedMessage={
                                isLockedResumeUnavailable
                                    ? 'The invited resume is no longer available. Please contact the recruiter for an updated invitation.'
                                    : 'You accepted this invitation, so this application is locked to the invited resume.'
                            }
                        />

                        <PersonalInfo
                            contactInfo={contactInfo}
                            onChange={handleInputChange}
                        />

                        <JobQuestions
                            questions={questions}
                            answers={answers}
                            onAnswerChange={handleAnswerChange}
                            errors={errors}
                        />

                        <CoverLetter
                            contactInfo={contactInfo}
                            onChange={handleInputChange}
                            stepNumber={questions.length > 0 ? "04" : "03"}
                        />

                        <SubmitCTA isApplying={isApplying} />
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Application;
