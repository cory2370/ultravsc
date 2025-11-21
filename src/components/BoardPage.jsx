import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryFilter from './CategoryFilter';
import CreateThreadModal from './CreateThreadModal';
import EditThreadModal from './EditThreadModal';
import ThreadSummaryCard from './ThreadSummaryCard';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const BoardPage = () => {
  const { token, currentUser, canEditPost, canDeletePost } = useAuth();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [threadToEdit, setThreadToEdit] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();

  const sortThreads = (list) =>
    [...list].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const data = await api.fetchThreads(token);
      setThreads(sortThreads(data));
      setError(null);
    } catch (err) {
      console.error('Failed to load threads', err);
      setError(err.message || 'Không thể tải danh sách thread');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredThreads = useMemo(() => {
    if (filter === 'all') return threads;
    return threads.filter((thread) => thread.category === filter);
  }, [threads, filter]);

  const openThread = (threadId) => {
    navigate(`/threads/${threadId}`);
  };

  const allowedAnnouncementRoles = ['teacher', 'moderator', 'maintainer'];
  const canCreateAnnouncement = !!(currentUser && allowedAnnouncementRoles.includes(currentUser.role));

  const handleCreateThread = async (formData) => {
    if (!token) {
      alert('Bạn cần đăng nhập để đăng thread!');
      return;
    }
    if (formData.category === 'announcement' && !canCreateAnnouncement) {
      alert('Chỉ giáo viên, moderator hoặc site maintainer mới được đăng thread Thông báo.');
      return;
    }
    try {
      const payload = {
        category: formData.category,
        title: formData.title.trim(),
        content: formData.content.trim(),
      };
      if (formData.file) {
        payload.attachment = {
          name: formData.file.name,
          size: `${(formData.file.size / 1024 / 1024).toFixed(2)} MB`,
        };
      }
      const created = await api.createThread(token, payload);
      setThreads((prev) => sortThreads([created, ...prev]));
    } catch (err) {
      console.error('Failed to create thread', err);
      alert(err.message || 'Không thể tạo thread mới');
    }
  };

  const handleEdit = (thread) => {
    setThreadToEdit(thread);
    setIsEditOpen(true);
  };

  const handleUpdateThread = async (threadId, formData) => {
    if (!token) return;
    if (formData.category === 'announcement' && !canCreateAnnouncement) {
      alert('Bạn không có quyền chuyển thread sang mục Thông báo.');
      return;
    }
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
      const updated = await api.updateThread(token, threadId, payload);
      setThreads((prev) => sortThreads(prev.map((thread) => (thread.id === threadId ? updated : thread))));
    } catch (err) {
      console.error('Failed to update thread', err);
      alert(err.message || 'Không thể cập nhật thread');
    }
  };

  const handleDelete = async (thread) => {
    if (!token) return;
    if (!window.confirm('Bạn có chắc muốn xóa thread này?')) return;
    try {
      await api.deleteThread(token, thread.id);
      setThreads((prev) => prev.filter((item) => item.id !== thread.id));
      if (threadToEdit?.id === thread.id) {
        closeEditModal();
      }
    } catch (err) {
      console.error('Failed to delete thread', err);
      alert(err.message || 'Không thể xóa thread');
    }
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setThreadToEdit(null);
  };

  return (
    <>
      <CategoryFilter currentFilter={filter} onFilterChange={setFilter} />
      <div className="create-post-section">
        <div
          className="create-post-input"
          onClick={() => {
            if (!currentUser) {
              alert('Bạn cần đăng nhập để tạo thread!');
              return;
            }
            setIsCreateOpen(true);
          }}
          style={{ cursor: currentUser ? 'pointer' : 'not-allowed', opacity: currentUser ? 1 : 0.7 }}
        >
          Tạo thread mới
        </div>
      </div>
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải thread...</div>
      ) : error ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#e74c3c' }}>{error}</div>
      ) : filteredThreads.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
          Chưa có thread nào trong mục này
        </div>
      ) : (
        <div className="posts" id="threadsBoard">
          {filteredThreads.map((thread) => (
            <ThreadSummaryCard
              key={thread.id}
              thread={thread}
              onOpen={openThread}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={canEditPost(thread.authorId)}
              canDelete={canDeletePost(thread.authorId)}
            />
          ))}
        </div>
      )}
      <CreateThreadModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateThread={handleCreateThread}
        allowAnnouncement={!!canCreateAnnouncement}
      />
      <EditThreadModal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        thread={threadToEdit}
        onUpdateThread={handleUpdateThread}
      />
    </>
  );
};

export default BoardPage;

