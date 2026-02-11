import React, { useMemo } from 'react';
import { Avatar, Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCandidateProfileQuery } from '@/apis/candidateApi';
import authService from '@/services/authService';

const UserMenuDropdown = () => {
  const navigate = useNavigate();
  const { data: meResponse } = useCandidateProfileQuery();

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

  const avatarInitial = (displayName?.[0] || 'U').toUpperCase();

  const userMenuItems = [
    {
      key: 'overview',
      label: 'Overview',
      icon: <span className="material-icons-round text-lg">grid_view</span>,
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: <span className="material-icons-round text-lg">person</span>,
      onClick: () => navigate('/dashboard/profile'),
    },
    {
      key: 'resumes',
      label: 'Resumes',
      icon: <span className="material-icons-round text-lg">description</span>,
      onClick: () => navigate('/dashboard/resumes'),
    },
    {
      key: 'my-jobs',
      label: 'My Jobs',
      icon: <span className="material-icons-round text-lg">work_history</span>,
      onClick: () => navigate('/dashboard/jobs'),
    },
    {
      key: 'invitations',
      label: 'Job Invitation',
      icon: <span className="material-icons-round text-lg">mail</span>,
      onClick: () => navigate('/dashboard/invitations'),
    },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: <span className="material-icons-round text-lg">notifications</span>,
      onClick: () => navigate('/dashboard/notifications'),
    },
    {
      key: 'billing',
      label: 'Billing & Plans',
      icon: <span className="material-icons-round text-lg">credit_card</span>,
      onClick: () => navigate('/dashboard/billing-plans'),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <span className="material-icons-round text-lg">settings</span>,
      onClick: () => navigate('/dashboard/setting'),
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
    <Dropdown menu={{ items: userMenuItems }} trigger={['hover']} placement="bottomRight">
      <button
        type="button"
        className="flex items-center gap-2 text-sm rounded-full transition-all px-1 py-1 cursor-pointer bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
      >
        <Avatar
          size={36}
          src={avatar || undefined}
          className="bg-gray-800 text-white font-semibold"
        >
          {!avatar ? avatarInitial : null}
        </Avatar>
        <span className="material-icons-round text-gray-500 text-lg">expand_more</span>
      </button>
    </Dropdown>
  );
};

export default UserMenuDropdown;
