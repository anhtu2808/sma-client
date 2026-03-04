import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import UserMenuDropdown from './UserMenuDropdown';
import { useGetNotificationsQuery } from '@/apis/notificationApi';
import { useSelector, useDispatch } from 'react-redux';
import { hidePreview } from '@/pages/dashboard/notification/components/notification-slice';
import { setRealtimePreview } from '@/pages/dashboard/notification/components/notification-slice';
import dayjs from 'dayjs';
import Logo from "@/components/Logo";
import { createPortal } from 'react-dom';

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
  const { data } = useGetNotificationsQuery({
    page: 0,
    size: 1,
    isRead: false,
    type: null,
    keyword: ''
  });
  const unreadCount = data?.data?.unreadCount || 0;
  const dispatch = useDispatch();
  const { preview, showPreview } = useSelector(state => state.notification);
  useEffect(() => {
    if (!showPreview || !preview) return;

    const timer = setTimeout(() => {
      dispatch(hidePreview());
    }, 5000);

    return () => clearTimeout(timer);
  }, [showPreview]);


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
                    `text-sm font-semibold transition-colors ${isActive
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
                onClick={() => navigate('/dashboard/notifications')}
              >
                <span className="material-icons-round text-gray-600 dark:text-gray-300 text-2xl">notifications</span>
                {/* <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-gray-900"></span> */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              <UserMenuDropdown />
            </div>
          )}
        </div>
      </div>
      {showPreview && preview && preview.id && createPortal(
        <div className="fixed bottom-6 right-6 w-96 
              bg-white dark:bg-gray-900 
              shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-2xl p-5 
              border border-gray-200 dark:border-gray-700 
              z-[9999] animate-slide-in-right text-left">

          <div className="flex gap-4 items-start text-left">

            <div className="flex-shrink-0 w-10 h-10 rounded-xl 
                  bg-orange-100 dark:bg-orange-900/30
                  text-orange-500 
                  flex items-center justify-center">
              <span className="material-symbols-outlined text-red-500">error</span>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col items-start"> {/* Thêm flex-col và items-start */}

              {/* Title + Time */}
              <div className="flex justify-between items-start gap-3 w-full"> {/* Thêm w-full */}
                <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug text-left">
                  {preview.title}
                </h4>

                <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">
                  {dayjs(preview.createdAt).fromNow()}
                </span>
              </div>

              {/* Message */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed text-left">
                {preview.message}
              </p>

            </div>
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
};

export default Navbar;
