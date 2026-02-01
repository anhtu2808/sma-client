import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import SideDecorator from '@/pages/login/side-decorator';
import googleIcon from '@/assets/svg/google-icon.svg';

const Register = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle register logic here
    };

    const handleGoogleRegister = () => {
        // Handle Google register logic here
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <SideDecorator />
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative bg-white dark:bg-gray-900 z-10 overflow-y-auto">
                <div className="w-full max-w-md mx-auto py-12">
                    <h1 className="text-4xl font-extrabold mb-3 tracking-tight text-gray-900 dark:text-white">
                        Create Account
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
                        Join us to find your dream job!
                    </p>

                   
                    <Button
                        type="button"
                        mode="secondary"
                        size="md"
                        fullWidth
                        shape="pill"
                        className="mb-5"
                        iconLeft={<img src={googleIcon} alt="Google" className="w-5 h-5" />}
                        onClick={handleGoogleRegister}
                    >
                        Sign up with Google
                    </Button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                        <span className="text-sm text-gray-400 font-medium">or Sign up with Email</span>
                        <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                    </div>

                    {/* Register Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            placeholder="Enter your name"
                            required
                        />

                        <Input
                            type="email"
                            placeholder="Email"
                            required
                        />

                        <Input.Password
                            placeholder="Password"
                            required
                        />

                        <Input.Password
                            placeholder="Confirm Password"
                            required
                        />

                        <div className="pt-2">
                             <Button
                                type="submit"
                                mode="primary"
                                size="lg"
                                fullWidth
                            >
                                Create Account
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-bold text-gray-900 dark:text-white underline hover:text-primary transition-colors"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;