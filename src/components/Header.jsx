import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getRoleConfig } from '../utils/roles';

const Header = () => {
  const { currentUser, logout, getRoleLabel } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">🏫 UltraVSC</div>
        <div className="credit-section">
          <p>Made and maintained with ❤️ by Ngô Quang Tùng (9A5)</p>
          <div className="contact-section">
            <span className="contact-label">Liên Hệ Tại:</span>
            <div className="social-buttons">
              <a
                href="https://facebook.com"
                className="social-btn facebook"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <img src="https://cdn.simpleicons.org/facebook/FFFFFF" alt="Facebook" />
              </a>
              <a
                href="https://instagram.com"
                className="social-btn instagram"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <img src="https://cdn.simpleicons.org/instagram/FFFFFF" alt="Instagram" />
              </a>
              <a
                href="https://twitter.com"
                className="social-btn twitter"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zalo"
              >
                <img src="https://cdn.simpleicons.org/zalo/FFFFFF" alt="Zalo" />
              </a>
              <a
                href="https://github.com/cory2370/ultravsc"
                className="social-btn github"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <img src="https://cdn.simpleicons.org/github/FFFFFF" alt="GitHub" />
              </a>
            </div>
          </div>
        </div>
        <div className="user-info">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
            <span id="userName">{currentUser?.name || 'User'}</span>
            {currentUser && (
              <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                {getRoleConfig(currentUser.role).icon} {getRoleLabel()}
              </span>
            )}
          </div>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

