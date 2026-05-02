import axios from 'axios';
import { BASE_HOST } from './apiClient';

const AuthAPI = axios.create({
  baseURL: BASE_HOST + "/v1",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const storeAuthTokens = (response) => {
    if (response.data?.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
};

const clearAuthTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

const authService = {

    login: async (credentials) => {
        try {
            const response = await AuthAPI.post('/auth/login', credentials);
            storeAuthTokens(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    registerAsCandidate: async (userData) => {
        try {
            const response = await AuthAPI.post('/candidate/auth/register', userData);
            storeAuthTokens(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    loginWithGoogle: async (idToken) => {
        try {
            const response = await AuthAPI.post('/candidate/auth/google-login', { idToken });
            storeAuthTokens(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    getCandidateMyInfo: async () => {
        const token = localStorage.getItem('accessToken');
        return AuthAPI.get('/candidate/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    getCandidateAccess: async () => {
        try {
            const response = await authService.getCandidateMyInfo();
            const user = response.data?.data?.user ?? null;
            const isCandidate = user?.role === 'CANDIDATE';

            if (!isCandidate) {
                clearAuthTokens();
            }

            return {
                response,
                candidate: response.data?.data ?? null,
                user,
                isCandidate,
            };
        } catch (error) {
            clearAuthTokens();
            return {
                response: null,
                candidate: null,
                user: null,
                isCandidate: false,
                error,
            };
        }
    },

    verifyCandidateRole: async () => {
        const { isCandidate } = await authService.getCandidateAccess();
        return isCandidate;
    },

    logout: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await AuthAPI.post('/auth/logout', refreshToken);
            if (response.data?.data === true && response.data.code === 200) {
                clearAuthTokens();
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

    forgotPassword: async (data) => {
        try {
            const response = await AuthAPI.post('/auth/forgot-password', data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    resetPassword: async (data) => {
        try {
            const response = await AuthAPI.post('/auth/reset-password', data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    verifyEmail: async ({ email, otp }) => {
        try {
            const response = await AuthAPI.post('/candidate/auth/verify-email', { email, otp });
            storeAuthTokens(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    resendVerificationEmail: async (email) => {
        try {
            const response = await AuthAPI.post(`/candidate/auth/resend-verification?email=${encodeURIComponent(email)}`);
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
    },

    clearTokens: clearAuthTokens,
};

export default authService;
