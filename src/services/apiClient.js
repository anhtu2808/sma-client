import axios from 'axios';

const BASE_HOST = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
    baseURL: BASE_HOST,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            
            if (status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
            
            return Promise.reject(data);
        } else if (error.request) {
            return Promise.reject({ message: 'Network error. Please check your connection.' });
        } else {
            return Promise.reject({ message: error.message });
        }
    }
);

export default apiClient;

export { BASE_HOST };
