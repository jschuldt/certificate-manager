import React from 'react';
import {
  List,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from 'react-router-dom';
import { StyledDrawer, StyledListItemButton } from '../../styles/Sidebar.styles';

export const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Create Cert', icon: <AddCircleOutlineIcon />, path: '/create' },
    { text: 'Maintain Cert', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Pull Cert', icon: <SearchIcon />, path: '/query' },
    { text: 'Query Cert', icon: <SearchIcon />, path: '/search' },
    { text: 'Admin', icon: <AdminPanelSettingsIcon />, path: '/admin' },
    { text: 'About', icon: <InfoIcon />, path: '/about' },
  ];

  return (
    <StyledDrawer variant="permanent" anchor="left">
      <List>
        {menuItems.map((item) => (
          <StyledListItemButton
            key={item.text} 
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </StyledListItemButton>
        ))}
      </List>
    </StyledDrawer>
  );
};
