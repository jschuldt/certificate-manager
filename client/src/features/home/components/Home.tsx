import React from 'react';
import { Typography, Box } from '@mui/material';

export const Home: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Certificate Manager
      </Typography>
      <Typography variant="h5" color="textSecondary">
        Version 0.1 - Currently Under Construction
      </Typography>
    </Box>
  );
};
