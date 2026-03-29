import React, { useMemo } from 'react';
import { Avatar, Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCandidateProfileQuery } from '@/apis/candidateApi';
import authService from '@/services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faChevronDown, faClipboardCheck, faClockRotateLeft, faCreditCard, faEnvelope, faFileLines, faGear, faRightFromBracket, faTableCells, faUser } from '../../../utils/icons';

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
      icon: <FontAwesomeIcon icon={faTableCells} className="text-lg" />,
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: <FontAwesomeIcon icon={faUser} className="text-lg" />,
      onClick: () => navigate('/dashboard/profile'),
    },
    {
      key: 'resumes',
      label: 'Resumes',
      icon: <FontAwesomeIcon icon={faFileLines} className="text-lg" />,
      onClick: () => navigate('/dashboard/resumes'),
    },
    {
      key: 'resume-checker',
      label: 'Resume Checker',
      icon: <FontAwesomeIcon icon={faClipboardCheck} className="text-lg" />,
      onClick: () => navigate('/dashboard/matching-history'),
    },
    {
      key: 'my-jobs',
      label: 'My Jobs',
      icon: <FontAwesomeIcon icon={faClockRotateLeft} className="text-lg" />,
      onClick: () => navigate('/dashboard/jobs'),
    },
    {
      key: 'invitations',
      label: 'Job Invitation',
      icon: <FontAwesomeIcon icon={faEnvelope} className="text-lg" />,
      onClick: () => navigate('/dashboard/invitations'),
    },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: <FontAwesomeIcon icon={faBell} className="text-lg" />,
      onClick: () => navigate('/dashboard/notifications'),
    },
    {
      key: 'billing',
      label: 'Billing & Plans',
      icon: <FontAwesomeIcon icon={faCreditCard} className="text-lg" />,
      onClick: () => navigate('/dashboard/billing-plans'),
    },
    {
      key: 'usage',
      label: 'Usage',
      icon: <FontAwesomeIcon icon={faClockRotateLeft} className="text-lg" />,
      onClick: () => navigate('/dashboard/usage'),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <FontAwesomeIcon icon={faGear} className="text-lg" />,
      onClick: () => navigate('/dashboard/setting'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Sign out',
      danger: true,
      icon: <FontAwesomeIcon icon={faRightFromBracket} className="text-lg" />,
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
          icon={!avatar ? <FontAwesomeIcon icon={faUser} className="text-lg text-gray-400" /> : undefined}
        />

        <FontAwesomeIcon icon={faChevronDown} className="text-gray-500 text-lg" />
      </button>
    </Dropdown>
  );
};

export default UserMenuDropdown;
