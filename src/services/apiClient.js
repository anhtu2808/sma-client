import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Handle errors globally
        if (error.response) {
            // Server responded with error
            const { status, data } = error.response;
            
            if (status === 401) {
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            
            return Promise.reject(data);
        } else if (error.request) {
            // Request made but no response
            return Promise.reject({ message: 'Network error. Please check your connection.' });
        } else {
            // Something else happened
            return Promise.reject({ message: error.message });
        }
    }
);

export default apiClient;
