import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api';
import { getRoleConfig } from '../utils/roles';

const AuthContext = createContext(null);
const TOKEN_STORAGE_KEY = 'ultravsc_auth_token';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const roleCanModerate = (role) => role === 'moderator' || role === 'maintainer';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [isHydrating, setIsHydrating] = useState(!!token);
  const [error, setError] = useState(null);

  const persistToken = (value) => {
    setToken(value);
    if (value) {
      localStorage.setItem(TOKEN_STORAGE_KEY, value);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsHydrating(false);
        return;
      }
      try {
        const user = await api.getCurrentUser(token);
        setCurrentUser(user);
        setError(null);
      } catch (err) {
        console.error('Failed to load current user', err);
        setCurrentUser(null);
        persistToken(null);
        setError(err.message || 'Không thể xác thực người dùng');
      } finally {
        setIsHydrating(false);
    }
    };
    bootstrap();
  }, [token]);

  const register = async ({ name, email, password, role }) => {
    const result = await api.registerUser({ name, email, password, role });
    setCurrentUser(result.user);
    persistToken(result.token);
    return result.user;
  };

  const login = async ({ email, password }) => {
    const result = await api.loginUser({ email, password });
    setCurrentUser(result.user);
    persistToken(result.token);
    return result.user;
  };

  const logout = () => {
    setCurrentUser(null);
    persistToken(null);
  };

  const refreshCurrentUser = async () => {
    if (!token) return null;
    const user = await api.getCurrentUser(token);
    setCurrentUser(user);
    return user;
  };

  const ability = useMemo(() => {
    const user = currentUser;
    if (!user) {
      return {
        canEditPost: () => false,
        canDeletePost: () => false,
        canEditComment: () => false,
        canDeleteComment: () => false,
      };
    }
    const canModerate = roleCanModerate(user.role);
    const owns = (authorId) => authorId && authorId === user.id;
    const canEditPost = (authorId) => canModerate || owns(authorId);
    const canDeletePost = (authorId) => canModerate || owns(authorId);
    const canEditComment = (authorId) => canModerate || owns(authorId);
    const canDeleteComment = (authorId) => canModerate || owns(authorId);
    return { canEditPost, canDeletePost, canEditComment, canDeleteComment };
  }, [currentUser]);
  
  const getRoleLabel = () => {
    if (!currentUser) return '';
    return getRoleConfig(currentUser.role).label;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        error,
        isHydrating,
        login,
        register,
        logout,
        refreshCurrentUser,
        canEditPost: ability.canEditPost,
        canDeletePost: ability.canDeletePost,
        canEditComment: ability.canEditComment,
        canDeleteComment: ability.canDeleteComment,
        getRoleLabel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

