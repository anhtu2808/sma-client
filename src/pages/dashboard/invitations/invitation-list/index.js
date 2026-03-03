import InvitationCard from '@/pages/dashboard/invitations/invitation-card';

const EMPTY_STATE_BY_TAB = {
  new: {
    icon: 'mark_email_unread',
    title: 'No new invitations',
    description: 'New invitations from recruiters will show up here.',
  },
  accepted: {
    icon: 'check_circle',
    title: 'No accepted invitations',
    description: 'Invitations you accept will appear in this tab.',
  },
  declined: {
    icon: 'cancel',
    title: 'No declined invitations',
    description: 'Invitations you decline will appear in this tab.',
  },
};

const InvitationList = ({ items, activeTab, onAccept, onDecline, onViewDetails }) => {
  if (!items.length) {
    const emptyState = EMPTY_STATE_BY_TAB[activeTab] || EMPTY_STATE_BY_TAB.new;

    return (
      <section className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
        <span className="material-icons-round text-5xl text-gray-300 dark:text-gray-600">{emptyState.icon}</span>
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
          onAccept={onAccept}
          onDecline={onDecline}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default InvitationList;
