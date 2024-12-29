import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import ListItemButton from '@mui/material/ListItemButton';

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 240,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
  },
}));

export const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));
