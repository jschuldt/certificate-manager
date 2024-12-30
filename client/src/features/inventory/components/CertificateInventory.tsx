import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextFieldProps } from '@mui/material';

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
    // Add new metadata fields
    website: '',
    responsiblePerson: '',
    renewalDueDate: new Date(),
    comments: '',
    lastUpdated: new Date(), // Add this new field
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
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
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

      {/* Split Screen Layout */}
      {showForm && (
        <Grid container spacing={3}>
          {/* Left Side - Certificate Management */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h4" gutterBottom>
                Certificate Management
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Certificate Metadata Section */}
                  <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>
                      Certificate Metadata
                    </Typography>
                  </Grid>
                  {/* Website field */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Website"
                      value={formData.website}
                      onChange={handleChange('website')}
                    />
                  </Grid>
                  {/* Person Responsible field */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Person Responsible"
                      value={formData.responsiblePerson}
                      onChange={handleChange('responsiblePerson')}
                    />
                  </Grid>
                  {/* Renewal Due Date picker */}
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Renewal Due Date"
                        value={formData.renewalDueDate}
                        onChange={handleDateChange('renewalDueDate')}
                        renderInput={(params: TextFieldProps) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  {/* Comments field */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Comments"
                      value={formData.comments}
                      onChange={handleChange('comments')}
                      multiline
                      rows={4}
                    />
                  </Grid>
                  {/* Save Button */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                    >
                      Save Metadata
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Right Side - Certificate Details */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h4" gutterBottom>
                Certificate Details
              </Typography>
              <Grid container spacing={3}>
                {/* Certificate Name */}
                <Grid item xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    label="Certificate Name"
                    value={formData.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    label="Issuer"
                    value={formData.issuer}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      label="Valid From"
                      value={formData.validFrom}
                      disabled
                      onChange={() => {}} // Add no-op handler
                      renderInput={(params: TextFieldProps) => <TextField {...params} fullWidth disabled />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      label="Valid To"
                      value={formData.validTo}
                      disabled
                      onChange={() => {}} // Add no-op handler
                      renderInput={(params: TextFieldProps) => <TextField {...params} fullWidth disabled />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    label="Serial Number"
                    value={formData.serialNumber}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    fullWidth
                    label="Subject"
                    value={formData.subject}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    disabled
                    fullWidth
                    label="Organization"
                    value={formData.organization}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    disabled
                    fullWidth
                    label="Organizational Unit"
                    value={formData.organizationalUnit}
                  />
                </Grid>
                {/* Add Last Updated field at the end */}
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      label="Last Updated"
                      value={formData.lastUpdated}
                      disabled
                      onChange={() => {}}
                      renderInput={(params: TextFieldProps) => <TextField {...params} fullWidth disabled />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
