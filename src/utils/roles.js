export const ROLE_CONFIG = {
  student: {
    label: 'Học sinh',
    icon: '👨‍🎓',
    textColor: '#1c7ed6',
    background: '#d0ebff',
    border: '#74c0fc',
  },
  teacher: {
    label: 'Giáo viên',
    icon: '👩‍🏫',
    textColor: '#d9480f',
    background: '#ffe8cc',
    border: '#ffba80',
  },
  moderator: {
    label: 'Moderator',
    icon: '🛡️',
    textColor: '#2f9e44',
    background: '#d3f9d8',
    border: '#8ce99a',
  },
  maintainer: {
    label: 'Site Maintainer',
    icon: '🛠️',
    textColor: '#6741d9',
    background: '#e5dbff',
    border: '#b197fc',
  },
};

const DEFAULT_ROLE_CONFIG = {
  label: 'Thành viên',
  icon: '👤',
  textColor: '#495057',
  background: '#e9ecef',
  border: '#ced4da',
};

export const getRoleConfig = (role) => {
  if (!role) return DEFAULT_ROLE_CONFIG;
  return ROLE_CONFIG[role] || {
    ...DEFAULT_ROLE_CONFIG,
    label: role,
  };
};

