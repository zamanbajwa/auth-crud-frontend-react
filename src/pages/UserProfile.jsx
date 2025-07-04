import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import {
  Box, Typography, Button, Card, CardContent, TextField, Avatar, CircularProgress, Alert, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

function getAvatarUrl(avatar) {
  if (!avatar) return null;
  const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
  return `${baseUrl}/storage/${avatar}`;
}

function UserProfile({ setIsAuthenticated }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user, loading, error, success, editing, setEditing, form, setForm, avatarFile, setAvatarFile, handleEdit, handleCancel, handleChange, handleAvatarChange, handleUpdate, handleDelete } = useContext(UserContext);
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up('md'));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <Box p={2} sx={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'transparent', px: 2, maxWidth: '100vw', overflowX: 'hidden', minWidth: 0 }}>
      <Header />
      <Box sx={{ width: '100%', mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h4" fontWeight={700} color="primary.main">
          My Profile
        </Typography>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : null}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {user && !editing && (
        <Card sx={{ mt: 3, maxWidth: 700, width: '100%', mx: 'auto', px: { xs: 1, sm: 2 }, background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)', boxShadow: 8, borderRadius: 4 }}>
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, pb: 0 }}>
            <Avatar src={getAvatarUrl(user.avatar)} alt="avatar" sx={{ width: { xs: 72, sm: 120 }, height: { xs: 72, sm: 120 }, mb: 2, boxShadow: 2 }} />
            <Typography variant="h5" fontWeight={600}>{user.name}</Typography>
            <Typography variant="body1" color="text.secondary"><strong>Email:</strong> {user.email}</Typography>
            <Typography variant="body1" color="text.secondary"><strong>Phone:</strong> {user.phone}</Typography>
            <Typography variant="body1" color="text.secondary"><strong>Bio:</strong> {user.bio}</Typography>
            <Box display="flex" gap={2} mt={2}>
              <Button variant="contained" onClick={handleEdit}>Edit</Button>
              {/* <Button variant="outlined" color="error" onClick={() => setDeleteDialogOpen(true)}>Delete</Button> */}
            </Box>
          </CardContent>
        </Card>
      )}
      {user && editing && (
        <Card sx={{ mt: 3, maxWidth: 700, width: '100%', mx: 'auto', px: { xs: 1, sm: 2 }, background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)', boxShadow: 8, borderRadius: 4 }}>
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, pb: 0 }}>
            <Box component="form" onSubmit={handleUpdate} display="flex" flexDirection="column" gap={3}>
              <Avatar src={avatarFile ? URL.createObjectURL(avatarFile) : getAvatarUrl(user.avatar)} alt="avatar" sx={{ width: { xs: 72, sm: 120 }, height: { xs: 72, sm: 120 }, mb: 2, alignSelf: 'center', boxShadow: 2 }} />
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

export default UserProfile; 