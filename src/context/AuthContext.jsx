import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  // Helper functions for role checking
  const isStudent = () => currentUser?.role === 'student';
  const isTeacher = () => currentUser?.role === 'teacher';
  
  // Permission checks
  const canDeletePost = (postAuthorId) => {
    if (!currentUser || !postAuthorId) return false;
    // Teachers can delete any post, students can only delete their own
    if (isTeacher()) return true;
    if (isStudent()) return currentUser.id === postAuthorId;
    return false;
  };
  
  const canEditPost = (postAuthorId) => {
    if (!currentUser || !postAuthorId) return false;
    // Both students and teachers can only edit their own posts
    return currentUser.id === postAuthorId;
  };
  
  const getRoleLabel = () => {
    if (!currentUser) return '';
    return currentUser.role === 'teacher' ? 'Giáo viên' : 'Học sinh';
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isStudent,
        isTeacher,
        canDeletePost,
        canEditPost,
        getRoleLabel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

