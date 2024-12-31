import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { checkCertificate } from '../../../services/api/certificate.services';
import { ErrorDetails } from '../../../types/index.types';

const isDevelopment = process.env.NODE_ENV === 'development';

export const QueryWebsite: React.FC = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorDetails | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate URL format before making API call
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        throw new Error('URL must start with http:// or https://');
      }

      const response = await checkCertificate(url);
      isDevelopment && console.log('Success Response:', response);
      setResult(JSON.stringify(response, null, 2));
    } catch (err) {
      isDevelopment && console.error('Form Submission Error:', err);
      setError({
        message: err instanceof Error ? err.message : 'Failed to check certificate',
        technical: isDevelopment ? err instanceof Error ? err.stack : undefined : undefined
      });
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUrl('');
    setResult(null);
  };

  return (
    <Box sx={{ ml: -25, mt: 2 }}>
      <Paper sx={{ p: 3, mb: 4, mr: 8 }}>  {/* Increased right margin from 4 to 8 */}
        <Typography variant="h4" gutterBottom>
          Query Website Certificate
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Website URL"
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            margin="normal"
            disabled={loading}
          />
          
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={!url || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </Paper>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
        >
          <div>
            <strong>Error: </strong>{error.message}
            {isDevelopment && error.technical && (
              <Box 
                component="pre" 
                sx={{ 
                  mt: 1,
                  p: 1,
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  fontSize: '0.875rem',
                  overflow: 'auto'
                }}
              >
                {error.technical}
              </Box>
            )}
          </div>
        </Alert>
      )}

      {result && (
        <Paper sx={{ p: 3, mr: 8 }}>  {/* Increased right margin from 4 to 8 */}
          <Typography variant="h6" gutterBottom>
            Certificate Information
          </Typography>
          <Box
            component="pre"
            sx={{
              bgcolor: 'grey.100',
              p: 2,
              borderRadius: 1,
              overflow: 'auto'
            }}
          >
            {result}
          </Box>
        </Paper>
      )}
    </Box>
  );
};
