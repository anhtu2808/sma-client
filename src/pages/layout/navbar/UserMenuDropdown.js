import React, { useMemo } from 'react';
import { Avatar, Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCandidateProfileQuery } from '@/apis/candidateApi';
import authService from '@/services/authService';

const UserMenuDropdown = () => {
  const navigate = useNavigate();
  const { data: meResponse, isFetching } = useCandidateProfileQuery();

  const user = useMemo(() => meResponse?.data?.user ?? null, [meResponse]);
  const displayName = user?.fullName || user?.email || 'Candidate';
  const avatar = user?.avatar;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  const handleNavigateProfile = () => {
    navigate('/');
  };

  const avatarInitial = (displayName?.[0] || 'U').toUpperCase();

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Manage Profile',
      icon: <span className="material-icons-round text-lg">person_outline</span>,
      onClick: handleNavigateProfile,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Sign out',
      danger: true,
      icon: <span className="material-icons-round text-lg">logout</span>,
      onClick: handleLogout,
    },
  ];

  return (
    <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
      <button
        type="button"
        className="flex items-center gap-3 text-sm rounded-full transition-all px-2 py-1 cursor-pointer bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
      >
        <div className="hidden md:flex flex-col items-end">
          <span className="font-medium text-gray-900 dark:text-white">
            {isFetching ? 'Loading...' : displayName}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Candidate
          </span>
        </div>
        <Avatar
          size={36}
          src={avatar || undefined}
          className="bg-gray-800 text-white font-semibold"
        >
          {!avatar ? avatarInitial : null}
        </Avatar>
        <span className="material-icons-round text-gray-500 text-lg hidden md:block">expand_more</span>
      </button>
    </Dropdown>
  );
};

export default UserMenuDropdown;
