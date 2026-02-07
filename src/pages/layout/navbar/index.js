import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import UserMenuDropdown from './UserMenuDropdown';

import Logo from "@/components/Logo";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const isLoggedIn = Boolean(token);

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-6 py-4">
        <Logo />

        <div className="flex md:order-2 space-x-3 md:space-x-4 items-center">
          {!isLoggedIn ? (
            <>
              <Button
                mode="secondary"
                size="md"
                className=" md:inline-flex"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                mode="primary"
                size="md"
                glow
                onClick={() => navigate("/register")}
              >
                Sign up
              </Button>
            </>
          ) : (
            <UserMenuDropdown />
          )}
        </div>

                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `block py-2 px-3 rounded md:p-0 transition-colors ${isActive
                                        ? 'text-white bg-primary md:bg-transparent md:text-primary'
                                        : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary dark:text-white dark:hover:text-primary dark:hover:bg-gray-700 md:dark:hover:bg-transparent'
                                    }`
                                }
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/jobs"
                                className={({ isActive }) =>
                                    `block py-2 px-3 rounded md:p-0 transition-colors ${isActive
                                        ? 'text-white bg-primary md:bg-transparent md:text-primary'
                                        : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary dark:text-white dark:hover:text-primary dark:hover:bg-gray-700 md:dark:hover:bg-transparent'
                                    }`
                                }
                            >
                                For Jobs
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/companies"
                                className={({ isActive }) =>
                                    `block py-2 px-3 rounded md:p-0 transition-colors ${isActive
                                        ? 'text-white bg-primary md:bg-transparent md:text-primary'
                                        : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary dark:text-white dark:hover:text-primary dark:hover:bg-gray-700 md:dark:hover:bg-transparent'
                                    }`
                                }
                            >
                                For Companies
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/pricing"
                                className={({ isActive }) =>
                                    `block py-2 px-3 rounded md:p-0 transition-colors ${isActive
                                        ? 'text-white bg-primary md:bg-transparent md:text-primary'
                                        : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary dark:text-white dark:hover:text-primary dark:hover:bg-gray-700 md:dark:hover:bg-transparent'
                                    }`
                                }
                            >
                                Pricing
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
