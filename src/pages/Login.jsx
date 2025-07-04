import { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, TextField, Button, Typography, Alert, Box, Link } from '@mui/material';
import { AuthContext } from '../App';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('is_admin', response.data.user.role === 'admin' ? 'true' : 'false');
      localStorage.setItem('user_id', response.data.user.id);
      setIsAuthenticated(true);
      if (response.data.user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        px: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 400,
          p: { xs: 2, sm: 4 },
          boxShadow: 8,
          borderRadius: 4,
          mx: 'auto',
          animation: 'fadeIn 0.7s',
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid rgba(255,255,255,0.25)',
        }}
      >
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
                borderRadius: '50%',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
                boxShadow: 3,
                animation: 'popIn 0.7s',
              }}
            >
              <LockOutlinedIcon sx={{ color: '#fff', fontSize: 36 }} />
            </Box>
            <Typography variant="h4" fontWeight={700} color="primary.main" align="center" gutterBottom>
              Welcome Back
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              fullWidth
              autoFocus
              variant="outlined"
              size="medium"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
              size="medium"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 1, py: 1.5, fontWeight: 600, fontSize: '1.1rem', letterSpacing: 1 }}
            >
              Login
            </Button>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" sx={{ fontWeight: 600 }}>
              Register
            </Link>
          </Typography>
        </CardContent>
      </Card>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes popIn {
          0% { transform: scale(0.7); opacity: 0; }
          80% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </Box>
  );
}

export default Login; 