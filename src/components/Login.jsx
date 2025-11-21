import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const defaultRegisterForm = {
  name: '',
  email: '',
  password: '',
  role: 'student',
};

const defaultLoginForm = {
  email: '',
  password: '',
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginForm, setLoginForm] = useState(defaultLoginForm);
  const [registerForm, setRegisterForm] = useState(defaultRegisterForm);
  const [status, setStatus] = useState({ loading: false, error: null });
  const { login, register, currentUser, isHydrating } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isHydrating && currentUser) {
      navigate('/');
    }
  }, [currentUser, isHydrating, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null });
    try {
      await login(loginForm);
      navigate('/');
    } catch (err) {
      setStatus({ loading: false, error: err.message || 'Đăng nhập thất bại' });
      return;
    }
    setStatus({ loading: false, error: null });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null });
    try {
      await register(registerForm);
      navigate('/');
    } catch (err) {
      setStatus({ loading: false, error: err.message || 'Đăng ký thất bại' });
      return;
    }
    setStatus({ loading: false, error: null });
  };

  const updateLoginField = (field, value) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateRegisterField = (field, value) => {
    setRegisterForm((prev) => ({ ...prev, [field]: value }));
  };
    
  const toggleMode = (nextIsLogin) => {
    setStatus({ loading: false, error: null });
    setIsLogin(nextIsLogin);
  };

  return (
    <div className="auth-section">
      <h1 className="auth-title">UltraVSC</h1>
      {status.error && (
        <div style={{ background: '#ffe6e6', color: '#c0392b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem' }}>
          {status.error}
        </div>
      )}
      {isLogin ? (
        <div id="loginForm">
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={loginForm.email}
                onChange={(e) => updateLoginField('email', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={loginForm.password}
                onChange={(e) => updateLoginField('password', e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status.loading}>
              {status.loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
          <div className="auth-toggle">
            Chưa có tài khoản?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleMode(false);
              }}
            >
              Đăng ký
            </a>
          </div>
        </div>
      ) : (
        <div id="registerForm">
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={registerForm.name}
                onChange={(e) => updateRegisterField('name', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={registerForm.email}
                onChange={(e) => updateRegisterField('email', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={registerForm.password}
                onChange={(e) => updateRegisterField('password', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Vai trò</label>
              <select
                name="role"
                className="form-select"
                value={registerForm.role}
                onChange={(e) => updateRegisterField('role', e.target.value)}
                required
              >
                <option value="student">Học sinh</option>
                <option value="teacher">Giáo viên</option>
                <option value="moderator">Moderator</option>
                <option value="maintainer">Site Maintainer</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status.loading}>
              {status.loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>
          <div className="auth-toggle">
            Đã có tài khoản?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleMode(true);
              }}
            >
              Đăng nhập
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

