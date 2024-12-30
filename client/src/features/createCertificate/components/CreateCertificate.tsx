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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextFieldProps } from '@mui/material';

export const CreateCertificate: React.FC = () => {
  const [formData, setFormData] = useState({
    website: '',
    responsiblePerson: '',
    renewalDueDate: new Date(),
    comments: '',
  });

  const [certificateDetails, setCertificateDetails] = useState({
    name: '',
    issuer: '',
    validFrom: new Date(),
    validTo: new Date(),
    serialNumber: '',
    subject: '',
    organization: '',
    organizationalUnit: '',
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleDateChange = (field: string) => (date: Date | null) => {
    if (date) {
      setFormData({ ...formData, [field]: date });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement certificate creation
    console.log(formData);
  };

  return (
    <Box sx={{ ml: -25, mt: 2 }}>
      <Paper sx={{ p: 3, mb: 2, mr: 8 }}>
        <Typography variant="h4" gutterBottom>
          Create Certificate
        </Typography>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 2,
            height: 'calc(100vh - 280px)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2, fontSize: '1.2rem' }}>
              Certificate Management
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Website"
                    value={formData.website}
                    onChange={handleChange('website')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Person Responsible"
                    value={formData.responsiblePerson}
                    onChange={handleChange('responsiblePerson')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Alert Notification Date"
                      value={formData.renewalDueDate}
                      onChange={handleDateChange('renewalDueDate')}
                      renderInput={(params: TextFieldProps) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
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
                <Grid item xs={12}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      borderRadius: 1
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 2,
                        color: 'text.secondary',
                        fontWeight: 500
                      }}
                    >
                      Options
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: 1,
                      '& .MuiButton-root': {
                        height: '48px'
                      }
                    }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        Create
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => console.log('Pull cert data')}
                      >
                        Pull Cert Data
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => console.log('Create certificate')}
                      >
                        Create Certificate
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={() => console.log('Cancel')}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 2,
            mr: 8,
            height: 'calc(100vh - 280px)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white'
          }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2, fontSize: '1.2rem' }}>
              Certificate Details
            </Typography>
            <Box sx={{
              overflowY: 'auto',
              flex: 1,
              '& .MuiTextField-root': {
                display: 'block',
                width: '100%',
                mb: 2
              }
            }}>
              {Object.entries(certificateDetails)
                .map(([key, value]) => (
                  <TextField
                    key={key}
                    fullWidth
                    label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    value={value instanceof Date ? '' : value}
                    disabled
                    size="small"
                    sx={{ 
                      backgroundColor: '#f5f5f5',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
