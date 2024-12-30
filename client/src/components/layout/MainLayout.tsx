import React from 'react';
import { Box, styled } from '@mui/material';
import { Sidebar } from '../navigation/Sidebar';
import { UserMenu } from '../navigation/UserMenu';

const StyledLayout = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
}));

const MainContent = styled(Box)(() => ({
  flexGrow: 1,
  padding: '20px',
  marginLeft: '240px', // Match drawer width
}));

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <StyledLayout>
      <Sidebar />
      <UserMenu />
      <MainContent>
        {children}
      </MainContent>
    </StyledLayout>
  );
};
