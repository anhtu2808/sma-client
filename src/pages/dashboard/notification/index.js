import React, { useMemo, useState } from 'react';
import { Row, Col } from 'antd';
import { useGetNotificationsQuery, useMarkAllAsReadMutation } from '@/apis/notificationApi';
import NotificationItem from './components/notification-item';
import Loading from '@/components/Loading';
import SearchInput from '@/components/SearchInput';
import { ChevronLeft, ChevronRight, } from 'lucide-react';

const NOTIFICATION_TABS = [
    { key: "all", label: "All", filter: { isRead: null, types: null } },
    { key: "unread", label: "Unread", filter: { isRead: false, types: null } },
    { key: "applications", label: "Applications", filter: { isRead: null, types: ['APPLICATION_STATUS'] } },
    { key: "invitations", label: "Invitations", filter: { isRead: null, types: ['INVITATION'] } },
    { key: "payment", label: "Payments", filter: { isRead: null, types: ['PAYMENT_SUCCESS', 'PAYMENT_FAILURE'] } },
    { key: "system", label: "System Alerts", filter: { isRead: null, types: ['CV_PARSE_FAILED', 'SYSTEM'] } },
];

const NotificationList = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [filter, setFilter] = useState({ page: 0, size: 10, isRead: null, type: null, keyword: '' });
    const hasAccessToken = Boolean(localStorage.getItem("accessToken"));

    const { data, isLoading } = useGetNotificationsQuery(filter, {
        skip: !hasAccessToken
    });
    const [markAllAsRead] = useMarkAllAsReadMutation();

    const paging = data?.data?.notifications;
    const notifications = useMemo(() => paging?.content || [], [paging]);
    const unreadCount = data?.data?.unreadCount || 0;

    const handleTabChange = (tab) => {
        setActiveTab(tab.key);
        setFilter(prev => ({ ...prev, ...tab.filter, page: 0 }));
    };

    const getPageNumbers = (page, totalPages) => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 0; i < totalPages; i++) pages.push(i);
        } else {
            const start = Math.max(0, page - 2);
            const end = Math.min(totalPages, page + 3);

            if (start > 0) pages.push(0, '...');
            for (let i = start; i < end; i++) pages.push(i);
            if (end < totalPages) pages.push('...', totalPages - 1);
        }

        return pages;
    };

    return (
        <Row gutter={[24, 24]}>
            <Col span={24}>
                {/* Header Section  */}
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
                                            ? (isActive ? "bg-red-500 text-white" : "bg-red-100 text-red-600")
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
                        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800">
                            <Loading className="py-0" />
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

                    {/* Pagination  */}
                    {paging?.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 px-2">
                            <p className="text-sm text-subtext-light dark:text-subtext-dark">
                            </p>
                            <div className="flex items-center gap-2">

                                {/* Previous */}
                                <button
                                    onClick={() => setFilter({ ...filter, page: Math.max(0, filter.page - 1) })}
                                    disabled={paging.first}
                                    className={`p-2 rounded-xl transition-all ${paging.first
                                        ? "text-gray-200"
                                        : "text-gray-400 hover:bg-gray-100"
                                        }`}
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {/* Page numbers */}
                                <div className="flex items-center gap-1">
                                    {getPageNumbers(filter.page, paging.totalPages).map((p, index) =>
                                        p === "..." ? (
                                            <span
                                                key={`dots-${index}`}
                                                className="px-2 text-gray-300 font-black text-xs"
                                            >
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={`page-${p}`}
                                                onClick={() => setFilter({ ...filter, page: p })}
                                                className={`w-8 h-8 text-[10px] font-black rounded-lg transition-all ${filter.page === p
                                                    ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                                                    : "text-gray-500 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {p + 1}
                                            </button>
                                        )
                                    )}
                                </div>

                                {/* Next */}
                                <button
                                    onClick={() =>
                                        setFilter({ ...filter, page: filter.page + 1 })
                                    }
                                    disabled={paging.last}
                                    className={`p-2 rounded-xl transition-all ${paging.last
                                        ? "text-gray-200"
                                        : "text-gray-400 hover:bg-gray-100"
                                        }`}
                                >
                                    <ChevronRight size={16} />
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
