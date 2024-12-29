import React from 'react';
import { Typography, Box } from '@mui/material';

export const About: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        About Certificate Manager
      </Typography>
      <Typography paragraph>
        Certificate Manager is a tool for checking and managing SSL certificates for websites.
      </Typography>
    </Box>
  );
};
