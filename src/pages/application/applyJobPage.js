import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ChevronLeft, FileText, User, Phone, Mail,
    AlertCircle, Upload, CheckCircle2, Loader2,
    Briefcase, MessageSquare, Edit3
} from 'lucide-react';
import { useGetJobByIdQuery, useGetJobQuestionsQuery } from '@/apis/jobApi';
import { useGetCandidateResumesQuery, useUploadFilesMutation } from '@/apis/resumeApi';
import { useApplyJobMutation } from '@/apis/applicationApi';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { toast } from 'react-hot-toast';

const ApplyJobPage = () => {
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

    useEffect(() => {
        if (resumes && resumes.length > 0) {
            const defaultResume = resumes.find(r => r.isDefault) || resumes[0];
            setSelectedResumeId(defaultResume.id);
        }
    }, [resumes]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
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

        const missingRequired = questions
            .filter(q => q.isRequired)
            .some(q => !answers[q.id]?.trim());

        if (missingRequired) {
            toast.error("Please answer all required questions (*).");
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
            navigate('/applications/success');
        } catch (err) {
            const errorData = err?.data;
            const errorCode = errorData?.code;

            if (errorCode) {
                switch (errorCode) {
                    case "MAX_APPLY_ATTEMPTS_REACHED":
                        toast.error("Limit reached: You have already applied twice for this position.");
                        break;
                    case "ALREADY_REJECTED_FOR_THIS_JOB":
                        toast.error("You cannot re-apply after being rejected for this role.");
                        break;
                    case "CANNOT_REAPPLY_AFTER_PROCESSING":
                        toast.error("Your application is already being processed.");
                        break;
                    case "REQUIRED_QUESTION_NOT_ANSWERED":
                        toast.error("Please answer all required questions marked with (*).");
                        break;

                    case "RESUME_STILL_PARSING":
                        toast.error("AI is still analyzing your CV. Please wait a few seconds.");
                        break;
                    case "RESUME_PARSE_FAILED":
                        toast.error("CV analysis failed. Please upload a clearer version.");
                        break;
                    case "RESUME_ALREADY_DELETED":
                        toast.error("The selected resume no longer exists.");
                        break;
                    case "NOT_HAVE_PERMISSION":
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

    const isLoading = jobLoading || resumesLoading || questionsLoading;
    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#FCFCFD]">
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <div className="relative min-h-screen bg-[#FCFCFD] py-16 px-6 font-body overflow-hidden">
            <div className="absolute top-[-5%] right-[-10%] w-[45%] h-[45%] bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[5%] left-[-10%] w-[40%] h-[40%] bg-orange-400/5 rounded-full blur-[80px]" />

            <div className="relative z-10 max-w-4xl mx-auto">
                <header className="mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors mb-6 group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Job</span>
                    </button>
                    <h1 className="text-4xl font-black text-neutral-900 font-heading tracking-tight mb-2">
                        Apply for <span className="text-primary">{job?.name}</span>
                    </h1>
                    <p className="text-neutral-500 font-medium">{job?.company?.name} • {job?.workingModel}</p>
                </header>
                {job?.appliedAttempt === 1 && (
                    <div className="mb-8 p-6 bg-amber-50 border border-amber-100 rounded-[2rem] flex items-start gap-4 shadow-sm">
                        <AlertCircle className="text-amber-500 shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-1">Final Attempt Notice</h4>
                            <p className="text-xs text-amber-700 leading-relaxed font-medium italic">
                                You have **01 final attempt** remaining. Frequent re-applications without significant updates may negatively impact the employer's perception. Please ensure your resume is updated.
                            </p>
                        </div>
                    </div>
                )}

                <Card className="!p-10 border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(255,107,53,0.1)] rounded-[2.5rem]">
                    <form onSubmit={handleSubmit} className="space-y-14">
                        <div className="space-y-6">
                            <SectionHeader title="Select Resume" step="01" icon={<Briefcase size={20} />} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {resumes?.map((resume) => (
                                    <div
                                        key={resume.id}
                                        onClick={() => {
                                            setSelectedResumeId(resume.id);
                                            setNewlyUploadedResume(null);
                                        }}
                                        className={`group relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${selectedResumeId === resume.id && !newlyUploadedResume
                                            ? 'border-primary bg-primary/5 shadow-md'
                                            : 'border-neutral-100 bg-white hover:border-primary/30'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${selectedResumeId === resume.id && !newlyUploadedResume ? 'bg-primary text-white' : 'bg-neutral-50 text-neutral-400'}`}>
                                                <FileText size={20} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-bold text-neutral-800 truncate pr-4">{resume.resumeName || resume.fileName}</p>
                                                <p className="text-[10px] font-bold text-neutral-400 uppercase mt-1">Verified by AI</p>
                                            </div>
                                        </div>
                                        {selectedResumeId === resume.id && !newlyUploadedResume && (
                                            <CheckCircle2 className="text-primary" size={20} />
                                        )}
                                    </div>
                                ))}

                                {newlyUploadedResume && (
                                    <div
                                        onClick={() => setSelectedResumeId(newlyUploadedResume.id)}
                                        className={`group relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${selectedResumeId === newlyUploadedResume.id
                                            ? 'border-green-500 bg-green-50 shadow-md'
                                            : 'border-neutral-100 bg-white hover:border-green-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${selectedResumeId === newlyUploadedResume.id ? 'bg-green-500 text-white' : 'bg-neutral-50 text-neutral-400'}`}>
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-bold text-neutral-800 truncate pr-4">{newlyUploadedResume.fileName}</p>
                                                <p className="text-[10px] font-bold text-green-600 uppercase mt-1">Newly Uploaded</p>
                                            </div>
                                        </div>
                                        {selectedResumeId === newlyUploadedResume.id && (
                                            <div className="bg-green-500 rounded-full p-1 text-white scale-110">
                                                <CheckCircle2 size={16} />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <label className="flex items-center justify-center gap-3 p-5 border-2 border-dashed border-neutral-200 rounded-2xl cursor-pointer hover:bg-neutral-50 hover:border-primary/40 transition-all group">
                                    {isUploading ? <Loader2 className="animate-spin text-primary" /> : <Upload size={20} className="text-neutral-400 group-hover:text-primary" />}
                                    <span className="text-sm font-bold text-neutral-500 group-hover:text-primary">Upload New CV</span>
                                    <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
                                </label>
                            </div>
                        </div>

                        {/* STEP 2: PERSONAL INFO */}
                        <div className="space-y-6">
                            <SectionHeader title="Personal Information" step="02" icon={<User size={20} />} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    label={<span>Full Name <span className="text-red-500">*</span></span>}
                                    name="fullName"
                                    required
                                    value={contactInfo.fullName}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                />
                                <Input
                                    label={<span>Email Address <span className="text-red-500">*</span></span>}
                                    name="email"
                                    type="email"
                                    required
                                    value={contactInfo.email}
                                    onChange={handleInputChange}
                                    placeholder="john@example.com"
                                />
                                <Input
                                    label={<span>Phone Number <span className="text-red-500">*</span></span>}
                                    name="phone"
                                    required
                                    className="md:col-span-2"
                                    value={contactInfo.phone}
                                    onChange={handleInputChange}
                                    placeholder="+84 900 000 000"
                                />
                            </div>
                        </div>

                        {/* STEP 3: QUESTIONS */}
                        {questions.length > 0 && (
                            <div className="space-y-6">
                                <SectionHeader title="Application Questions" step="03" icon={<MessageSquare size={20} />} />
                                <div className="space-y-6">
                                    {questions.map((q) => (
                                        <div key={q.id} className="p-6 bg-neutral-50/50 rounded-2xl border border-neutral-100">
                                            <label className="block text-sm font-bold text-neutral-800 mb-4 leading-relaxed">
                                                {q.question} {q.isRequired && <span className="text-red-500">*</span>}
                                            </label>
                                            <Input.TextArea
                                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                placeholder="Type your answer here..."
                                                rows={3}
                                                className="!bg-white"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 4: COVER LETTER */}
                        <div className="space-y-6">
                            <SectionHeader
                                title="Cover Letter"
                                step={questions.length > 0 ? "04" : "03"}
                                icon={<Edit3 size={20} />}
                            />
                            <Input.TextArea
                                name="coverLetter"
                                value={contactInfo.coverLetter}
                                onChange={handleInputChange}
                                placeholder="Tell the recruiter why you're the best fit for this role..."
                                rows={6}
                                className="!rounded-3xl"
                            />
                        </div>

                        {/* SUBMIT SECTION */}
                        <div className="pt-8 border-t border-neutral-100">
                            <div className="flex items-start gap-4 p-5 bg-primary/5 rounded-2xl border border-primary/10 mb-8">
                                <AlertCircle className="text-primary shrink-0" size={20} />
                                <p className="text-xs font-medium text-neutral-600 leading-relaxed">
                                    By submitting this application, you agree to share your profile details and selected resume with the hiring team.
                                </p>
                            </div>
                            <Button
                                mode="primary"
                                fullWidth
                                type="submit"
                                disabled={isApplying}
                            >
                                {isApplying ? (
                                    <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Submitting...</span>
                                ) : "Submit Application"}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

const SectionHeader = ({ title, step, icon }) => (
    <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
            {icon}
        </div>
        <div className="flex items-center gap-3 flex-1">
            <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-neutral-200 to-transparent" />
            <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">Step {step}</span>
        </div>
    </div>
);

export default ApplyJobPage;