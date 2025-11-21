import React, { useState, useEffect } from 'react';
import RoleBadge from './RoleBadge';

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

const ReplyItem = ({
  reply,
  depth = 0,
  onReply,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(reply.text);
  const [hoverDelete, setHoverDelete] = useState(false);

  useEffect(() => {
    setDraft(reply.text);
  }, [reply.text]);

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    await onEdit(reply, trimmed);
    setIsEditing(false);
  };

  const avatarBg = depth % 2 === 0 ? '#dfe6e9' : '#ffeaa7';

  return (
    <div
      style={{
        marginTop: depth === 0 ? '0.75rem' : '0.5rem',
        marginLeft: depth === 0 ? 0 : `${depth * 1.5}rem`,
        borderLeft: depth === 0 ? 'none' : '2px solid #e1e8ed',
        paddingLeft: depth === 0 ? 0 : '1rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
        }}
      >
        <div
          className="comment-avatar"
          style={{
            background: avatarBg,
            color: '#2d3436',
          }}
        >
          {reply.author.initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600 }}>{reply.author.name}</span>
            <RoleBadge role={reply.author.role} size="sm" />
            <span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>{formatDateTime(reply.createdAt)}</span>
            {reply.editedAt && (
              <span style={{ fontSize: '0.75rem', color: '#95a5a6' }}>(đã chỉnh sửa)</span>
            )}
          </div>
          {isEditing ? (
            <div style={{ marginTop: '0.4rem' }}>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #dfe4ea',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                }}
              />
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
                <button className="btn btn-secondary" type="button" onClick={() => { setIsEditing(false); setDraft(reply.text); }} style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}>
                  Hủy
                </button>
                <button className="btn btn-primary" type="button" disabled={!draft.trim()} onClick={handleSave} style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}>
                  Lưu
                </button>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '0.4rem', color: '#2d3436', lineHeight: 1.5 }}>{reply.text}</div>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', marginTop: '0.35rem' }}>
            <button
              type="button"
              onClick={() => onReply(reply)}
              style={{
                background: 'none',
                border: 'none',
                color: '#0984e3',
                cursor: 'pointer',
              }}
            >
              ↩️ Trả lời
            </button>
            {reply.canEdit && (
              <button
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2980b9',
                  cursor: 'pointer',
                }}
              >
                ✏️ Sửa
              </button>
            )}
            {reply.canDelete && (
              <button
                type="button"
                onMouseEnter={() => setHoverDelete(true)}
                onMouseLeave={() => setHoverDelete(false)}
                onClick={() => onDelete(reply)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: hoverDelete ? '#c0392b' : '#e74c3c',
                  cursor: 'pointer',
                }}
              >
                🗑️ Xóa
              </button>
            )}
          </div>
        </div>
      </div>
      {reply.children && reply.children.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          {reply.children.map((child) => (
            <ReplyItem
              key={child.id}
              reply={child}
              depth={depth + 1}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReplyItem;

