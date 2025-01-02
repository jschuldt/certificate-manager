import React, { useState } from 'react';
import { TextField, Button, CircularProgress } from '@mui/material';
import { refreshCertificate } from '../../../services/api/certificate.services';

export const CreateCert: React.FC = () => {
  const [formData, setFormData] = useState({
    website: '',
    _id: ''
  });
  const [websiteError, setWebsiteError] = useState<string>('');
  const [isPullingCert, setIsPullingCert] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateWebsite = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== 'https:') {
        setWebsiteError('Website must use HTTPS protocol');
        return false;
      }
      setWebsiteError('');
      return true;
    } catch (err) {
      setWebsiteError('Please enter a valid website URL');
      return false;
    }
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData({ ...formData, [field]: value });
    
    if (field === 'website') {
      if (value.trim() === '') {
        setWebsiteError('Website is required');
      } else {
        validateWebsite(value);
      }
    }
  };

  const handlePullCertData = async () => {
    if (!formData._id) {
      setError('No certificate ID found');
      return;
    }
    
    if (!formData.website.trim()) {
      setWebsiteError('Website is required');
      return;
    }

    if (!validateWebsite(formData.website)) {
      return;
    }
    
    setIsPullingCert(true);
    setError(null);
  
    try {
      const updatedCert = await refreshCertificate(formData._id, formData.website);
      setFormData(prevData => ({
        ...prevData,
        ...updatedCert
      }));
      setError('Certificate data refreshed successfully');
    } catch (err) {
      console.error('Certificate refresh failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh certificate data');
    } finally {
      setIsPullingCert(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.website.trim()) {
      setWebsiteError('Website is required');
      return;
    }

    if (!validateWebsite(formData.website)) {
      return;
    }

    // ...rest of existing submit logic...
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        required
        label="Website"
        value={formData.website}
        onChange={handleChange('website')}
        error={!!websiteError}
        helperText={websiteError}
        size="small"
        placeholder="https://example.com"
        sx={{
          '& .MuiFormHelperText-root': {
            color: theme => websiteError ? theme.palette.error.main : 'inherit'
          }
        }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handlePullCertData}
        disabled={isPullingCert || !formData.website}
        startIcon={isPullingCert ? <CircularProgress size={20} /> : null}
      >
        {isPullingCert ? 'Pulling...' : 'Pull Cert Data'}
      </Button>
      {/* ...rest of existing JSX... */}
    </form>
  );
};
