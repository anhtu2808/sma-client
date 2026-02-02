import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import SideDecorator from '@/pages/login/side-decorator';
import googleIcon from '@/assets/svg/google-icon.svg';
import authService from '@/services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const response = await authService.login({ email, password });
            
            if (response.data.code === 200) {
                message.success(response.data.message || 'Login successfully');
                navigate('/');
            } else {
                message.error(response.data.message || 'Login failed');
            }
        } catch (error) {
            message.error(error.response.data.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Handle Google login logic here
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <SideDecorator />
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative bg-white dark:bg-gray-900 z-10 overflow-y-auto">
                

                <div className="w-full max-w-md mx-auto py-12">
                    <h1 className="text-4xl font-extrabold mb-3 tracking-tight text-gray-900 dark:text-white">
                        Login
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
                        Find the job made for you!
                    </p>

                    <Button
                        type="button"
                        mode="secondary"
                        size="md"
                        fullWidth
                        shape="pill"
                        className="mb-5"
                        iconLeft={<img src={googleIcon} alt="Google" className="w-5 h-5" />}
                        onClick={handleGoogleLogin}
                    >
                        Log in with Google
                    </Button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                        <span className="text-sm text-gray-400 font-medium">or Login with Email</span>
                        <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                    </div>

                    {/* Login Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input.Password
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="flex items-center justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary transition-colors hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            mode="primary"
                            size="lg"
                            fullWidth
                            disabled={loading}
                            loading={loading}
                        >
                            {loading ? 'Logging in...' : 'Log in'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Login;