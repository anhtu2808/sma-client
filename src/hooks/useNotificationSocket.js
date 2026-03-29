import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { api } from '@/apis/baseApi';
import { setRealtimePreview } from '@/pages/dashboard/notification/components/notification-slice';
import { toast } from "react-toastify";
import NotificationToast from '@/components/NotificationToast';
import { faBell, faBriefcase, faCircleCheck, faCircleExclamation, faCircleInfo, faCreditCard, faEnvelope } from '../utils/icons';

const ICON_MAP = {
    APPLICATION_STATUS: faBriefcase,
    PAYMENT_SUCCESS: faCircleCheck,
    PAYMENT_FAILURE: faCreditCard,
    INVITATION: faEnvelope,
    CV_PARSE_FAILED: faCircleExclamation,
    SYSTEM: faCircleInfo,
};
const DEFAULT_ICON = faBell;

export const useNotificationSocket = () => {
    const dispatch = useDispatch();
    const getIcon = (type) => ICON_MAP[type] || DEFAULT_ICON;

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        console.log("Checking token in Socket Hook...");

        if (!token) {
            console.warn("No token found! Socket connection aborted.");
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
                console.log('Connected');

                client.subscribe('/user/queue/notifications', (message) => {
                    console.log("WS RECEIVED:", message.body);
                    const newNoti = JSON.parse(message.body);
                    if (!newNoti?.title && !newNoti?.message) {
                        return;
                    }
                    const icon = getIcon(newNoti.notificationType);

                    toast(
                        <NotificationToast
                            icon={icon}
                            title={newNoti.title}
                            message={newNoti.message}
                        />,
                        { icon: false, autoClose: 5000, hideProgressBar: true }
                    );

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
