import React from 'react';
import { getRoleConfig } from '../utils/roles';

const RoleBadge = ({ role, size = 'sm', showLabel = true }) => {
  const { label, icon, background, textColor, border } = getRoleConfig(role);
  const padding = size === 'sm' ? '0.1rem 0.45rem' : '0.2rem 0.6rem';
  const fontSize = size === 'sm' ? '0.7rem' : '0.8rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: showLabel ? '0.25rem' : 0,
        padding,
        borderRadius: '999px',
        fontWeight: 600,
        fontSize,
        background,
        color: textColor,
        border: `1px solid ${border}`,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden="true">{icon}</span>
      {showLabel && <span>{label}</span>}
    </span>
  );
};

export default RoleBadge;

