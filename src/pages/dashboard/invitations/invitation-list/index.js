import InvitationCard from '@/pages/dashboard/invitations/invitation-card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faEnvelope } from '../../../../utils/icons';

const EMPTY_STATE_BY_TAB = {
  new: {
    icon: faEnvelope,
    title: 'No new invitations',
    description: 'New invitations from recruiters will show up here.',
  },
  accepted: {
    icon: faCircleCheck,
    title: 'No accepted invitations',
    description: 'Invitations you accept will appear in this tab.',
  },
  declined: {
    icon: faCircleXmark,
    title: 'No declined invitations',
    description: 'Invitations you decline will appear in this tab.',
  },
};

const InvitationList = ({ items, activeTab, onViewDetails, onAccept, onDecline, isProcessing }) => {
  if (!items.length) {
    const emptyState = EMPTY_STATE_BY_TAB[activeTab] || EMPTY_STATE_BY_TAB.new;

    return (
      <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
        <FontAwesomeIcon icon={emptyState.icon} className="text-5xl text-gray-300 dark:text-gray-600" />
        <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">{emptyState.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{emptyState.description}</p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      {items.map((item) => (
        <InvitationCard
          key={item.id}
          item={item}
          activeTab={activeTab}
          onViewDetails={onViewDetails}
          onAccept={onAccept}
          onDecline={onDecline}
          isProcessing={isProcessing}
        />
      ))}
    </div>
  );
};

export default InvitationList;
