import React from 'react';
import RoleBadge from './RoleBadge';
import { categoryLabels } from '../data/threads';

const formatDateTime = (isoString) => {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
};

const ThreadSummaryCard = ({
  thread,
  onOpen,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}) => {
  const replyCount = thread.replies?.length || 0;
  const lastActivity = thread.updatedAt || thread.createdAt;

  return (
    <div className="post" style={{ cursor: 'pointer' }} onClick={() => onOpen(thread.id)}>
      <div className="post-header">
        <div className="post-author">
          <div className="avatar">{thread.author.initials}</div>
          <div className="author-info">
            <div className="author-name" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span>{thread.author.name}</span>
              <RoleBadge role={thread.author.role} size="sm" />
            </div>
            <div className="post-time">
              Cập nhật: {formatDateTime(lastActivity)}
            </div>
          </div>
        </div>
        <span className="post-category">{categoryLabels[thread.category] || thread.category}</span>
      </div>
      <div className="post-content">
        <div className="post-title">{thread.title}</div>
        <p style={{ color: '#57606f', marginTop: '0.25rem', maxHeight: '3.5rem', overflow: 'hidden' }}>
          {thread.content}
        </p>
        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#7f8c8d' }}>
          <span>{replyCount} phản hồi</span>
          {(canEdit || canDelete) && (
            <div style={{ display: 'flex', gap: '0.35rem' }} onClick={(e) => e.stopPropagation()}>
              {canEdit && (
                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={() => onEdit(thread)}>
                  ✏️ Sửa
                </button>
              )}
              {canDelete && (
                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', background: '#e74c3c', color: '#fff' }}
                  onClick={() => onDelete(thread)}
                >
                  🗑️ Xóa
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreadSummaryCard;

