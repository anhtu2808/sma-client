import React from 'react';
import { Drawer } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } from '@/apis/notificationApi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from '@/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBriefcase, faCircleCheck, faCircleExclamation, faCreditCard, faEnvelope } from '../../../utils/icons';

dayjs.extend(relativeTime);

const getIconConfig = (type) => {
    switch (type) {
        case 'CV_PARSE_FAILED':
            return { icon: faCircleExclamation, color: 'text-red-500', bg: 'bg-red-50' };
        case 'PAYMENT_SUCCESS':
            return { icon: faCircleCheck, color: 'text-green-500', bg: 'bg-green-50' };
        case 'PAYMENT_FAILURE':
            return { icon: faCreditCard, color: 'text-red-500', bg: 'bg-red-50' };
        case 'APPLICATION_STATUS':
            return { icon: faBriefcase, color: 'text-blue-500', bg: 'bg-blue-50' };
        case 'SYSTEM':
            return { icon: faCircleExclamation, color: 'text-red-500', bg: 'bg-red-50' };
        case 'INVITATION':
            return { icon: faEnvelope, color: 'text-indigo-500', bg: 'bg-indigo-50' };
        default:
            return { icon: faBell, color: 'text-orange-500', bg: 'bg-orange-50' };
    }
};

const getRoute = (type) => {
    switch (type) {
        case 'CV_PARSE_FAILED': return '/dashboard/resumes';
        case 'PAYMENT_SUCCESS':
        case 'PAYMENT_FAILURE': return '/dashboard/billing-plans';
        case 'APPLICATION_STATUS': return '/dashboard/jobs';
        case 'SYSTEM': return '/dashboard/usage';
        case 'INVITATION': return '/dashboard/invitations';
        default: return null;
    }
};

const NotificationDrawer = ({ open, onClose }) => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetNotificationsQuery(
        { page: 0, size: 10, isRead: null, type: null, keyword: '' },
        { skip: !open }
    );
    const [markAsRead] = useMarkAsReadMutation();
    const [markAllAsRead] = useMarkAllAsReadMutation();

    const notifications = data?.data?.notifications?.content || [];
    const unreadCount = data?.data?.unreadCount || 0;

    const handleClick = async (noti) => {
        if (!noti.isRead) {
            try { await markAsRead(noti.id).unwrap(); } catch { }
        }
        const route = getRoute(noti.notificationType);
        if (route) {
            onClose();
            navigate(route);
        }
    };

    const handleViewAll = () => {
        onClose();
        navigate('/dashboard/notifications');
    };

    return (
        <Drawer
            title={
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">Notifications</span>
                    {unreadCount > 0 && (
                        <button
                            onClick={() => markAllAsRead()}
                            className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>
            }
            placement="right"
            open={open}
            onClose={onClose}
            width={400}
            styles={{ body: { padding: 0 } }}
            footer={
                <Button mode="secondary" fullWidth onClick={handleViewAll}>
                    View All Notifications
                </Button>
            }
        >
            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <FontAwesomeIcon icon={faBell} className="text-4xl mb-2 block" />
                    <p className="text-sm">No notifications yet</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {notifications.map((noti) => {
                        const config = getIconConfig(noti.notificationType);
                        return (
                            <div
                                key={noti.id}
                                onClick={() => handleClick(noti)}
                                className={`flex gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-gray-50 ${!noti.isRead ? 'bg-orange-50/50' : ''}`}
                            >
                                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${config.bg}`}>
                                    <FontAwesomeIcon icon={config.icon} className={`text-lg ${config.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className={`text-sm leading-snug line-clamp-1 ${!noti.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                            {noti.title}
                                        </p>
                                        {!noti.isRead && (
                                            <span className="flex-shrink-0 mt-1.5 h-2 w-2 rounded-full bg-primary" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">{noti.message}</p>
                                    <p className="text-[11px] text-gray-400 mt-1">{dayjs(noti.createdAt).fromNow()}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Drawer>
    );
};

export default NotificationDrawer;
