import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, TextField, Button, Typography, Alert, Box, Link } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setErrors({});
    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }
    try {
      const data = { ...form };
      data.password_confirmation = data.confirmPassword;
      delete data.confirmPassword;
      const response = await axios.post(`${API_URL}/api/register`, data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('is_admin', response.data.user.is_admin ? 'true' : 'false');
      localStorage.setItem('user_id', response.data.user.id);
      setSuccess('Registration successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
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
          width: { xs: '100%', sm: '80%', md: '60%', lg: '50%' },
          maxWidth: 700,
          p: { xs: 2, sm: 4 },
          boxShadow: 8,
          borderRadius: 4,
          mx: 'auto',
          animation: 'fadeIn 0.7s',
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid rgba(255,255,255,0.25)',
          minHeight: 0,
        }}
      >
        <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
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
              <PersonAddAlt1Icon sx={{ color: '#fff', fontSize: 36 }} />
            </Box>
            <Typography variant="h4" fontWeight={700} color="primary.main" align="center" gutterBottom>
              Create Account
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                fullWidth
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
              />
            </Box>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 1, py: 1.5, fontWeight: 600, fontSize: '1.1rem', letterSpacing: 1 }}
            >
              Register
            </Button>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>
              Login
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

export default Register; 