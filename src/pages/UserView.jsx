import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Button, Card, CardContent, TextField, Avatar, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import Header from '../components/Header';

function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', bio: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setForm({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          bio: res.data.bio || '',
        });
      } catch (err) {
        setError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [API_URL, id]);

  const handleEdit = () => {
    setEditing(true);
    setSuccess('');
    setError('');
  };

  const handleCancel = () => {
    setEditing(false);
    setSuccess('');
    setError('');
    setAvatarFile(null);
    setForm({
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      bio: profile.bio || '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      let data;
      if (avatarFile) {
        data = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          data.append(key, value);
        });
        data.append('avatar', avatarFile);
      } else {
        data = { ...form };
      }
      await axios.put(`${API_URL}/api/profile/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(avatarFile ? { 'Content-Type': 'multipart/form-data' } : {}),
        },
      });
      setSuccess('User updated!');
      setEditing(false);
      // Refresh profile
      const res = await axios.get(`${API_URL}/api/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleDelete = async () => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('User deleted');
      setDeleteDialogOpen(false);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  function getAvatarUrl(avatar) {
    if (!avatar) return null;
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
    return `${baseUrl}/storage/${avatar}`;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'transparent',
        px: 2,
        maxWidth: '100vw',
        overflowX: 'hidden',
        minWidth: 0,
      }}
    >
      <Header />
      <Box sx={{ width: '100%', mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h4" fontWeight={700} color="primary.main">
          User Profile
        </Typography>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : null}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {profile && !editing && (
        <Card sx={{ boxShadow: 8, borderRadius: 4, maxWidth: 600, width: '100%', mx: 'auto', px: { xs: 1, sm: 2 }, mt: 3, background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)', display: 'flex', flexDirection: 'column', minHeight: 400 }}>
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, pb: 0 }}>
            <Avatar src={getAvatarUrl(profile.avatar)} alt="avatar" sx={{ width: { xs: 72, sm: 120 }, height: { xs: 72, sm: 120 }, mb: 2, boxShadow: 2 }} />
            <Typography variant="h5" fontWeight={600}>{profile.name}</Typography>
            <Typography variant="body1" color="text.secondary"><strong>Email:</strong> {profile.email}</Typography>
            <Typography variant="body1" color="text.secondary"><strong>Phone:</strong> {profile.phone}</Typography>
            <Typography variant="body1" color="text.secondary"><strong>Bio:</strong> {profile.bio}</Typography>
          </CardContent>
          {isAdmin && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', py: 2, borderTop: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
              <Button variant="contained" onClick={handleEdit} size="large">Edit</Button>
              <Button variant="outlined" color="error" onClick={() => setDeleteDialogOpen(true)} size="large">Delete</Button>
            </Box>
          )}
        </Card>
      )}
      {profile && editing && (
        <Card sx={{ boxShadow: 8, borderRadius: 4, maxWidth: 600, width: '100%', mx: 'auto', px: { xs: 1, sm: 2 }, mt: 3, background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
          <CardContent>
            <Box component="form" onSubmit={handleUpdate} display="flex" flexDirection="column" gap={3}>
              <Avatar src={avatarFile ? URL.createObjectURL(avatarFile) : getAvatarUrl(profile.avatar)} alt="avatar" sx={{ width: 120, height: 120, mb: 2, alignSelf: 'center', boxShadow: 2 }} />
              <TextField label="Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
              <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />
              <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
              <TextField label="Bio" name="bio" value={form.bio} onChange={handleChange} fullWidth />
              <Button variant="outlined" component="label" sx={{ alignSelf: 'center' }}>
                Upload Avatar
                <input type="file" name="avatar" accept="image/*" hidden onChange={handleAvatarChange} />
              </Button>
              {avatarFile && <Typography variant="body2" align="center">Selected: {avatarFile.name}</Typography>}
              <Box display="flex" gap={2} mt={2} justifyContent="center">
                <Button type="submit" variant="contained" size="large">Update</Button>
                <Button type="button" onClick={handleCancel} variant="outlined" size="large">Cancel</Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary" variant="outlined">Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserView; 