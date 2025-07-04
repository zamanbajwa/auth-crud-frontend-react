import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserProfile from './pages/UserProfile';
import UserView from './pages/UserView';
import './App.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { UserProvider } from './context/UserContext';

// AuthContext for global authentication state
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  useEffect(() => {
    function syncAuth() {
      setIsAuthenticated(!!localStorage.getItem('token'));
    }
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuthContext() {
  return useContext(AuthContext);
}

function App() {
  const { isAuthenticated, setIsAuthenticated } = useAuthContext();
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#9c27b0' },
    },
  });

  function AuthRedirect({ children }) {
    const { isAuthenticated } = useAuthContext();
    if (isAuthenticated) {
      if (isAdmin) return <Navigate to="/dashboard" />;
      return <Navigate to="/profile" />;
    }
    return children;
  }

  function ProtectedRoute({ children, adminOnly, userOnly }) {
    const { isAuthenticated } = useAuthContext();
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (adminOnly && !isAdmin) return <Navigate to="/profile" />;
    if (userOnly && isAdmin) return <Navigate to="/dashboard" />;
    return children;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={
              <AuthRedirect>
                <Login setIsAuthenticated={setIsAuthenticated} />
              </AuthRedirect>
            } />
            <Route path="/register" element={
              <AuthRedirect>
                <Register />
              </AuthRedirect>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute adminOnly>
                <Dashboard setIsAuthenticated={setIsAuthenticated} />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute userOnly>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/user/:id" element={
              <ProtectedRoute adminOnly>
                <UserView />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
