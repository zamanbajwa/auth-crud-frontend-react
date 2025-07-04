import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Button, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Alert, Avatar
} from '@mui/material';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [success, setSuccess] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all users and check if current user is admin
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        // Get current user profile to check is_admin
        const me = await axios.get(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // If API returns an array, assume admin, else check is_admin
        if (Array.isArray(me.data)) {
          setIsAdmin(true);
        } else {
          setIsAdmin(!!me.data.is_admin);
        }
        // Get all users (admin only)
        const res = await axios.get(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        setError('Failed to fetch users or profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token, API_URL]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  // Create or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
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
      if (editingUser) {
        // Update user
        await axios.put(`${API_URL}/api/profile/${editingUser.id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(avatarFile ? { 'Content-Type': 'multipart/form-data' } : {}),
          },
        });
        setSuccess('User updated');
      } else {
        // Create user
        await axios.post(`${API_URL}/api/profile`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(avatarFile ? { 'Content-Type': 'multipart/form-data' } : {}),
          },
        });
        setSuccess('User created');
      }
      setForm({ name: '', email: '', phone: '', bio: '', avatar: '' });
      setAvatarFile(null);
      setEditingUser(null);
      setShowForm(false);
      // Refresh users
      const res2 = await axios.get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(Array.isArray(res2.data) ? res2.data : [res2.data]);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
      avatar: user.avatar || ''
    });
    setAvatarFile(null);
    setShowForm(true);
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${API_URL}/api/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('User deleted');
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  // Cancel editing/creating
  const handleCancel = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', phone: '', bio: '', avatar: '' });
    setAvatarFile(null);
    setShowForm(false);
  };

  // Show create form
  const handleShowCreate = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', phone: '', bio: '', avatar: '' });
    setAvatarFile(null);
    setShowForm(true);
  };

  return (
    <Box p={2} sx={{ minHeight: '100vh', width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'transparent', px: 2, maxWidth: '100vw', overflowX: 'hidden', minWidth: 0 }}>
      <Typography variant="h4" mb={2}>User Management (CRUD)</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : null}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {isAdmin && (
        <Button variant="contained" color="primary" onClick={handleShowCreate} sx={{ mb: 2 }}>
          Create User
        </Button>
      )}
      <Card sx={{ maxWidth: 1000, width: '100%', mx: 'auto', px: { xs: 1, sm: 2 }, background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)', boxShadow: 8, borderRadius: 4 }}>
        <CardContent>
          <Box sx={{ overflowX: 'auto', width: '100%' }}>
            <Table sx={{ minWidth: 650, width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Bio</TableCell>
                  <TableCell>Avatar</TableCell>
                  {isAdmin && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.bio}</TableCell>
                    <TableCell>
                      {user.avatar ? <Avatar src={user.avatar} alt="avatar" sx={{ width: 40, height: 40 }} /> : 'N/A'}
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Button variant="outlined" size="small" onClick={() => handleEdit(user)}>
                          Edit
                        </Button>
                        <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(user.id)} sx={{ ml: 1 }}>
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
      {isAdmin && showForm && (
        <Dialog fullWidth maxWidth="sm" open={showForm} onClose={handleCancel}>
          <DialogTitle>{editingUser ? 'Edit User' : 'Create User'}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField label="Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
              <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />
              <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
              <TextField label="Bio" name="bio" value={form.bio} onChange={handleChange} fullWidth />
              <Button variant="outlined" component="label">
                Upload Avatar
                <input type="file" name="avatar" accept="image/*" hidden onChange={handleAvatarChange} />
              </Button>
              {avatarFile && <Typography variant="body2">Selected: {avatarFile.name}</Typography>}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">{editingUser ? 'Update' : 'Create'}</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default Users; 