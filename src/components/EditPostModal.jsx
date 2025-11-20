import React, { useState, useEffect } from 'react';

const EditPostModal = ({ isOpen, onClose, post, onUpdatePost }) => {
  const [formData, setFormData] = useState({
    category: 'announcement',
    title: '',
    content: '',
    file: null,
  });

  useEffect(() => {
    if (post) {
      setFormData({
        category: post.category,
        title: post.title,
        content: post.content,
        file: null,
      });
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdatePost(post.id, formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Chỉnh sửa bài viết</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Chủ đề</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="announcement">Thông báo</option>
              <option value="qa">Hỏi đáp</option>
              <option value="resources">Tài liệu</option>
              <option value="entertainment">Giải trí</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tiêu đề</label>
            <input
              type="text"
              className="form-input"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung</label>
            <textarea
              className="form-textarea"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Đính kèm file (không bắt buộc)</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                className="file-input"
                id="editFileInput"
                name="file"
                onChange={handleChange}
              />
              <label htmlFor="editFileInput" className="file-input-label">
                📎 {post.attachment ? `Thay đổi file (hiện tại: ${post.attachment.name})` : 'Chọn file'}
              </label>
            </div>
            {post.attachment && !formData.file && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#7f8c8d' }}>
                File hiện tại: {post.attachment.name} ({post.attachment.size})
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Cập nhật bài viết
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
