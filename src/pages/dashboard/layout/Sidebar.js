import React from 'react';
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGetNotificationsQuery } from '@/apis/notificationApi';
import { useGetInvitationStatusCountQuery } from '@/apis/invitationApi';
import { useCandidateDashboardProfileQuery } from '@/apis/candidateApi';
import CvVisibilityControl from "@/pages/dashboard/layout/cv-visibility-control";
import {
    faUser, faFileLines, faClipboardCheck, faClockRotateLeft, faEnvelope,
    faBell, faCreditCard, faGear,
} from '../../../utils/icons';
const Sidebar = () => {


    const { data } = useGetNotificationsQuery({
        page: 0,
        size: 1,
        isRead: false
    });
    const unreadCount = data?.data?.unreadCount || 0;

    const { data: invitationStatusCount } = useGetInvitationStatusCountQuery();
    const pendingInvitationCount = invitationStatusCount?.statuses?.find(s => s.status === "INVITED")?.count || 0;

    const { data: profile } = useCandidateDashboardProfileQuery();
    const profileCompleteness = profile?.profileCompleteness ?? 0;

    const sidebarItems = [

        { to: "/dashboard", icon: faUser, label: "Profile", end: true },
        { to: "/dashboard/resumes", icon: faFileLines, label: "Resumes" },
        { to: "/dashboard/matching-history", icon: faClipboardCheck, label: "Resume Checker" },
        { to: "/dashboard/jobs", icon: faClockRotateLeft, label: "My Jobs" },
        {
            to: "/dashboard/invitations",
            icon: faEnvelope,
            label: "Job Invitation",
            badge: pendingInvitationCount > 0 ? pendingInvitationCount : null,
        },
        { to: "/dashboard/notifications", icon: faBell, label: "Notifications", badge: unreadCount > 0 ? unreadCount : null },
        { to: "/dashboard/billing-plans", icon: faCreditCard, label: "Billing & Plans" },
        { to: "/dashboard/payment-history", icon: faClockRotateLeft, label: "Payment History" },
        { to: "/dashboard/usage", icon: faClockRotateLeft, label: "Usage" },
        { to: "/dashboard/setting", icon: faGear, label: "Settings" },
    ];

    return (
        <aside className="h-full">
            <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col">
                <CvVisibilityControl />

                <div className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
                    {sidebarItems.map((item) => (
                        <NavLink key={`${item.label}-${item.to}`} to={item.to} end={item.end}>
                            {({ isActive }) => (
                                <div
                                    className={`group flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-xl ${isActive
                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                                        }`}
                                >
                                    <FontAwesomeIcon
                                        icon={item.icon}
                                        className={`text-[20px] transition-colors ${isActive
                                            ? "text-white"
                                            : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                                            }`}
                                    />
                                    <span className="flex-1">{item.label}</span>
                                    {item.badge ? (
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                            {item.badge}
                                        </span>
                                    ) : null}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-50 dark:border-gray-800/50">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700/50 text-center">
                        <p className="text-xs text-gray-500 mb-3">Complete your profile to get more visibility</p>
                        <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-1">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${profileCompleteness}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-primary">{profileCompleteness}% Completed</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
