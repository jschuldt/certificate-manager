import React from 'react';
import { Box, Typography, Container, styled } from '@mui/material';

// Styled components specific to this feature
const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.paper,
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.primary.main,
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

export const LandingPage: React.FC = () => {
  return (
    <StyledContainer maxWidth="lg">
      <StyledTitle variant="h2" as="h1">
        Under Construction
      </StyledTitle>
    </StyledContainer>
  );
};
