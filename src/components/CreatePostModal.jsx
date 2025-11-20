import React, { useState } from 'react';

const CreatePostModal = ({ isOpen, onClose, onCreatePost }) => {
  const [formData, setFormData] = useState({
    category: 'announcement',
    title: '',
    content: '',
    file: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreatePost(formData);
    setFormData({
      category: 'announcement',
      title: '',
      content: '',
      file: null,
    });
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

  if (!isOpen) return null;

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Tạo bài viết mới</h2>
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
                id="fileInput"
                name="file"
                onChange={handleChange}
              />
              <label htmlFor="fileInput" className="file-input-label">
                📎 Chọn file
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Đăng bài
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;

