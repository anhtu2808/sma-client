import React from 'react';
import toastMessage from "@/utils/toastMessage";
import { useGetNotificationSettingsQuery, useUpdateNotificationSettingMutation, useResetSettingsMutation } from '@/apis/notificationApi';
import Loading from '@/components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBriefcase, faCertificate, faCreditCard, faEnvelope } from '../../../utils/icons';

const NotificationSettings = () => {
    const { data: settingsResponse, isLoading } = useGetNotificationSettingsQuery();
    const [updateSetting, { isLoading: isUpdating }] = useUpdateNotificationSettingMutation();
    const [resetSettings, { isLoading: isResetting }] = useResetSettingsMutation();

    const settings = settingsResponse?.data || [];

    const handleResetAll = async () => {
        try {
            await resetSettings().unwrap();
            toastMessage.success('All settings have been reset to default');
        } catch (error) {
            toastMessage.error('Failed to reset settings');
        }
    };

    const NOTI_DISPLAY_CONFIG = [
        {
            key: 'APPLICATION_STATUS',
            title: 'Application Progress',
            desc: 'Get notified when your application have change.',
            group: 'applications'
        },
        {
            key: 'INVITATION',
            title: 'Job Invitations',
            desc: 'Receive requests from recruiters for interviews or direct job applications.',
            group: 'invitations'
        },
        {
            key: 'PAYMENT_GROUP',
            title: 'Payments',
            desc: 'Confirmations for successful transactions and alerts for billing failures.',
            group: 'payment',
            subTypes: ['PAYMENT_SUCCESS', 'PAYMENT_FAILURE']
        },
        {
            key: 'CV_PARSE_FAILED',
            title: 'CV Analysis',
            desc: 'Alerts when our AI cannot correctly analyze your uploaded resume file.',
            group: 'system'
        },
        {
            key: 'SYSTEM',
            title: 'Platform Maintenance',
            desc: 'Updates about quota limit reached, new features, or security news.',
            group: 'system'
        }
    ];

    const GROUPS = [
        { id: 'applications', title: 'Applications', icon: faBriefcase },
        { id: 'invitations', title: 'Invitations', icon: faEnvelope },
        { id: 'payment', title: 'Payments', icon: faCreditCard },
        { id: 'system', title: 'System Alerts', icon: faBell }
    ];

    const handleToggle = async (displayItem, field, value) => {
        try {
            if (displayItem.subTypes) {
                await Promise.all(
                    displayItem.subTypes.map(type =>
                        updateSetting({ notificationType: type, [field]: value }).unwrap()
                    )
                );
            } else {
                await updateSetting({ notificationType: displayItem.key, [field]: value }).unwrap();
            }
            toastMessage.success('Setting updated successfully');
        } catch (error) {
            toastMessage.error('Failed to update setting');
        }
    };

    if (isLoading) return <Loading className="h-[50vh]" />;

    return (
        <main className="flex-1 space-y-6 animate-fadeIn font-sans mx-auto">
            <div className="pt-8 pb-8 pl-4 pr-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage how you receive alerts and system updates.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <button
                            onClick={handleResetAll}
                            disabled={isResetting}
                            className="whitespace-nowrap text-xs font-bold text-primary hover:text-primary-hover transition-colors px-4 py-2 rounded-xl hover:bg-orange-50 border border-transparent hover:border-orange-100 flex items-center gap-2"
                        >
                            Reset to defaults
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-10">
                {GROUPS.map((group) => {
                    const displayItemsInGroup = NOTI_DISPLAY_CONFIG.filter(item => item.group === group.id);
                    if (displayItemsInGroup.length === 0) return null;

                    return (
                        <section key={group.id}>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <FontAwesomeIcon icon={group.icon} className="text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{group.title}</h2>
                            </div>

                            <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden shadow-sm">
                                {displayItemsInGroup.map((displayItem) => {
                                    const actualData = displayItem.subTypes
                                        ? settings.find(s => s.notificationType === displayItem.subTypes[0])
                                        : settings.find(s => s.notificationType === displayItem.key);

                                    if (!actualData) return null;

                                    return (
                                        <div key={displayItem.key} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-gray-50/30 transition-colors">
                                            <div className="max-w-xl">
                                                <p className="font-bold text-gray-800 dark:text-gray-100 mb-1">{displayItem.title}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{displayItem.desc}</p>
                                            </div>

                                            <div className="flex gap-8 items-center">
                                                {['emailEnabled', 'inAppEnabled'].map(field => (
                                                    <div key={field} className="flex flex-col items-center gap-2 min-w-[60px]">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                            {field === 'emailEnabled' ? 'Email' : 'In-app'}
                                                        </span>
                                                        <button
                                                            disabled={isUpdating}
                                                            onClick={() => handleToggle(displayItem, field, !actualData[field])}
                                                            className={`w-11 h-6 rounded-full relative transition-all duration-300 ${actualData[field] ? 'bg-orange-500 shadow-md shadow-orange-200' : 'bg-gray-200 dark:bg-gray-700'}`}
                                                        >
                                                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${actualData[field] ? 'right-1' : 'left-1'}`}></span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>

            <div className="mt-12 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-100 dark:border-orange-900/30 flex items-center gap-3">
                <FontAwesomeIcon icon={faCertificate} className="text-orange-500 text-xl" />
                <p className="text-xs text-orange-700 dark:text-orange-400 font-medium italic">
                    Changes are synchronized instantly. You can always revert your choices at any time.
                </p>
            </div>
        </main>
    );
};

export default NotificationSettings;
