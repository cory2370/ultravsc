import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Comment from './Comment';

const Post = ({ post, onLike, onReport, onEdit, onDelete }) => {
  const { currentUser, canEditPost, canDeletePost } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    const newLiked = !liked;
    // Update local state optimistically
    setLiked(newLiked);
    const newCount = newLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    setLikeCount(newCount);
    // Notify parent to update the post in the list
    if (onLike) onLike(post.id, newLiked);
  };
  
  // Sync local state with post prop changes
  useEffect(() => {
    setLiked(post.liked);
    setLikeCount(post.likes);
  }, [post.liked, post.likes]);

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleReport = () => {
    if (window.confirm('Bạn có chắc muốn báo cáo bài viết này?')) {
      alert('Báo cáo đã được gửi đến quản trị viên.');
      if (onReport) onReport(post.id);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      announcement: 'Thông báo',
      qa: 'Hỏi đáp',
      resources: 'Tài liệu',
      entertainment: 'Giải trí',
    };
    return labels[category] || category;
  };

  return (
    <div className="post" data-category={post.category}>
      <div className="post-header">
        <div className="post-author">
          <div className="avatar">{post.author.initials}</div>
          <div className="author-info">
            <div className="author-name">{post.author.name}</div>
            <div className="post-time">{post.time}</div>
          </div>
        </div>
        <span className="post-category">{getCategoryLabel(post.category)}</span>
      </div>
      <div className="post-content">
        <div className="post-title">{post.title}</div>
        <p>{post.content}</p>
        {post.attachment && (
          <div className="post-attachment">
            📄 {post.attachment.name} ({post.attachment.size})
          </div>
        )}
        {/* Edit/Delete buttons - shown based on permissions */}
        {post.authorId && (canEditPost(post.authorId) || canDeletePost(post.authorId)) && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            {canEditPost(post.authorId) && (
              <button
                className="btn btn-secondary"
                onClick={() => onEdit && onEdit(post)}
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
              >
                ✏️ Chỉnh sửa
              </button>
            )}
            {canDeletePost(post.authorId) && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
                    onDelete && onDelete(post.id);
                  }
                }}
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: '#e74c3c', color: 'white' }}
              >
                🗑️ Xóa
              </button>
            )}
          </div>
        )}
      </div>
      <div className="post-actions">
        <button
          className={`action-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <span>❤️</span>
          <span className="like-count">{likeCount}</span>
        </button>
        <button className="action-btn" onClick={handleToggleComments}>
          <span>💬</span>
          <span>{post.comments.length} bình luận</span>
        </button>
        <button className="action-btn" onClick={handleReport}>
          <span>⚠️</span>
          <span>Báo cáo</span>
        </button>
      </div>
      {showComments && (
        <div className={`comments-section ${showComments ? '' : 'hidden'}`}>
          {post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))
          ) : (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#7f8c8d' }}>
              Chưa có bình luận nào
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;

