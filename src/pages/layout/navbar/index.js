import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import UserMenuDropdown from './UserMenuDropdown';

import Logo from "@/components/Logo";

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/jobs', label: 'Jobs' },
  { to: '/companies', label: 'Top Companies' },
  { to: '/pricing', label: 'Pricing' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const isLoggedIn = Boolean(token);

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-lg">
      <div className="w-full px-6 lg:px-8 h-16 flex items-center">
        <div className="flex items-center gap-10 min-w-0">
          <Logo />
          <ul className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-primary'
                        : 'text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="ml-auto flex items-center">
          {!isLoggedIn && <Button
            mode="ghost"
            size="md"
            className="hidden sm:inline-flex mr-2 md:mr-4"
            onClick={() => {
              window.location.href = 'https://employer.smartrecruit.tech';
            }}
          >
            For Employers
          </Button>}

          {!isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Button
                mode="secondary"
                size="md"
                className="hidden sm:inline-flex"
                onClick={() => navigate('/register')}
              >
                Sign up
              </Button>
              <Button
                mode="primary"
                size="md"
                glow
                onClick={() => navigate('/login')}
              >
                Sign in
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => navigate('/dashboard/invitations')}
              >
                <span className="material-icons-round text-gray-600 dark:text-gray-300 text-2xl">notifications</span>
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-gray-900"></span>
              </button>
              <UserMenuDropdown />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
