import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import axios from 'axios';
import {
  AppBar, Toolbar, Typography, Avatar, Button, Box
} from '@mui/material';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../App';

function getAvatarUrl(avatar) {
  if (!avatar) return null;
  const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
  return `${baseUrl}/storage/${avatar}`;
}

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { setIsAuthenticated } = useContext(AuthContext);
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  const handleLogout = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/api/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {}
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('user_id');
    setIsAuthenticated && setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <Box sx={{ width: '100vw', display: 'flex', justifyContent: 'center', mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
      <AppBar
        position="static"
        color="default"
        elevation={1}
        sx={{
          maxWidth: 1200,
          width: '100%',
          borderRadius: 4,
          mx: 'auto',
          boxShadow: 8,
          px: { xs: 1, sm: 4 },
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={2}>
            {isAdmin && location.pathname === '/profile' && (
              <Button color="primary" variant="outlined" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            )}
            {isAdmin && (
              <Button color="primary" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            )}
            {!isAdmin && (
              <Button color="primary" onClick={() => navigate('/profile')}>
                Profile
              </Button>
            )}
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {user && (
              <>
                {user.avatar && <Avatar src={getAvatarUrl(user.avatar)} alt="avatar" sx={{ width: 32, height: 32 }} />}
                <Typography variant="body1">{user.name}</Typography>
              </>
            )}
            <Button color="inherit" variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header; 