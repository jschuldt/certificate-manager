import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  AlertColor,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextFieldProps } from '@mui/material';
import { createCertificate, updateCertificate, deleteCertificate, refreshCertificate } from '../../../services/api/certificate.services';
import { CreateCertFormData, CreateCertificateDetails } from '../../../types/index.types';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const CreateCertificate: React.FC = () => {
  const [formData, setFormData] = useState<CreateCertFormData>({
    website: '',
    responsiblePerson: '',
    renewalDueDate: new Date(),
    comments: '',
  });

  const [certificateDetails, setCertificateDetails] = useState<CreateCertificateDetails>({
    name: '',
    issuer: '',
    validFrom: new Date(),
    validTo: new Date(),
    serialNumber: '',
    subject: '',
    organization: '',
    organizationalUnit: '',
    certLastQueried: null,
    metadata: {
      country: '',
      state: '',
      locality: '',
      alternativeNames: [],
      fingerprint: '',
      bits: null
    }
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [websiteError, setWebsiteError] = useState<string>('');
  const [isPullingCert, setIsPullingCert] = useState(false);
  const [alertType, setAlertType] = useState<AlertColor>('error');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const showComingSoonDialog = (feature: string) => {
    setDialogMessage(`${feature} feature coming soon!`);
    setOpenDialog(true);
  };

  const validateWebsite = (url: string): boolean => {
    if (!url.trim()) {
      setWebsiteError('Website is required');
      return false;
    }
    
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

  const handleDateChange = (field: string) => (date: Date | null) => {
    if (date) {
      setFormData({ ...formData, [field]: date });
    }
  };

  const showMessage = (message: string, type: AlertColor = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    // Optionally clear the message after a delay
    setTimeout(() => {
      setAlertMessage(null);
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);

    if (!validateWebsite(formData.website)) {
      return;
    }

    try {
      const certificateData = {
        certManager: {
          website: formData.website,
          responsiblePerson: formData.responsiblePerson,
          alertDate: formData.renewalDueDate.toISOString(),
          comments: formData.comments
        }
      };

      let response;
      if (certificateId) {
        // Update existing certificate
        await updateCertificate(certificateId, certificateData.certManager);
        showMessage('Certificate updated successfully!', 'success');
      } else {
        // Create new certificate
        response = await createCertificate(certificateData);
        setCertificateId(response._id);
        showMessage('Certificate created successfully!', 'success');
      }
    } catch (error) {
      console.error('Save failed:', error);
      showMessage(error instanceof Error ? error.message : 'Failed to save certificate', 'error');
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!certificateId) return;

    try {
      await deleteCertificate(certificateId);
      // Reset form and state after successful delete
      setFormData({
        website: '',
        responsiblePerson: '',
        renewalDueDate: new Date(),
        comments: '',
      });
      setCertificateId(null);
      setDeleteDialogOpen(false);
      showMessage('Certificate deleted successfully!', 'success');
    } catch (error) {
      setDeleteDialogOpen(false);
      showMessage(error instanceof Error ? error.message : 'Failed to delete certificate', 'error');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleNewRecord = () => {
    // Reload the page to reset everything
    window.location.reload();
  };

  const transformCertificateData = (data: any): CreateCertificateDetails => {
    return {
      name: data.name || '',
      issuer: data.issuer || '',
      validFrom: data.validFrom ? new Date(data.validFrom) : new Date(),
      validTo: data.validTo ? new Date(data.validTo) : new Date(),
      serialNumber: data.serialNumber || '',
      subject: data.subject || '',
      organization: data.organization || '',
      organizationalUnit: data.organizationalUnit || '',
      certLastQueried: data.certLastQueried ? new Date(data.certLastQueried).toISOString() : null,
      metadata: {
        country: data.metadata?.country || '',
        state: data.metadata?.state || '',
        locality: data.metadata?.locality || '',
        alternativeNames: data.metadata?.alternativeNames || [],
        fingerprint: data.metadata?.fingerprint || '',
        bits: data.metadata?.bits || null
      }
    };
  };

  const handlePullCertData = async () => {
    if (!certificateId) {
      showMessage('No certificate ID found', 'error');
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
    setSaveError(null);
  
    try {
      const updatedCert = await refreshCertificate(certificateId, formData.website);
      setCertificateDetails(prevDetails => ({
        ...prevDetails,
        ...transformCertificateData(updatedCert)
      }));
      showMessage('Certificate data refreshed successfully', 'success');
    } catch (err) {
      console.error('Certificate refresh failed:', err);
      showMessage(err instanceof Error ? err.message : 'Failed to refresh certificate data', 'error');
    } finally {
      setIsPullingCert(false);
    }
  };

  return (
    <Box sx={{ ml: -25, mt: 2 }}>
      <Paper sx={{ p: 3, mb: 2, mr: 8 }}>
        <Typography variant="h4" gutterBottom>
          {certificateId ? 'Edit Certificate' : 'Create Certificate'}
        </Typography>
      </Paper>

      {alertMessage && (
        <Alert 
          severity={alertType}
          sx={{ mb: 2, mr: 8 }}
          iconMapping={{
            success: <CheckCircleOutlineIcon fontSize="inherit" />
          }}
        >
          {alertMessage}
        </Alert>
      )}

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
                    error={!!websiteError}
                    helperText={websiteError}
                    placeholder="https://example.com"
                    sx={{
                      '& .MuiFormHelperText-root': {
                        color: theme => websiteError ? theme.palette.error.main : 'inherit'
                      }
                    }}
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
                        disabled={!formData.website}
                        sx={{ gridColumn: 'span 2' }}
                      >
                        {certificateId ? 'Update' : 'Save'}
                      </Button>
                      {certificateId && (
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => showComingSoonDialog('Create Certificate')}
                          >
                            Create Certificate
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handlePullCertData}
                            disabled={isPullingCert || !formData.website}
                            startIcon={isPullingCert ? <CircularProgress size={20} color="inherit" /> : null}
                          >
                            {isPullingCert ? 'Pulling...' : 'Pull Cert Data'}
                          </Button>
                          <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            onClick={handleNewRecord}
                          >
                            New Record
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            onClick={handleDeleteClick}
                          >
                            Delete
                          </Button>
                        </>
                      )}
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
              {/* Certificate Core Details */}
              <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>Core Details</Typography>
              <TextField
                fullWidth
                label="Name"
                value={certificateDetails.name}
                disabled
                size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
              />
              <TextField
                fullWidth
                label="Issuer"
                value={certificateDetails.issuer}
                disabled
                size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
              />
              <TextField
                fullWidth
                label="Valid From"
                value={certificateDetails.validFrom instanceof Date ? certificateDetails.validFrom.toLocaleDateString() : ''}
                disabled
                size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
              />
              <TextField
                fullWidth
                label="Valid To"
                value={certificateDetails.validTo instanceof Date ? certificateDetails.validTo.toLocaleDateString() : ''}
                disabled
                size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
              />

              {/* Certificate Details */}
              <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>Certificate Details</Typography>
              <TextField
                fullWidth
                label="Serial Number"
                value={certificateDetails.serialNumber}
                disabled
                size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
              />
              <TextField
                fullWidth
                label="Subject"
                value={certificateDetails.subject}
                disabled
                size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
              />
              <TextField
                fullWidth
                label="Organization"
                value={certificateDetails.organization}
                disabled
                size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
              />
              <TextField
                fullWidth
                label="Organizational Unit"
                value={certificateDetails.organizationalUnit}
                disabled
                size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
              />

              {/* Metadata */}
              <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>Additional Information</Typography>
              <TextField
                fullWidth
                label="Country"
                value={certificateDetails.metadata.country}
                disabled
                size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
              />
              <TextField
                fullWidth
                label="State"
                value={certificateDetails.metadata.state}
                disabled
                size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
              />
              <TextField
                fullWidth
                label="Locality"
                value={certificateDetails.metadata.locality}
                disabled
                size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
              />
              <TextField
                fullWidth
                label="Alternative Names"
                value={certificateDetails.metadata.alternativeNames.join(', ')}
                disabled
                size="small"
                multiline
                sx={{ backgroundColor: '#f5f5f5' }}
              />
              <TextField
                fullWidth
                label="Fingerprint"
                value={certificateDetails.metadata.fingerprint}
                disabled
                size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
              />
              <TextField
                fullWidth
                label="Bits"
                value={certificateDetails.metadata.bits || ''}
                disabled
                size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
              />
              {certificateDetails.certLastQueried && (
                <TextField
                  fullWidth
                  label="Last Queried"
                  value={new Date(certificateDetails.certLastQueried).toLocaleString()}
                  disabled
                  size="small"
                  sx={{ backgroundColor: '#f5f5f5' }}
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {saveError ? "Error" : "Success"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this certificate? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
