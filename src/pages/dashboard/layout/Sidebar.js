import React from 'react';
import { NavLink } from "react-router-dom";

const sidebarItems = [
    { to: "/dashboard", icon: "grid_view", label: "Overview", end: true },
    { to: "/dashboard/profile", icon: "person", label: "Profile" },
    { to: "/dashboard/resumes", icon: <i className="fa-solid fa-file-lines"></i>, label: "Resumes" },
    { to: "/dashboard/jobs", icon: "work_history", label: "Job" },
    {
        to: "/dashboard/invitations",
        icon: "mail",
        label: "Job Invitation",
        badge: 3,
    },
    { to: "/dashboard/notifications", icon: "notifications", label: "Notifications" },
    { to: "/dashboard/setting", icon: "settings", label: "Settings" },
];

const Sidebar = ({ displayName }) => {
    return (
        <aside className="h-full">
            <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-50 dark:border-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-orange-400 p-[2px]">
                            <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                                <span className="font-bold text-primary dark:text-white text-lg">
                                    {displayName?.[0]?.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                {displayName}
                            </h2>
                            <p className="text-xs text-gray-500 truncate">Candidate Account</p>
                        </div>
                    </div>
                </div>

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
                                    <span
                                        className={`${typeof item.icon === 'string' ? 'material-icons-round' : ''} text-[20px] transition-colors ${isActive
                                            ? "text-white"
                                            : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                                            }`}
                                    >
                                        {item.icon}
                                    </span>
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
                            <div className="h-full bg-primary w-[75%] rounded-full"></div>
                        </div>
                        <span className="text-[10px] font-bold text-primary">75% Completed</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
