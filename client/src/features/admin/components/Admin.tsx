import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const Admin: React.FC = () => {
  return (
    <Box sx={{ ml: -25, mt: 2 }}>
      <Paper sx={{ p: 3, mb: 2, mr: 8 }}>
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>
        <Typography variant="body1">
          Administrative features coming soon...
        </Typography>
      </Paper>
    </Box>
  );
};
