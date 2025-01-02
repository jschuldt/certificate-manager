import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextFieldProps } from '@mui/material';
import { searchCertificates, updateCertificate, deleteCertificate, refreshCertificate } from '../../../services/api/certificate.services';
import { Certificate, SearchResponse } from '../../../types/index.types';
import { parseISO, format } from 'date-fns';
import { format as formatTz, utcToZonedTime } from 'date-fns-tz'; // Add date-fns-tz import
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { CertificateField } from '../../../types/index.types';

export const CertificateSearch: React.FC = () => {
  // Add new state for navigation
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  // ...existing state declarations...
  const [searchParams, setSearchParams] = useState({
    name: '',
    website: '',
    organization: '',
    responsiblePerson: '',
  });

  const [showForm, setShowForm] = useState(false);

  // First, update the form data interface
  interface FormData {
    name: string;
    issuer: string;
    validFrom: Date;
    validTo: Date;
    serialNumber: string;
    subject: string;
    organization: string;
    organizationalUnit: string;
    website: string;
    responsiblePerson: string;
    renewalDueDate: Date;
    comments: string;
    lastUpdated: Date;
  }

  const [formData, setFormData] = useState<FormData>({
    name: '',
    issuer: '',
    validFrom: new Date(),
    validTo: new Date(),
    serialNumber: '',
    subject: '',
    organization: '',
    organizationalUnit: '',
    website: '',
    responsiblePerson: '',
    renewalDueDate: new Date(),
    comments: '',
    lastUpdated: new Date(),
  });

  const [searchResults, setSearchResults] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPullingCert, setIsPullingCert] = useState(false); // Add new state for pull cert loading

  const handleSearchChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ ...searchParams, [field]: event.target.value });
  };

  // Helper function to safely parse dates
  const safeParseDate = (dateString: string | null | undefined): Date => {
    if (!dateString) return new Date();
    try {
      const parsedDate = parseISO(dateString);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date');
      }
      return parsedDate;
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return new Date();
    }
  };

  // Add a date formatting function
  const formatDate = (date: Date): string => {
    try {
      return formatTz(date, 'MM/dd/yyyy', { timeZone: 'UTC' });
    } catch (error) {
      console.error('Error formatting date:', date, error);
      return '';
    }
  };

  // Add navigation handlers
  const handleNextRecord = () => {
    if (currentRecordIndex < searchResults.length - 1) {
      setCurrentRecordIndex(currentRecordIndex + 1);
      const nextCert = searchResults[currentRecordIndex + 1];
      // Clear current certificate and form data
      setSelectedCertificate(null);
      setFormData({
        name: '',
        issuer: '',
        validFrom: new Date(),
        validTo: new Date(),
        serialNumber: '',
        subject: '',
        organization: '',
        organizationalUnit: '',
        website: '',
        responsiblePerson: '',
        renewalDueDate: new Date(),
        comments: '',
        lastUpdated: new Date()
      });
      // Set new certificate on next tick
      setTimeout(() => setSelectedCertificate(nextCert), 50);
    }
  };

  const handlePreviousRecord = () => {
    if (currentRecordIndex > 0) {
      setCurrentRecordIndex(currentRecordIndex - 1);
      const prevCert = searchResults[currentRecordIndex - 1];
      // Clear current certificate and form data
      setSelectedCertificate(null);
      setFormData({
        name: '',
        issuer: '',
        validFrom: new Date(),
        validTo: new Date(),
        serialNumber: '',
        subject: '',
        organization: '',
        organizationalUnit: '',
        website: '',
        responsiblePerson: '',
        renewalDueDate: new Date(),
        comments: '',
        lastUpdated: new Date()
      });
      // Set new certificate on next tick
      setTimeout(() => setSelectedCertificate(prevCert), 50);
    }
  };

  // Update handleSearch to reset currentRecordIndex
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if at least one search field has a value
    const hasSearchTerms = Object.values(searchParams).some(value => value.trim() !== '');
    
    if (!hasSearchTerms) {
      setError('Please enter at least one search term');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentRecordIndex(0); // Reset index when performing new search

    try {
      console.log('Initiating certificate search with params:', searchParams);
      
      // Only include non-empty params
      const filteredParams = Object.entries(searchParams).reduce((acc, [key, value]) => {
        if (value && value.trim() !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      const response = await searchCertificates({
        ...filteredParams,
        page: 1,
        limit: 10
      });

      console.log('Search response received:', response);
      
      setSearchResults(response.certificates);
      if (response.certificates.length > 0) {
        setSelectedCertificate(response.certificates[0]);
        setShowForm(true);
      } else {
        setSelectedCertificate(null);
        setShowForm(false);
        setError('No certificates found matching your search criteria.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search certificates');
      setSelectedCertificate(null);
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required website field
    if (!formData.website.trim()) {
      setError('Website is required');
      return;
    }

    // Check if we have a certificate to update
    if (!selectedCertificate?._id) {
      setError('No certificate selected for update');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await updateCertificate(selectedCertificate._id, {
        website: formData.website.trim(),
        responsiblePerson: formData.responsiblePerson.trim(),
        alertDate: formData.renewalDueDate.toISOString(),  // Changed to use alertDate
        comments: formData.comments.trim()
      });

      // Show success message
      setError('Certificate updated successfully');
    } catch (err) {
      console.error('Update failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to update certificate');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleDateChange = (field: string) => (date: Date | null) => {
    if (date) {
      setFormData({ ...formData, [field]: date });
    }
  };

  useEffect(() => {
    if (selectedCertificate) {
      try {
        const newFormData: FormData = {
          // Convert nullable fields to empty strings or default dates
          name: selectedCertificate.name || '',
          issuer: selectedCertificate.issuer || '',
          validFrom: selectedCertificate.validFrom ? safeParseDate(selectedCertificate.validFrom) : new Date(),
          validTo: selectedCertificate.validTo ? safeParseDate(selectedCertificate.validTo) : new Date(),
          serialNumber: selectedCertificate.serialNumber || '',
          subject: selectedCertificate.subject || '',
          organization: selectedCertificate.organization || '',
          organizationalUnit: selectedCertificate.organizationalUnit || '',
          website: selectedCertificate.certManager?.website || '',
          responsiblePerson: selectedCertificate.certManager?.responsiblePerson || '',
          renewalDueDate: selectedCertificate.certManager?.alertDate ? 
            safeParseDate(selectedCertificate.certManager.alertDate) : 
            new Date(),  // Using alertDate directly
          comments: selectedCertificate.certManager?.comments || '',
          lastUpdated: new Date()
        };
        
        setFormData(newFormData);
      } catch (error) {
        console.error('Error setting form data:', error);
        setError('Error loading certificate details');
      }
    } else {
      // Reset form with default values
      setFormData({
        name: '',
        issuer: '',
        validFrom: new Date(),
        validTo: new Date(),
        serialNumber: '',
        subject: '',
        organization: '',
        organizationalUnit: '',
        website: '',
        responsiblePerson: '',
        renewalDueDate: new Date(),
        comments: '',
        lastUpdated: new Date()
      });
    }
  }, [selectedCertificate]);

  // Add click handler for search results
  const handleCertificateSelect = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowForm(true);
  };

  const renderCertificateFields = (certificate: Certificate) => {
    // Reset all fields explicitly
    const fields: CertificateField[] = [
      { label: 'Name', value: certificate.name || '', type: 'text' },
      { label: 'Issuer', value: certificate.issuer || '', type: 'text' },
      { label: 'Valid From', value: certificate.validFrom || null, type: 'date' },
      { label: 'Valid To', value: certificate.validTo || null, type: 'date' },
      { label: 'Serial Number', value: certificate.serialNumber || '', type: 'text' },
      { label: 'Subject', value: certificate.subject || '', type: 'text' },
      { label: 'Organization', value: certificate.organization || '', type: 'text' },
      { label: 'Organizational Unit', value: certificate.organizationalUnit || '', type: 'text' },
      { label: 'Last Queried', value: certificate.certLastQueried || null, type: 'date' }
    ];

    // Add metadata fields if they exist
    if (certificate.metadata) {
      fields.push(
        { label: 'Country', value: certificate.metadata.country || '', type: 'text' },
        { label: 'State', value: certificate.metadata.state || '', type: 'text' },
        { label: 'Locality', value: certificate.metadata.locality || '', type: 'text' },
        { label: 'Fingerprint', value: certificate.metadata.fingerprint || '', type: 'text' },
        { label: 'Bits', value: certificate.metadata.bits || null, type: 'number' }
      );
    }

    return (
      <Box 
        key={`cert-fields-${certificate._id || certificate.id}`} 
        sx={{ 
          width: '100%',
          p: 0.25,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25  // Increased from 1 to 2 (equivalent to 16px)
        }}
      >
        {fields.map((field, index) => (
          <Box 
            key={`${field.label}-${index}`}
            sx={{ 
              minHeight: '32px',  // Standardize height for all fields
              width: '100%'
            }}
          >
            {field.type === 'date' ? (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  key={`${field.label}-${certificate._id || certificate.id}`}
                  label={field.label}
                  value={field.value ? safeParseDate(field.value as string) : null}
                  disabled
                  onChange={() => {}}
                  renderInput={(params: TextFieldProps) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      disabled 
                      variant="outlined"
                      size="small"
                      sx={{ 
                        height: '32px',  // Match text field height
                        backgroundColor: '#f5f5f5',
                        '& .MuiOutlinedInput-root': {
                          height: '32px',
                          backgroundColor: '#f5f5f5'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '0.8rem',
                          lineHeight: '1',
                          '&.Mui-focused, &.MuiFormLabel-filled': {
                            transform: 'translate(14px, -9px) scale(0.75)'
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          fontSize: '0.8rem',
                          padding: '6px 8px',
                          height: '18px'  // Adjust input height
                        }
                      }}
                    />
                  )}
                  inputFormat="MM/dd/yyyy"
                  ampm={false}
                  views={['year', 'month', 'day']}
                />
              </LocalizationProvider>
            ) : (
              <TextField
                key={`${field.label}-${certificate._id || certificate.id}`}
                fullWidth
                label={field.label}
                value={field.value || ''}
                disabled
                type={field.type}
                variant="outlined"
                size="small"
                sx={{ 
                  height: '32px',  // Fixed height
                  backgroundColor: '#f5f5f5',
                  '& .MuiOutlinedInput-root': {
                    height: '32px',
                    backgroundColor: '#f5f5f5'
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.8rem',
                    lineHeight: '1',
                    '&.Mui-focused, &.MuiFormLabel-filled': {
                      transform: 'translate(14px, -9px) scale(0.75)'
                    }
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: '0.8rem',
                    padding: '6px 8px'
                  }
                }}
              />
            )}
          </Box>
        ))}
        
        {/* Alternative Names section */}
        {certificate.metadata?.alternativeNames && 
         certificate.metadata.alternativeNames.length > 0 && (
          <Box 
            key={`alt-names-${certificate._id || certificate.id}`}
            sx={{ mt: 0.5, mb: 0.75 }}  // Reduced margins
          >
            <TextField
              fullWidth
              label="Alternative Names"
              value={certificate.metadata.alternativeNames.join(', ')}
              disabled
              multiline
              size="small"
              rows={2}  // Reduced rows
              variant="outlined"
              sx={{ 
                backgroundColor: '#f5f5f5',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5'
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.8rem'  // Smaller font for label
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: '0.8rem',  // Smaller font for input
                  py: 0.75  // Reduced vertical padding
                }
              }}
            />
          </Box>
        )}
      </Box>
    );
  };

  const CertificateDetailsSection = ({ selectedCertificate }: { selectedCertificate: Certificate | null }) => (
    <Grid item xs={12} md={6}>
      <Paper 
        sx={{ 
          p: 2,
          mr: 8,
          overflow: 'auto',
          maxHeight: 'calc(100vh - 200px)',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white'
        }}
      >
        <Typography 
          variant="h5"
          gutterBottom 
          sx={{ 
            mb: 2,
            fontSize: '1.2rem'
          }}
        >
          Certificate Details
        </Typography>
        <Box 
          sx={{
            overflowY: 'auto',
            flex: 1,
            '& .MuiTextField-root': {
              display: 'block',
              width: '100%'
            }
          }}
        >
          {selectedCertificate && renderCertificateFields(selectedCertificate)}
        </Box>
      </Paper>
    </Grid>
  );

  const handleRenewCertificate = async () => {
    setRenewDialogOpen(true);
  };

  const handleCloseRenewDialog = () => {
    setRenewDialogOpen(false);
  };

  const handlePullCertData = async () => {
    const certificateId = selectedCertificate?._id || selectedCertificate?.id;
  
    if (!certificateId) {
      setError('No certificate ID found');
      return;
    }
  
    if (!formData.website) {
      setError('Website is required to pull certificate data');
      return;
    }
  
    setIsPullingCert(true);
    setError(null);
  
    try {
      const updatedCert = await refreshCertificate(certificateId, formData.website);
      
      // Update the selected certificate and search results with new data
      setSelectedCertificate(updatedCert);
      setSearchResults(prevResults => 
        prevResults.map(cert => 
          (cert._id || cert.id) === certificateId ? updatedCert : cert
        )
      );
      
      setError('Certificate data refreshed successfully');
    } catch (err) {
      console.error('Certificate refresh failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh certificate data');
    } finally {
      setIsPullingCert(false);
    }
  };

  const handleDeleteCertificate = () => {
    console.log('Opening delete dialog for certificate:', {
      id: selectedCertificate?.id,
      name: selectedCertificate?.name
    });
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    console.log('Selected certificate:', selectedCertificate); // Debug log

    // Check for both _id and id
    const certificateId = selectedCertificate?._id || selectedCertificate?.id;

    if (!certificateId) {
      console.error('No certificate ID found:', {
        _id: selectedCertificate?._id,
        id: selectedCertificate?.id,
        certificate: selectedCertificate
      });
      setError('No certificate ID found for deletion');
      setDeleteDialogOpen(false);
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      console.log('Initiating delete for certificate:', {
        id: certificateId,
        name: selectedCertificate.name
      });
      
      await deleteCertificate(certificateId);
      
      // Remove the deleted certificate from the search results
      setSearchResults(prevResults => 
        prevResults.filter(cert => (cert._id || cert.id) !== certificateId)
      );
      
      // Reset UI state
      setDeleteDialogOpen(false);
      setShowForm(false);
      setSelectedCertificate(null);
      
      // Show success message
      setError('Certificate successfully deleted');
    } catch (err) {
      console.error('Delete failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete certificate');
      setDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box sx={{ ml: -25, mt: 0 }}>  {/* Reduced top margin from 2 to 0 */}
      <Paper sx={{ 
        p: 2,  // Reduced padding from 3 to 2
        mb: 1,  // Reduced bottom margin from 2 to 1
        mr: 8 
      }}>
        <Typography variant="h4" sx={{ mb: 1 }}>  {/* Added margin bottom */}
          Find Certificate
        </Typography>
        <form onSubmit={handleSearch}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Certificate Name"
                value={searchParams.name}
                onChange={handleSearchChange('name')}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Website"
                value={searchParams.website}
                onChange={handleSearchChange('website')}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Responsible Party"
                value={searchParams.responsiblePerson}
                onChange={handleSearchChange('responsiblePerson')}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Organization"
                value={searchParams.organization}
                onChange={handleSearchChange('organization')}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>  {/* Reduced margin */}
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>  {/* Reduced margin */}
          {error}
        </Alert>
      )}

      {searchResults.length > 0 && !showForm && (
        <Paper sx={{ p: 4, mb: 4, mr: 8 }}>  {/* Increased right margin from 4 to 8 */}
          <Typography variant="h6" gutterBottom>
            Search Results
          </Typography>
          <Grid container spacing={2}>
            {searchResults.map((cert) => (
              <Grid item xs={12} key={cert.id}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleCertificateSelect(cert)}
                >
                  {cert.name || 'Unnamed'} - {cert.organization || 'No Organization'}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {showForm && (
        <>
          {/* Add Record Navigation */}
          {searchResults.length > 1 && (
            <Paper sx={{ 
              p: 0.5,  // Reduced padding from 1 to 0.5
              mb: 1,   // Reduced margin from 2 to 1
              mr: 8,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '40px'  // Reduced height from 48px to 40px
            }}>
              <IconButton 
                onClick={handlePreviousRecord}
                disabled={currentRecordIndex === 0}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <Typography sx={{ mx: 2 }}>
                Record {currentRecordIndex + 1} of {searchResults.length}
              </Typography>
              <IconButton 
                onClick={handleNextRecord}
                disabled={currentRecordIndex === searchResults.length - 1}
              >
                <NavigateNextIcon />
              </IconButton>
            </Paper>
          )}

          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                display: 'flex',
                flexDirection: 'column',
                height: '700px', // Increased from 600px
                position: 'relative',
                backgroundColor: 'white'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  p: 1.5,
                  backgroundColor: 'white',
                  zIndex: 1,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                }}>
                  <Typography 
                    variant="h5"
                    sx={{ 
                      fontSize: '1.1rem',
                      fontWeight: 500
                    }}
                  >
                    Certificate Management
                  </Typography>
                </Box>

                <Box sx={{
                  position: 'absolute',
                  top: 48,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  overflowY: 'auto',
                  p: 1.5,
                  pt: 1
                }}>
                  <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>  {/* Added top margin */}
                    <Grid container spacing={2}>  {/* Increased spacing */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          required
                          label="Website"
                          value={formData.website}
                          onChange={handleChange('website')}
                          size="small"  // Made input field smaller
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
                              disabled={isSaving}
                              startIcon={isSaving ? <CircularProgress size={20} /> : null}
                            >
                              {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
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
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              onClick={handleRenewCertificate}
                            >
                              Renew Certificate
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              fullWidth
                              onClick={handleDeleteCertificate}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </form>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                display: 'flex',
                flexDirection: 'column',
                height: '700px', // Increased from 600px
                position: 'relative',
                backgroundColor: 'white',
                mr: 8
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  p: 1.5,
                  backgroundColor: 'white',
                  zIndex: 1,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                }}>
                  <Typography 
                    variant="h5"
                    sx={{ 
                      fontSize: '1.1rem',
                      fontWeight: 500
                    }}
                  >
                    Certificate Details
                  </Typography>
                </Box>

                <Box sx={{
                  position: 'absolute',
                  top: 48,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  overflowY: 'auto',
                  p: 1.5,
                  pt: 1
                }}>
                  {selectedCertificate && renderCertificateFields(selectedCertificate)}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      <Dialog open={renewDialogOpen} onClose={handleCloseRenewDialog}>
        <DialogTitle>Certificate Renewal</DialogTitle>
        <DialogContent>
          <Typography>Coming Soon!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRenewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this certificate record?
            {selectedCertificate?.name && (
              <Box component="span" sx={{ fontWeight: 'bold', display: 'block', mt: 1 }}>
                {selectedCertificate.name}
              </Box>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDeleteDialog}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
