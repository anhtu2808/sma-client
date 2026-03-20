import axios from 'axios';
import { BASE_HOST } from './apiClient';

const AuthAPI = axios.create({
  baseURL: BASE_HOST + "/v1",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authService = {

    login: async (credentials) => {
        try {
            const response = await AuthAPI.post('/auth/login', credentials);
            
            if (response.data?.data?.accessToken) {
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
            }
            
            return response;
        } catch (error) {
            throw error;
        }
    },

    registerAsCandidate: async (userData) => {
        try {
            const response = await AuthAPI.post('/candidate/auth/register', userData);
            
            if (response.data?.data?.accessToken) {
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
            }
            
            return response;
        } catch (error) {
            throw error;
        }
    },

    loginWithGoogle: async (idToken) => {
        try {
            const response = await AuthAPI.post('/candidate/auth/google-login', { idToken });
            console.log(response);
            if (response.data?.data?.accessToken) {
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
            }
            
            return response;
        } catch (error) {
            throw error;
        }
    },

    verifyCandidateRole: async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await AuthAPI.get('/candidate/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data?.data?.user?.role !== 'CANDIDATE') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return false;
            }
            return true;
        } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return false;
        }
    },

    logout: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await AuthAPI.post('/auth/logout', refreshToken);
            if (response.data?.data === true && response.data.code === 200) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
            window.location.href = '/login';
        } catch (error) {
            throw error;
        }
    },

    refreshToken: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await AuthAPI.post('/auth/refresh-token', refreshToken);
            if (response.data?.data?.accessToken) {
                localStorage.setItem('accessToken', response.data.data.accessToken);
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    },

    getAccessToken: () => {
        return localStorage.getItem('accessToken');
    },

    getRefreshToken: () => {
        return localStorage.getItem('refreshToken');
    }
};

export default authService;
