import { useMemo, useState, useCallback } from 'react';
import { Alert, Col, Row } from 'antd';
import toastMessage from "@/utils/toastMessage";
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';
import { formatSalary } from '@/utils/salaryUtils';
import { 
  useGetMyInvitationsQuery, 
  useTakeActionOnInvitationMutation,
  useGetInvitationStatusCountQuery 
} from '@/apis/invitationApi';
import Header from '@/pages/dashboard/invitations/header';
import Toolbar from '@/pages/dashboard/invitations/toolbar';
import Tabs from '@/pages/dashboard/invitations/tabs';
import InvitationList from '@/pages/dashboard/invitations/invitation-list';
import {
  INVITATION_FILTER_OPTIONS,
  INVITATION_SORT_OPTIONS,
  getInvitationAvatar,
} from '@/pages/dashboard/invitations/constants';

const PAGE_SIZE = 10;

const WORK_MODE_LABELS = {
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ONSITE: 'On-site',
};

const TAB_TO_STATUS = {
  new: 'INVITED',
  accepted: 'ACCEPTED',
  declined: 'DECLINED',
};

const STATUS_TO_TAB = {
  INVITED: 'new',
  RECEIVED: 'new',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
};


const formatLocation = (locations, workModeLabel) => {
  const primaryLocation = Array.isArray(locations) ? locations[0] : null;
  if (!primaryLocation) return workModeLabel || 'Location unavailable';

  if (primaryLocation.address) return primaryLocation.address;

  const parts = [
    primaryLocation.district,
    primaryLocation.city,
    primaryLocation.country,
  ].filter(Boolean);

  if (parts.length) return parts.join(', ');

  return primaryLocation.name || workModeLabel || 'Location unavailable';
};

const mapInvitationFromApi = (invitation) => {
  const company = invitation?.company || {};
  const job = invitation?.job || {};
  const companyName = company?.name || 'Company';
  const workMode = job?.workingModel || null;
  const workModeLabel = workMode ? WORK_MODE_LABELS[workMode] || workMode : null;

  return {
    id: Number(invitation?.id),
    jobId: job?.id ? Number(job.id) : null,
    title: job?.name || 'Job opportunity',
    company: companyName,
    companyLogo:
      company?.logo ||
      getInvitationAvatar(companyName, 'DBEAFE', '1D4ED8'),
    message: invitation?.content || '',
    salaryText: formatSalary(job?.salaryStart, job?.salaryEnd),
    locationText: formatLocation(company?.locations, workModeLabel),
    workMode,
    workModeLabel,
    status: STATUS_TO_TAB[invitation?.status] || 'new',
    rawStatus: invitation?.status,
  };
};

const Invitations = () => {
  const navigate = useNavigate();
  const hasAccessToken = Boolean(localStorage.getItem('accessToken'));
  const [activeTab, setActiveTab] = useState('new');
  const [filterMode, setFilterMode] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(0);
  const [processingIds, setProcessingIds] = useState({});

  const statusFilter = TAB_TO_STATUS[activeTab];

  const {
    data: invitationData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetMyInvitationsQuery(
    { page: currentPage, size: PAGE_SIZE, status: statusFilter },
    { skip: !hasAccessToken }
  );

  const { data: statusCountData } = useGetInvitationStatusCountQuery(
    undefined,
    { skip: !hasAccessToken }
  );

  const [takeAction] = useTakeActionOnInvitationMutation();

  const invitations = useMemo(() => {
    const content = invitationData?.content || [];
    return content.map(mapInvitationFromApi);
  }, [invitationData]);

  // Tab counts from API status-count endpoint
  const tabCounts = useMemo(() => {
    const statuses = statusCountData?.statuses || [];
    const counts = { new: 0, accepted: 0, declined: 0 };
    
    statuses.forEach((item) => {
      if (item.status === 'INVITED' || item.status === 'RECEIVED') {
        counts.new += item.count || 0;
      } else if (item.status === 'ACCEPTED') {
        counts.accepted = item.count || 0;
      } else if (item.status === 'DECLINED') {
        counts.declined = item.count || 0;
      }
    });
    
    return counts;
  }, [statusCountData]);

  const filteredAndSortedInvitations = useMemo(() => {
    let filtered = invitations;
    
    // Filter by work mode
    if (filterMode !== 'all') {
      filtered = filtered.filter((invitation) => invitation.workMode === filterMode);
    }

    // Sort
    if (sortBy === 'oldest') {
      return [...filtered].reverse();
    }

    return filtered;
  }, [filterMode, invitations, sortBy]);

  const handleTabChange = useCallback((newTab) => {
    setActiveTab(newTab);
    setCurrentPage(0);  // Reset to first page when changing tabs
  }, []);

  const errorMessage =
    error?.data?.message ||
    error?.message ||
    'Please try again later.';

  const handleViewDetails = (jobId) => {
    if (!jobId) return;
    navigate(`/jobs/${jobId}`);
  };

  const handleAccept = useCallback((invitationId) => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (!invitation || !invitation.jobId) {
      toastMessage.error("Cannot find the job details for this invitation.");
      return;
    }
    navigate(`/jobs/${invitation.jobId}/application`, { state: { invitationId } });
  }, [invitations, navigate]);

  const handleDecline = useCallback(async (invitationId) => {
    setProcessingIds((prev) => ({ ...prev, [invitationId]: true }));
    try {
      const response = await takeAction({ id: invitationId, action: 'DECLINED' }).unwrap();
      if (response?.data) {
        toastMessage.success('Invitation declined');
      } else {
        toastMessage.error(response?.message || 'Failed to decline invitation');
      }
    } catch (err) {
      toastMessage.error(err?.data?.message || 'Failed to decline invitation. Please try again.');
    } finally {
      setProcessingIds((prev) => ({ ...prev, [invitationId]: false }));
    }
  }, [takeAction]);

  if (!hasAccessToken) {
    return (
      <Alert
        type="warning"
        showIcon
        message="Please sign in to view your invitations."
      />
    );
  }

  if (isLoading || (!invitationData && isFetching)) {
    return <Loading className="h-[50vh]" />;
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Header />
      </Col>

      {isError ? (
        <Col span={24}>
          <Alert
            type="error"
            showIcon
            message="Cannot load invitations"
            description={errorMessage}
          />
        </Col>
      ) : (
        <>
          <Col span={24}>
            <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 px-6">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-100 dark:border-gray-800">
                <Tabs activeTab={activeTab} tabCounts={tabCounts} onTabChange={handleTabChange} />
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
              onViewDetails={handleViewDetails}
              onAccept={handleAccept}
              onDecline={handleDecline}
              isProcessing={processingIds}
            />
          </Col>
        </>
      )}
    </Row>
  );
};

export default Invitations;
