import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

export const About: React.FC = () => {
  return (
    <Box sx={{ ml: -25, mt: 2 }}>
      <Paper sx={{ p: 3, mb: 2, mr: 8 }}>
        <Typography variant="h4" gutterBottom>
          About Certificate Manager
        </Typography>
        <Typography paragraph>
          Certificate Manager is a tool for checking and managing SSL certificates for websites.
        </Typography>
      </Paper>
    </Box>
  );
};
