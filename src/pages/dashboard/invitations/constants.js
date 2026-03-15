const getAvatarUrl = (name, bg = 'EEF2FF', color = '1D4ED8') =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=${color}`;

export const INVITATION_TABS = [
  { key: 'new', label: 'New Invitations' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'declined', label: 'Declined' },
];

export const INVITATION_FILTER_OPTIONS = [
  { key: 'all', label: 'All work modes' },
  { key: 'REMOTE', label: 'Remote' },
  { key: 'HYBRID', label: 'Hybrid' },
  { key: 'ONSITE', label: 'On-site' },
];

export const INVITATION_SORT_OPTIONS = [
  { key: 'newest', label: 'Newest first' },
  { key: 'oldest', label: 'Oldest first' },
];

export const getInvitationAvatar = (name, bg, color) => getAvatarUrl(name, bg, color);
