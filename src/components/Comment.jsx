import React, { useEffect, useState } from 'react';
import RoleBadge from './RoleBadge';

const Comment = ({ comment, canEdit, canDelete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(comment.text);
  const [isHoveringDelete, setIsHoveringDelete] = useState(false);

  useEffect(() => {
    setDraftText(comment.text);
  }, [comment.text]);

  const handleSave = () => {
    const trimmed = draftText.trim();
    if (!trimmed || !onEdit) return;
    onEdit(trimmed);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftText(comment.text);
    setIsEditing(false);
  };

  const showControls = (canEdit || canDelete) && (onEdit || onDelete);

  return (
    <div className="comment" style={{ position: 'relative' }}>
      <div className="comment-avatar">{comment.author.initials}</div>
      <div className="comment-content" style={{ flex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.25rem',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div className="comment-author" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span>{comment.author.name}</span>
            <RoleBadge role={comment.author?.role} size="sm" />
            {comment.editedAt && !isEditing && (
              <span style={{ fontSize: '0.75rem', color: '#7f8c8d', marginLeft: '0.35rem' }}>(đã chỉnh sửa)</span>
            )}
          </div>
          {showControls && (
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {canEdit && onEdit && (
                <button
                  onClick={() => setIsEditing((prev) => !prev)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#2980b9',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.background = '#eef6ff')}
                  onMouseLeave={(e) => (e.target.style.background = 'transparent')}
                  title="Chỉnh sửa bình luận"
                >
                  ✏️
                </button>
              )}
              {canDelete && onDelete && (
                <button
                  onClick={onDelete}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#e74c3c',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={() => setIsHoveringDelete(true)}
                  onMouseLeave={() => setIsHoveringDelete(false)}
                  title="Xóa bình luận"
                >
                  {isHoveringDelete ? '❗' : '🗑️'}
                </button>
              )}
            </div>
          )}
        </div>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              style={{
                width: '100%',
                minHeight: '60px',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #dfe4ea',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                resize: 'vertical',
              }}
              maxLength={1000}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  background: '#ecf0f1',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.35rem 0.85rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.35rem 0.85rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
                disabled={!draftText.trim()}
              >
                Lưu
              </button>
            </div>
          </div>
        ) : (
          <div className="comment-text">{comment.text}</div>
        )}
      </div>
    </div>
  );
};

export default Comment;

