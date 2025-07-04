import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem('user_id');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', bio: '' });
  const [avatarFile, setAvatarFile] = useState(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!userId) return;
        const res = await axios.get(`${API_URL}/api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setUser(data);
        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
        });
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProfile();
  }, [userId, API_URL]);

  // Handlers
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
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
      });
    }
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
        data.append('_method', 'PUT');
        await axios.post(`${API_URL}/api/profile/${userId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        data = { ...form };
        await axios.put(`${API_URL}/api/profile/${userId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setSuccess('Profile updated!');
      setEditing(false);
      // Refresh profile
      const res = await axios.get(`${API_URL}/api/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        success,
        editing,
        setEditing,
        form,
        setForm,
        avatarFile,
        setAvatarFile,
        handleEdit,
        handleCancel,
        handleChange,
        handleAvatarChange,
        handleUpdate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
} 