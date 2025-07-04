import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import {
  Box, Typography, Button, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Alert,
  TablePagination,
  Chip
} from '@mui/material';

function getAvatarUrl(avatar) {
  if (!avatar) return null;
  const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
  return `${baseUrl}/storage/${avatar}`;
}

function Dashboard({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    status: 'active',
  });
  const [createErrors, setCreateErrors] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [API_URL, success]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/api/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {}
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleView = (id) => {
    navigate(`/user/${id}`);
  };

  // --- Create User Logic ---
  const handleShowCreate = () => {
    setShowCreate(true);
    setCreateForm({
      name: '', email: '', phone: '', bio: '', password: '', confirmPassword: '', role: 'user', status: 'active'
    });
    setCreateErrors({});
    setSuccess('');
    setError('');
  };
  const handleCancelCreate = () => {
    setShowCreate(false);
    setCreateErrors({});
    setSuccess('');
    setError('');
  };
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({ ...prev, [name]: value }));
  };
  const validateCreate = () => {
    const errs = {};
    if (!createForm.name) errs.name = 'Name is required';
    if (!createForm.email) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(createForm.email)) errs.email = 'Invalid email format';
    if (!createForm.password) errs.password = 'Password is required';
    else if (createForm.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (createForm.password !== createForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateErrors({});
    setSuccess('');
    setError('');
    const errs = validateCreate();
    if (Object.keys(errs).length > 0) {
      setCreateErrors(errs);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const data = { ...createForm };
      data.password_confirmation = data.confirmPassword;
      delete data.confirmPassword;
      await axios.post(`${API_URL}/api/profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('User created!');
      setShowCreate(false);
      setCreateForm({ name: '', email: '', phone: '', bio: '', password: '', confirmPassword: '', role: 'user', status: 'active' });
      // User list will refresh due to useEffect dependency on success
    } catch (err) {
      if (err.response?.data?.errors) {
        setCreateErrors(err.response.data.errors);
      } else {
        setError('Failed to create user');
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box p={2} sx={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'transparent', px: 2, maxWidth: '100vw', overflowX: 'hidden', minWidth: 0 }}>
      <Header setIsAuthenticated={setIsAuthenticated} />
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2} mb={2}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="contained" color="primary" onClick={handleShowCreate} sx={{ ml: 2 }}>
          Create User
        </Button>
      </Box>
      <Dialog open={showCreate} onClose={handleCancelCreate} maxWidth="sm" fullWidth>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreateSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Name" name="name" value={createForm.name} onChange={handleCreateChange} required fullWidth error={!!createErrors.name} helperText={createErrors.name} />
            <TextField label="Email" name="email" type="email" value={createForm.email} onChange={handleCreateChange} required fullWidth error={!!createErrors.email} helperText={createErrors.email} />
            <TextField label="Phone" name="phone" value={createForm.phone} onChange={handleCreateChange} fullWidth />
            <TextField label="Bio" name="bio" value={createForm.bio} onChange={handleCreateChange} fullWidth />
            <TextField label="Password" name="password" type="password" value={createForm.password} onChange={handleCreateChange} required fullWidth error={!!createErrors.password} helperText={createErrors.password} />
            <TextField label="Confirm Password" name="confirmPassword" type="password" value={createForm.confirmPassword} onChange={handleCreateChange} required fullWidth error={!!createErrors.confirmPassword} helperText={createErrors.confirmPassword} />
            <Select name="role" value={createForm.role} onChange={handleCreateChange} fullWidth required>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
            <Select name="status" value={createForm.status} onChange={handleCreateChange} fullWidth required>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
            {Object.keys(createErrors).length > 0 && (
              <Alert severity="error">Please fix the errors above.</Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelCreate}>Cancel</Button>
          <Button onClick={handleCreateSubmit} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : null}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      <Card sx={{ mt: 3, maxWidth: 1000, width: '100%', mx: 'auto', px: { xs: 1, sm: 2 }, background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)', boxShadow: 8, borderRadius: 4 }}>
        <CardContent>
          <Box sx={{ overflowX: 'auto', width: '100%', maxHeight: 440, overflowY: 'auto' }}>
            <Table sx={{ minWidth: 650, width: '100%' }} stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Bio</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Avatar</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.bio}</TableCell>
                    <TableCell>
                      {user.role === 'admin' ? (
                        <Chip label="Admin" color="primary" size="small" sx={{ fontWeight: 700, letterSpacing: 1 }} />
                      ) : (
                        <Chip label="User" color="default" size="small" sx={{ fontWeight: 700, letterSpacing: 1 }} />
                      )}
                    </TableCell>
                    <TableCell>{user.avatar ? <img src={getAvatarUrl(user.avatar)} alt="avatar" width={40} height={40} style={{ borderRadius: 20 }} /> : 'N/A'}</TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" onClick={() => handleView(user.id)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <TablePagination
            component="div"
            count={users.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

export default Dashboard; 