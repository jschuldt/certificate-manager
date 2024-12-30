import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

export const UserMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePreferences = () => {
    handleClose();
    navigate('/preferences');
  };

  const handleLogout = () => {
    // TODO: Implement logout
    handleClose();
  };

  return (
    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
      <IconButton
        size="large"
        onClick={handleMenu}
        color="inherit"
      >
         <AccountCircleIcon sx={{ width: 40, height: 40 }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handlePreferences}>
          <SettingsIcon sx={{ mr: 1 }} />
          <Typography>User Preferences</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};
