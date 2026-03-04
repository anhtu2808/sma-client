import { useMemo, useState } from 'react';
import { Col, Row, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Header from '@/pages/dashboard/invitations/header';
import Toolbar from '@/pages/dashboard/invitations/toolbar';
import Tabs from '@/pages/dashboard/invitations/tabs';
import InvitationList from '@/pages/dashboard/invitations/invitation-list';
import {
  INVITATION_FILTER_OPTIONS,
  INVITATION_SORT_OPTIONS,
  MOCK_INVITATIONS,
} from '@/pages/dashboard/invitations/constants';

const Invitations = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('new');
  const [filterMode, setFilterMode] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [invitations, setInvitations] = useState(MOCK_INVITATIONS);

  const tabCounts = useMemo(() => {
    return invitations.reduce(
      (accumulator, invitation) => {
        if (accumulator[invitation.status] != null) {
          accumulator[invitation.status] += 1;
        }
        return accumulator;
      },
      {
        new: 0,
        accepted: 0,
        declined: 0,
      }
    );
  }, [invitations]);

  const filteredAndSortedInvitations = useMemo(() => {
    const filtered = invitations
      .filter((invitation) => invitation.status === activeTab)
      .filter((invitation) => (filterMode === 'all' ? true : invitation.workMode === filterMode));

    const sorted = [...filtered];

    sorted.sort((firstInvitation, secondInvitation) => {
      if (sortBy === 'match-desc') {
        return secondInvitation.aiMatch - firstInvitation.aiMatch;
      }

      const firstTime = new Date(firstInvitation.receivedAt).getTime();
      const secondTime = new Date(secondInvitation.receivedAt).getTime();

      if (sortBy === 'oldest') {
        return firstTime - secondTime;
      }

      return secondTime - firstTime;
    });

    return sorted;
  }, [activeTab, filterMode, invitations, sortBy]);

  const handleAccept = (invitationId) => {
    setInvitations((previousInvitations) =>
      previousInvitations.map((invitation) =>
        invitation.id === invitationId ? { ...invitation, status: 'accepted' } : invitation
      )
    );
    message.success('Invitation accepted.');
  };

  const handleDecline = (invitationId) => {
    setInvitations((previousInvitations) =>
      previousInvitations.map((invitation) =>
        invitation.id === invitationId ? { ...invitation, status: 'declined' } : invitation
      )
    );
    message.info('Invitation declined.');
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Header />
      </Col>

      <Col span={24}>
        <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-100 dark:border-gray-800">
            <Tabs activeTab={activeTab} tabCounts={tabCounts} onTabChange={setActiveTab} />
            <div className="flex items-center gap-2 h-full pb-2">
              <Toolbar
                filterMode={filterMode}
                sortBy={sortBy}
                filterOptions={INVITATION_FILTER_OPTIONS}
                sortOptions={INVITATION_SORT_OPTIONS}
                onFilterChange={setFilterMode}
                onSortChange={setSortBy}
              />
            </div>
          </div>
        </section>
      </Col>

      <Col span={24}>
        <InvitationList
          items={filteredAndSortedInvitations}
          activeTab={activeTab}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onViewDetails={handleViewDetails}
        />
      </Col>
    </Row>
  );
};

export default Invitations;
