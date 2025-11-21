import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import RoleBadge from './RoleBadge';
import EditThreadModal from './EditThreadModal';
import ReplyItem from './ReplyItem';
import { categoryLabels } from '../data/threads';

const formatDateTime = (isoString) => {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
};

const buildReplyTree = (replies, canEditComment, canDeleteComment) => {
  const map = {};
  replies.forEach((reply) => {
    map[reply.id] = {
      ...reply,
      children: [],
      canEdit: canEditComment(reply.authorId),
      canDelete: canDeleteComment(reply.authorId),
    };
  });

  const roots = [];
  replies.forEach((reply) => {
    if (reply.parentId && map[reply.parentId]) {
      map[reply.parentId].children.push(map[reply.id]);
    } else {
      roots.push(map[reply.id]);
    }
  });
  const sortFn = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
  Object.values(map).forEach((node) => node.children.sort(sortFn));
  return roots.sort(sortFn);
};

const ThreadPage = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const {
    token,
    currentUser,
    canEditPost,
    canDeletePost,
    canEditComment,
    canDeleteComment,
  } = useAuth();

  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [replyParent, setReplyParent] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchThread = useCallback(async () => {
    if (!token || !threadId) return;
    setLoading(true);
    try {
      const data = await api.fetchThreadById(token, threadId);
      setThread(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch thread', err);
      setError(err.message || 'Không thể tải thread');
    } finally {
      setLoading(false);
    }
  }, [token, threadId]);

  useEffect(() => {
    fetchThread();
  }, [fetchThread]);

  useEffect(() => {
    setReplyParent(null);
    setReplyText('');
    setIsEditOpen(false);
  }, [threadId]);

  const replyTree = useMemo(() => {
    if (!thread) return [];
    return buildReplyTree(thread.replies || [], canEditComment, canDeleteComment);
  }, [thread, canEditComment, canDeleteComment]);

  const openEditModal = () => {
    if (!thread) return;
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  const handleUpdateThread = async (threadIdToUpdate, formData) => {
    if (!token) return;
    const payload = {
      category: formData.category,
      title: formData.title.trim(),
      content: formData.content.trim(),
    };
    if (formData.removeAttachment) {
      payload.attachment = null;
    } else if (formData.file) {
      payload.attachment = {
        name: formData.file.name,
        size: `${(formData.file.size / 1024 / 1024).toFixed(2)} MB`,
      };
    }

    try {
      const updated = await api.updateThread(token, threadIdToUpdate, payload);
      setThread(updated);
    } catch (err) {
      console.error('Failed to update thread', err);
      alert(err.message || 'Không thể cập nhật thread');
    }
  };

  const handleDeleteThread = async () => {
    if (!token || !thread) return;
    if (!window.confirm('Bạn có chắc muốn xóa thread này?')) return;
    try {
      await api.deleteThread(token, thread.id);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete thread', err);
      alert(err.message || 'Không thể xóa thread');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!token || !replyText.trim()) return;
    try {
      if (replyParent) {
        await api.replyToComment(token, thread.id, replyParent.id, { text: replyText.trim() });
      } else {
        await api.replyToThread(token, thread.id, { text: replyText.trim() });
      }
      setReplyText('');
      setReplyParent(null);
      await fetchThread();
    } catch (err) {
      console.error('Failed to reply', err);
      alert(err.message || 'Không thể gửi phản hồi');
    }
  };

  const handleEditReply = async (reply, newText) => {
    if (!token) return;
    try {
      await api.editReply(token, thread.id, reply.id, { text: newText });
      await fetchThread();
    } catch (err) {
      console.error('Failed to edit reply', err);
      alert(err.message || 'Không thể chỉnh sửa phản hồi');
    }
  };

  const handleDeleteReply = async (reply) => {
    if (!token) return;
    if (!window.confirm('Bạn có chắc muốn xóa phản hồi này (cùng các phản hồi con)?')) return;
    try {
      await api.deleteReply(token, thread.id, reply.id);
      await fetchThread();
    } catch (err) {
      console.error('Failed to delete reply', err);
      alert(err.message || 'Không thể xóa phản hồi');
    }
  };

  const renderReplies = () => {
    if (replyTree.length === 0) {
      return (
        <div style={{ padding: '1rem', textAlign: 'center', color: '#7f8c8d' }}>
          Chưa có phản hồi nào. Hãy là người đầu tiên!
        </div>
      );
    }
    return replyTree.map((reply) => (
      <ReplyItem
        key={reply.id}
        reply={reply}
        onReply={(target) => {
          setReplyParent(target);
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }}
        onEdit={handleEditReply}
        onDelete={handleDeleteReply}
      />
    ));
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải thread...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#e74c3c' }}>
        {error}
        <div style={{ marginTop: '1rem' }}>
          <button className="btn btn-primary" onClick={fetchThread}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!thread) {
    return null;
  }

  const canEditThread = canEditPost(thread.authorId);
  const canDeleteThread = canDeletePost(thread.authorId);

  return (
    <>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <Link to="/" style={{ color: '#0984e3', textDecoration: 'none' }}>
          ← Quay lại bảng thread
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEditThread && (
            <button className="btn btn-secondary" onClick={openEditModal}>
              ✏️ Sửa thread
            </button>
          )}
          {canDeleteThread && (
            <button className="btn btn-secondary" style={{ background: '#e74c3c', color: '#fff' }} onClick={handleDeleteThread}>
              🗑️ Xóa thread
            </button>
          )}
        </div>
      </div>
      <div className="post" style={{ border: '2px solid #cfd8dc' }}>
        <div className="post-header">
          <div className="post-author">
            <div className="avatar">{thread.author.initials}</div>
            <div className="author-info">
              <div className="author-name" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span>{thread.author.name}</span>
                <RoleBadge role={thread.author.role} size="sm" />
              </div>
              <div className="post-time">
                Đăng lúc: {formatDateTime(thread.createdAt)}
              </div>
            </div>
          </div>
          <span className="post-category">{categoryLabels[thread.category] || thread.category}</span>
        </div>
        <div className="post-content">
          <div className="post-title">{thread.title}</div>
          <p>{thread.content}</p>
          {thread.attachment && (
            <div className="post-attachment">
              📄 {thread.attachment.name} ({thread.attachment.size})
            </div>
          )}
        </div>
      </div>

      <section style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Phản hồi</h3>
        {renderReplies()}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Trả lời thread</h3>
        {replyParent && (
          <div style={{ marginBottom: '0.75rem', fontSize: '0.85rem', color: '#636e72' }}>
            Đang trả lời <strong>{replyParent.author.name}</strong>{' '}
            <button
              type="button"
              onClick={() => setReplyParent(null)}
              style={{
                marginLeft: '0.5rem',
                background: 'none',
                border: 'none',
                color: '#d63031',
                cursor: 'pointer',
              }}
            >
              Hủy
            </button>
          </div>
        )}
        <form onSubmit={handleReplySubmit}>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Viết phản hồi..."
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #dfe6e9',
              fontFamily: 'inherit',
              fontSize: '0.95rem',
            }}
            disabled={!currentUser}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: '0.75rem' }}
            disabled={!currentUser || !replyText.trim()}
          >
            Gửi phản hồi
          </button>
        </form>
        {!currentUser && (
          <div style={{ marginTop: '0.5rem', color: '#e74c3c' }}>
            Bạn cần đăng nhập để phản hồi.
          </div>
        )}
      </section>

      <EditThreadModal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        thread={thread}
        onUpdateThread={handleUpdateThread}
      />
    </>
  );
};

export default ThreadPage;

