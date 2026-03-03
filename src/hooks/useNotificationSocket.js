import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { api } from '@/apis/baseApi';
import { setRealtimePreview } from '@/pages/dashboard/notification/components/notification-slice';

export const useNotificationSocket = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        console.log("Checking token in Socket Hook...");

        if (!token) {
            console.warn("No token found! Socket connection aborted. ❌");
            return;
        }

        console.log("Setting up WS with token:", token);

        // const socket = new SockJS("https://api.smartrecruit.tech/ws-smartrecruit");
        const socket = new SockJS("http://localhost:8080/ws-smartrecruit");

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
                    dispatch(setRealtimePreview(newNoti));
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