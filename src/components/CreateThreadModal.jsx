import React, { useState, useEffect } from 'react';

const getInitialFormState = (allowAnnouncement) => ({
  category: allowAnnouncement ? 'announcement' : 'qa',
  title: '',
  content: '',
  file: null,
});

const CreateThreadModal = ({ isOpen, onClose, onCreateThread, allowAnnouncement = true }) => {
  const [formData, setFormData] = useState(() => getInitialFormState(allowAnnouncement));
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề!');
      return;
    }
    if (!formData.content.trim()) {
      alert('Vui lòng nhập nội dung!');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const maybePromise = onCreateThread(formData);
      if (maybePromise && typeof maybePromise.then === 'function') {
        await maybePromise;
      }
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, file });
        setFileName(file.name);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, file: null });
    setFileName('');
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
  };

  useEffect(() => {
    setFormData((prev) => {
      if (allowAnnouncement) return prev;
      if (prev.category === 'announcement') {
        return { ...prev, category: 'qa' };
      }
      return prev;
    });
  }, [allowAnnouncement]);

  const handleClose = () => {
    setFormData(getInitialFormState(allowAnnouncement));
    setFileName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal active" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Tạo thread mới</h2>
          <button className="close-btn" onClick={handleClose}>
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
              disabled={!allowAnnouncement}
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
              maxLength={200}
              required
            />
            <div style={{ fontSize: '0.75rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
              {formData.title.length}/200 ký tự
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung</label>
            <textarea
              className="form-textarea"
              name="content"
              value={formData.content}
              onChange={handleChange}
              maxLength={5000}
              required
            />
            <div style={{ fontSize: '0.75rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
              {formData.content.length}/5000 ký tự
            </div>
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
                📎 {fileName || 'Chọn file'}
              </label>
            </div>
            {fileName && (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#495057' }}>📄 {fileName}</span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  style={{
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Xóa
                </button>
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
            {isSubmitting ? 'Đang đăng...' : 'Đăng thread'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateThreadModal; 