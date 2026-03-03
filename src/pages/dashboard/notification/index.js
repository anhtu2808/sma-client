import React, { useMemo, useState } from 'react';
import { Row, Col } from 'antd';
import { useGetNotificationsQuery, useMarkAllAsReadMutation } from '@/apis/notificationApi';
import NotificationItem from './components/notification-item';
import SearchInput from '@/components/SearchInput';

const NOTIFICATION_TABS = [
    { key: "all", label: "All", filter: { isRead: null, type: null } },
    { key: "unread", label: "Unread", filter: { isRead: false, type: null } },
    { key: "system", label: "System Alerts", filter: { isRead: null, type: 'CV_PARSE_FAILED' } },
];

const NotificationList = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [filter, setFilter] = useState({ page: 0, size: 10, isRead: null, type: null, keyword: '' });
    const hasAccessToken = Boolean(localStorage.getItem("accessToken"));

    const { data, isLoading, isError } = useGetNotificationsQuery(filter, {
        skip: !hasAccessToken
    });
    const [markAllAsRead] = useMarkAllAsReadMutation();

    const paging = data?.data?.notifications;
    const notifications = useMemo(() => paging?.content || [], [paging]);
    const unreadCount = data?.data?.unreadCount || 0;

    const startEntry = (paging?.pageNumber || 0) * (paging?.pageSize || 10) + 1;
    const endEntry = Math.min(((paging?.pageNumber || 0) + 1) * (paging?.pageSize || 10), paging?.totalElements || 0);

    const handleTabChange = (tab) => {
        setActiveTab(tab.key);
        setFilter(prev => ({ ...prev, ...tab.filter, page: 0 }));
    };

    return (
        <Row gutter={[24, 24]}>
            <Col span={24}>
                {/* Header Section styled like DashboardJobs */}
                <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Manage your notifications and system alerts.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex-1 md:w-64">
                                <SearchInput
                                    placeholder="Search..."
                                    value={filter.keyword}
                                    size="sm"
                                    onChange={(val) => {
                                        const keyword = val?.target ? val.target.value : val;
                                        setFilter(prev => ({ ...prev, keyword, page: 0 }));
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => markAllAsRead()}
                                className="whitespace-nowrap text-xs font-bold text-primary hover:text-primary-hover transition-colors px-4 py-2 rounded-xl hover:bg-orange-50 border border-transparent hover:border-orange-100"
                            >
                                Mark all as read
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-8 border-b border-gray-100 dark:border-gray-800">
                        {NOTIFICATION_TABS.map((tab) => {
                            const isActive = tab.key === activeTab;
                            let countToDisplay = 0;
                            if (tab.key === 'unread') countToDisplay = unreadCount;

                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => handleTabChange(tab)}
                                    className={`pb-4 text-sm inline-flex items-center gap-2 border-b-2 transition-colors ${isActive
                                        ? "font-bold text-primary border-primary"
                                        : "font-medium text-gray-500 border-transparent hover:text-gray-700"
                                        }`}
                                    type="button"
                                >
                                    {tab.label}
                                    {countToDisplay > 0 && (
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${tab.key === 'system'
                                            ? (isActive ? "bg-red-500 text-white" : "bg-red-100 text-red-600") // Màu đỏ cho System
                                            : (isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-600")
                                            }`}>
                                            {countToDisplay}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </section>
            </Col>

            {/* List Content Section */}
            <Col span={24}>
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800" />
                            ))}
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map((noti) => (
                            <NotificationItem key={noti.id} noti={noti} />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-surface-dark rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                            <p className="text-gray-500">No notifications found.</p>
                        </div>
                    )}

                    {/* Pagination styled like DashboardJobs helper text */}
                    {paging?.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 px-2">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-medium text-gray-900 dark:text-white">{startEntry}</span> to{' '}
                                <span className="font-medium text-gray-900 dark:text-white">{endEntry}</span> of{' '}
                                <span className="font-medium text-gray-900 dark:text-white">{paging.totalElements}</span> results
                            </p>
                            <div className="flex gap-2">
                                <button
                                    disabled={paging.first}
                                    onClick={() => setFilter(prev => ({ ...prev, page: prev.page - 1 }))}
                                    className="px-4 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                >
                                    Previous
                                </button>
                                <button
                                    disabled={paging.last}
                                    onClick={() => setFilter(prev => ({ ...prev, page: prev.page + 1 }))}
                                    className="px-4 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Col>
        </Row>
    );
};

export default NotificationList;