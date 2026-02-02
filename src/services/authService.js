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
            }
            
            return response;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await AuthAPI.post('/auth/candidate/register', userData);
            
            if (response.data?.data?.accessToken) {
                localStorage.setItem('accessToken', response.data.data.accessToken);
            }
            
            return response;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    },

    getToken: () => {
        return localStorage.getItem('accessToken');
    }
};

export default authService;
