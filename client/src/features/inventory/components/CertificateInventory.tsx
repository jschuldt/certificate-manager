import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Collapse,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export const CertificateInventory: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    name: '',
    issuer: '',
    organization: '',
  });

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    validFrom: new Date(),
    validTo: new Date(),
    serialNumber: '',
    subject: '',
    organization: '',
    organizationalUnit: '',
  });

  const handleSearchChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ ...searchParams, [field]: event.target.value });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to search certificates
    // If found, set formData and show form
    setShowForm(true); // This should be conditional based on API response
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save certificate
    console.log(formData);
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleDateChange = (field: string) => (date: Date | null) => {
    if (date) {
      setFormData({ ...formData, [field]: date });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      {/* Search Form */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Search Certificate
        </Typography>
        <form onSubmit={handleSearch}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Certificate Name"
                value={searchParams.name}
                onChange={handleSearchChange('name')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Issuer"
                value={searchParams.issuer}
                onChange={handleSearchChange('issuer')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Organization"
                value={searchParams.organization}
                onChange={handleSearchChange('organization')}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Certificate Maintenance Form */}
      <Collapse in={showForm}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Certificate Details
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Certificate Name"
                  value={formData.name}
                  onChange={handleChange('name')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Issuer"
                  value={formData.issuer}
                  onChange={handleChange('issuer')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Valid From"
                    value={formData.validFrom}
                    onChange={handleDateChange('validFrom')}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Valid To"
                    value={formData.validTo}
                    onChange={handleDateChange('validTo')}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  value={formData.serialNumber}
                  onChange={handleChange('serialNumber')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={formData.subject}
                  onChange={handleChange('subject')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Organization"
                  value={formData.organization}
                  onChange={handleChange('organization')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Organizational Unit"
                  value={formData.organizationalUnit}
                  onChange={handleChange('organizationalUnit')}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Save Certificate
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Collapse>
    </Box>
  );
};
