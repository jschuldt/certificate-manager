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
import { useNavigate } from 'react-router-dom';
import { StyledDrawer, StyledListItemButton } from '../../styles/Sidebar.styles';

export const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Query Website', icon: <SearchIcon />, path: '/query' },
    { text: 'Certificate Search', icon: <InventoryIcon />, path: '/inventory' }, // Updated text
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
