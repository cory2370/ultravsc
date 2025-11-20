import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    
    // For demo purposes, check if user exists in storage
    // In a real app, this would verify credentials against a backend
    const storedUser = sessionStorage.getItem('currentUser');
    let userData;
    
    if (storedUser) {
      // If user exists in storage, use that (preserves role)
      userData = JSON.parse(storedUser);
    } else {
      // Create new user for login (demo - in real app, this would verify credentials)
      // Note: Role cannot be changed after registration, so we default to student
      userData = {
        id: Date.now().toString(),
        name: email.split('@')[0] || 'User',
        email: email,
        role: 'student', // Default role for login (role is set during registration)
      };
    }
    
    login(userData);
    navigate('/');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelectorAll('input[type="email"]')[1]?.value;
    const role = formData.get('role') || e.target.querySelector('select').value;
    
    const userData = {
      id: Date.now().toString(), // Generate unique ID
      name: name,
      email: email,
      role: role, // Store the selected role
    };
    
    login(userData);
    navigate('/');
  };

  return (
    <div className="auth-section">
      <h1 className="auth-title">UltraVSC</h1>
      {isLogin ? (
        <div id="loginForm">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input type="password" name="password" className="form-input" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Đăng nhập
            </button>
          </form>
          <div className="auth-toggle">
            Chưa có tài khoản?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }}>
              Đăng ký
            </a>
          </div>
        </div>
      ) : (
        <div id="registerForm">
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <input type="text" name="name" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input type="password" name="password" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Vai trò</label>
              <select name="role" className="form-select" required>
                <option value="student">Học sinh</option>
                <option value="teacher">Giáo viên</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Đăng ký
            </button>
          </form>
          <div className="auth-toggle">
            Đã có tài khoản?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }}>
              Đăng nhập
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

