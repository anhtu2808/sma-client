import { INVITATION_TABS } from '@/pages/dashboard/invitations/constants';

const Tabs = ({ activeTab, tabCounts, onTabChange }) => {
  return (
    <nav aria-label="Invitation tabs" className="-mb-px flex flex-wrap gap-6 md:gap-8">
      {INVITATION_TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            type="button"
            className={`py-4 border-b-2 text-sm font-medium inline-flex items-center gap-2 transition-colors ${
              isActive
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              {tabCounts[tab.key] || 0}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default Tabs;
