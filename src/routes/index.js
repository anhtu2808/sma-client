import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom";
import Layout from '@/pages/layout';
import UiKit from '@/pages/ui-kit';
import Home from '@/pages/home';
import Login from '@/pages/login';
import Register from '@/pages/register';
import ForgotPassword from '@/pages/forgot-password';
import Jobs from '@/pages/jobs';
import JobDetail from '@/pages/job-detail';
import DashboardLayout from '@/pages/dashboard/layout';
import DashboardJobs from '@/pages/dashboard/jobs';
import NotificationSettings from '@/pages/dashboard/setting';
import Notification from '@/pages/dashboard/notification';
import Resumes from '@/pages/dashboard/resumes';
import CvBuilder from '@/pages/dashboard/resumes/cv-builder';
import ResumeEditor from '@/pages/dashboard/resumes/editor';
import TemplateSelection from '@/pages/dashboard/resumes/template-selection';
import Profile from '@/pages/dashboard/profile';
import Invitations from '@/pages/dashboard/invitations';
import BillingPlans from '@/pages/dashboard/billings';
import PaymentHistory from '@/pages/dashboard/payment-history';
import Usage from '@/pages/dashboard/usage';
import CompanyList from '@/pages/company';
import CompanyDetail from '@/pages/company-detail';
import PricingPage from "@/pages/pricing";
import Application from "@/pages/application";
import ApplicationSuccess from "@/pages/application/sucess";
import Checkout from "@/pages/checkout";
import MatchReport from "@/pages/match-report";
import MatchingHistory from "@/pages/dashboard/matching-history";
import ResetPassword from "@/pages/reset-password";
import VerifyEmail from "@/pages/verify-email";
import Enhancements from "@/pages/match-report/enhancements";
import CvPreview from "@/pages/cv-preview";
import ToastTest from "@/pages/ui-kit/toast";
import LegalPage from '@/pages/legal';
import NotFound from '@/pages/not-found';


export const routes = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="verify-email" element={<VerifyEmail />} />
            </Route>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="ui-kit" element={<UiKit />} />
                <Route path="ui-kit/toast" element={<ToastTest />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="jobs/:id" element={<JobDetail />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="companies">
                    <Route index element={<CompanyList />} />
                    <Route path=":id" element={<CompanyDetail />} />
                </Route>
                <Route path="jobs/:id/application" element={<Application />} />
                <Route path="jobs/:id/application/success" element={<ApplicationSuccess />} />
            </Route>
            <Route path="cv-preview/:id" element={<CvPreview />} />
            <Route path="match-report/:evaluationId" element={<MatchReport />} />
            <Route path="match-report/:evaluationId/enhancements/:enhancementId" element={<Enhancements />} />

            <Route path="dashboard" element={<DashboardLayout />}>
                <Route index element={<Profile />} />
                <Route path="jobs" element={<DashboardJobs />} />
                <Route path="matching-history" element={<MatchingHistory />} />
                <Route path="setting" element={<NotificationSettings />} />
                <Route path="invitations" element={<Invitations />} />
                <Route path="notifications" element={<Notification />} />
                <Route path="resumes">
                    <Route index element={<Resumes />} />
                    <Route path="templates" element={<TemplateSelection />} />
                </Route>
                <Route path="profile" element={<Navigate to="/dashboard" replace />} />
                <Route path="billing-plans" element={<BillingPlans />} />
                <Route path="payment-history" element={<PaymentHistory />} />
                <Route path="usage" element={<Usage />} />
            </Route>
            <Route path="dashboard/resumes/builder" element={<CvBuilder />} />
            <Route path="dashboard/resumes/builder/:id" element={<CvBuilder />} />
            <Route path="dashboard/resumes/editor/:resumeId" element={<ResumeEditor />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="legal/:type" element={<LegalPage />} />
            <Route path="*" element={<NotFound />} />
        </>
    )
);
