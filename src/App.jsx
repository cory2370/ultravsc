import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import MainApp from './components/MainApp';
import BoardPage from './components/BoardPage';
import ThreadPage from './components/ThreadPage';

const ProtectedRoute = ({ children }) => {
  const { currentUser, isHydrating } = useAuth();

  if (isHydrating) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Đang xác thực...</div>;
  }

  return currentUser ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainApp />
          </ProtectedRoute>
        }
      >
        <Route index element={<BoardPage />} />
        <Route path="threads/:threadId" element={<ThreadPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

