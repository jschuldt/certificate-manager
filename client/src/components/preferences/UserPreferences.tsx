import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
  SelectChangeEvent,
} from '@mui/material';

export const UserPreferences: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    notificationPreferences: [] as string[],
  });

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement save preferences
    console.log(formData);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>User Preferences</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleTextChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleTextChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleTextChange}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Notification Preferences</InputLabel>
            <Select
              multiple
              name="notificationPreferences"
              value={formData.notificationPreferences}
              onChange={handleSelectChange}
              label="Notification Preferences"
              renderValue={(selected) => (selected as string[]).join(', ')}
            >
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="sms">SMS</MenuItem>
              <MenuItem value="push">Push Notifications</MenuItem>
              <MenuItem value="inApp">In-App Notifications</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Save Preferences
          </Button>
        </form>
      </Paper>
    </Box>
  );
};
