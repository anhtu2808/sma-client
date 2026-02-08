import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from '@/pages/layout';
import UiKit from '@/pages/ui-kit';
import Home from '@/pages/home';
import Login from '@/pages/login';
import Register from '@/pages/register';
import Jobs from '@/pages/jobs';
import JobDetail from '@/pages/job-detail';
import DashboardLayout from '@/pages/dashboard/layout';
import DashboardOverview from '@/pages/dashboard/overview';
import DashboardJobs from '@/pages/dashboard/jobs';
import Setting from '@/pages/dashboard/setting';
import Notification from '@/pages/dashboard/notification';
import Resumes from '@/pages/dashboard/resumes';
import Profile from '@/pages/dashboard/profile';
import CompanyList from '@/pages/company/CompanyList';

export const routes = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="ui-kit" element={<UiKit />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="jobs/:id" element={<JobDetail />} />
                <Route path="companies" element={<CompanyList />} />
            </Route>
            <Route path="dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="jobs" element={<DashboardJobs />} />
                <Route path="setting" element={<Setting />} />
                <Route path="notification" element={<Notification />} />
                <Route path="resumes" element={<Resumes />} />
                <Route path="profile" element={<Profile />} />
            </Route>
        </>
    )
);
