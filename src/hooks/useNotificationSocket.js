import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { api } from '@/apis/baseApi';
import { setRealtimePreview } from '@/pages/dashboard/notification/components/notification-slice';
import toast from "react-hot-toast";

export const useNotificationSocket = () => {
    const dispatch = useDispatch();
    const getIcon = (type) => {
        switch (type) {
            case 'APPLICATION_STATUS':
                return 'work';

            case 'PAYMENT_SUCCESS':
                return 'check_circle';

            case 'PAYMENT_FAILURE':
                return 'payments';

            case 'INVITATION':
                return 'mail';

            case 'CV_PARSE_FAILED':
                return 'error';

            case 'SYSTEM':
                return 'error_outline';

            default:
                return 'notifications';
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        console.log("Checking token in Socket Hook...");

        if (!token) {
            console.warn("No token found! Socket connection aborted. ❌");
            return;
        }

        console.log("Setting up WS with token:", token);

        const socket = new SockJS("https://api.smartrecruit.tech/ws-smartrecruit");
        // const socket = new SockJS("http://localhost:8080/ws-smartrecruit");

        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            onConnect: () => {
                console.log('Connected ✅');
                console.log("Connected WS 🔥");

                client.subscribe('/user/queue/notifications', (message) => {
                    console.log("🔥 WS RECEIVED:", message.body);
                    const newNoti = JSON.parse(message.body);
                    if (!newNoti?.title && !newNoti?.message) {
                        return;
                    }
                    const icon = getIcon(newNoti.notificationType);

                    toast.custom(() => (
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 w-[360px]">
                            <div className="flex gap-3">

                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100">
                                    <span className="material-symbols-outlined text-orange-500">
                                        {icon}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <p className="font-bold text-gray-900">
                                        {newNoti.title}
                                    </p>

                                    <p className="text-sm text-gray-600 mt-1">
                                        {newNoti.message}
                                    </p>
                                </div>

                            </div>
                        </div>
                    ), { duration: 5000 });

                    dispatch(api.util.invalidateTags(['Notifications']));
                });
            },
            onStompError: (frame) => {
                console.error('Broker error:', frame);
            }
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [dispatch]);
};