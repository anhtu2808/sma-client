import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMarkAsReadMutation } from '@/apis/notificationApi';
import { useNavigate } from 'react-router-dom';
import { hidePreview } from '../../notification/components/notification-slice';
import { useDispatch } from 'react-redux';


dayjs.extend(relativeTime);

const NotificationItem = ({ noti }) => {
    const [markAsRead] = useMarkAsReadMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getIconConfig = (type) => {
        switch (type) {
            case 'CV_PARSE_FAILED':
                return { icon: 'error', color: 'text-red-500' };
            default:
                return { icon: 'notifications', color: 'text-orange-500' };
        }
    };

    const config = getIconConfig(noti.notificationType);

    const handleViewDetails = async (e) => {
        if (e) e.stopPropagation();

        dispatch(hidePreview());
        if (!noti.isRead) {
            try {
                await markAsRead(noti.id).unwrap();
            } catch (err) {
                console.error("Lỗi:", err);
            }
        }

        switch (noti.notificationType) {
            case 'CV_PARSE_FAILED':
                navigate('/dashboard/resumes');
                break;
            default:
                console.log("No specific route for this type");
        }
    };

    const handleDismiss = (e) => {
        e.stopPropagation();
        console.log("Dismissed noti:", noti.id);
    };

    return (
        <div
            className={`group rounded-xl p-5 shadow-sm border transition-all hover:shadow-md relative ${!noti.isRead
                ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/20'
                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 hover:border-gray-200'
                }`}
        >
            {!noti.isRead && (
                <div className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-white dark:ring-gray-800"></div>
            )}

            <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-sm ${!noti.isRead ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                        <span className={`material-symbols-outlined ${config.color}`}>{config.icon}</span>
                    </div>
                </div>

                <div className="flex-1 pr-4">
                    <div className="flex justify-between items-start">
                        <h3 className={`text-base font-bold transition-colors ${!noti.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                            {noti.title}
                        </h3>
                        <span className="text-xs text-subtext-light whitespace-nowrap ml-2">
                            {dayjs(noti.createdAt).fromNow()}
                        </span>
                    </div>
                    <p className={`mt-1 text-sm line-clamp-2 ${!noti.isRead ? 'text-gray-600 dark:text-gray-300' : 'text-subtext-light'
                        }`}>
                        {noti.message}
                    </p>

                    <div className="mt-3 flex gap-3">
                        <button
                            onClick={handleViewDetails}
                            className="text-xs font-bold text-white bg-primary hover:bg-primary-hover px-3 py-1.5 rounded-md transition-all shadow-sm shadow-primary/20"
                        >
                            View Details
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="text-xs font-bold text-subtext-light hover:text-text-light px-3 py-1.5 rounded-md hover:bg-white dark:hover:bg-gray-800 transition-all"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;