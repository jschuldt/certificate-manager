import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const Home: React.FC = () => {
  return (
    <Box sx={{ ml: -25, mt: 2 }}>  {/* Added margins to match CertificateSearch */}
      <Paper sx={{ p: 3, mb: 2, mr: 8 }}>  {/* Increased right margin from 4 to 8 */}
        <Typography variant="h4" gutterBottom>
          Welcome to Certificate Manager
        </Typography>
        <Typography variant="h5" color="textSecondary">
          Version 0.1 - Currently Under Construction
        </Typography>
      </Paper>
    </Box>
  );
};
