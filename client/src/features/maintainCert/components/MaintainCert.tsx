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
import { searchCertificates, type Certificate, type SearchResponse } from '../../../services/api/certificate';
import { parseISO, format } from 'date-fns';
import { format as formatTz, utcToZonedTime } from 'date-fns-tz'; // Add date-fns-tz import
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

interface CertificateField {
  label: string;
  value: string | number | null;
  type: 'text' | 'date' | 'number';
}

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
  const [formData, setFormData] = useState({
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
      setSelectedCertificate(searchResults[currentRecordIndex + 1]);
    }
  };

  const handlePreviousRecord = () => {
    if (currentRecordIndex > 0) {
      setCurrentRecordIndex(currentRecordIndex - 1);
      setSelectedCertificate(searchResults[currentRecordIndex - 1]);
    }
  };

  // Update handleSearch to reset currentRecordIndex
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
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

  useEffect(() => {
    if (selectedCertificate) {
      try {
        setFormData({
          // Keep existing certificate details mapping
          name: selectedCertificate.name || '',
          issuer: selectedCertificate.issuer || '',
          validFrom: safeParseDate(selectedCertificate.validFrom),
          validTo: safeParseDate(selectedCertificate.validTo),
          serialNumber: selectedCertificate.serialNumber || '',
          subject: selectedCertificate.subject || '',
          organization: selectedCertificate.organization || '',
          organizationalUnit: selectedCertificate.organizationalUnit || '',
          
          // Fix the mapping for the certManager fields
          website: selectedCertificate.certManager?.website || '',
          responsiblePerson: selectedCertificate.certManager?.responsiblePerson || '', // Changed from personResponsible to responsiblePerson
          renewalDueDate: safeParseDate(selectedCertificate.certManager?.renewalDate),
          comments: selectedCertificate.certManager?.comments || '',
          // Remove lastUpdated as it's not in the Certificate interface
          lastUpdated: new Date(), // Use current date or remove if not needed
        });
      } catch (error) {
        console.error('Error setting form data:', error);
        setError('Error loading certificate details');
      }
    }
  }, [selectedCertificate]);

  // Add click handler for search results
  const handleCertificateSelect = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowForm(true);
  };

  const renderCertificateFields = (certificate: Certificate) => {
    // Update fields array to make sure we capture all possible fields
    const fields: CertificateField[] = [
      { label: 'Name', value: certificate.name, type: 'text' },
      { label: 'Issuer', value: certificate.issuer, type: 'text' },
      { label: 'Valid From', value: certificate.validFrom, type: 'date' },
      { label: 'Valid To', value: certificate.validTo, type: 'date' },
      { label: 'Serial Number', value: certificate.serialNumber, type: 'text' },
      { label: 'Subject', value: certificate.subject, type: 'text' },
      { label: 'Organization', value: certificate.organization, type: 'text' },
      { label: 'Organizational Unit', value: certificate.organizationalUnit, type: 'text' },
      { label: 'Last Queried', value: certificate.certLastQueried, type: 'date' }
    ];

    // Add metadata fields if they exist
    if (certificate.metadata) {
      fields.push(
        { label: 'Country', value: certificate.metadata.country, type: 'text' },
        { label: 'State', value: certificate.metadata.state, type: 'text' },
        { label: 'Locality', value: certificate.metadata.locality, type: 'text' },
        { label: 'Fingerprint', value: certificate.metadata.fingerprint, type: 'text' },
        { label: 'Bits', value: certificate.metadata.bits, type: 'number' }
      );
    }

    return (
      <Box sx={{ width: '100%', p: 0.5 }}>
        {fields.filter(field => field.value !== null && field.value !== '').map((field, index) => (
          <Box key={index} sx={{ mb: 1.5 }}>
            {field.type === 'date' ? (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label={field.label}
                  value={safeParseDate(field.value as string)}
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
                        backgroundColor: '#f5f5f5',
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#f5f5f5'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '0.875rem'
                        },
                        '& .MuiOutlinedInput-input': {
                          fontSize: '0.875rem'
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
                fullWidth
                label={field.label}
                value={field.value}
                disabled
                type={field.type}
                variant="outlined"
                size="small"
                sx={{ 
                  backgroundColor: '#f5f5f5',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f5f5f5'
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem'
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: '0.875rem'
                  }
                }}
              />
            )}
          </Box>
        ))}
        
        {certificate.metadata?.alternativeNames && 
         certificate.metadata.alternativeNames.length > 0 && (
          <Box sx={{ mt: 1, mb: 1.5 }}>
            <TextField
              fullWidth
              label="Alternative Names"
              value={certificate.metadata.alternativeNames.join(', ')}
              disabled
              multiline
              size="small"
              rows={Math.min(3, certificate.metadata.alternativeNames.length)}
              variant="outlined"
              sx={{ 
                backgroundColor: '#f5f5f5',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5'
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.875rem'
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: '0.875rem'
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

  const handlePullCertData = async () => {
    // TODO: Implement pull certificate data
    console.log('Pulling certificate data:', selectedCertificate?.id);
  };

  const handleDeleteCertificate = async () => {
    // TODO: Implement certificate deletion
    console.log('Deleting certificate:', selectedCertificate?.id);
  };

  const handleCloseRenewDialog = () => {
    setRenewDialogOpen(false);
  };

  return (
    <Box sx={{ ml: -25, mt: 2 }}>  {/* Reduced top margin */}
      <Paper sx={{ p: 3, mb: 2, mr: 8 }}>  {/* Increased right margin from 4 to 8 */}
        <Typography variant="h4" gutterBottom>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>  {/* Reduced margin */}
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>  {/* Reduced margin */}
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
              p: 1,  // Reduced padding
              mb: 2, 
              mr: 8,  // Increased right margin from 4 to 8
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '48px'  // Fixed height for consistency
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

          <Grid container spacing={2}>  {/* Reduced grid spacing */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: 2,  // Reduced padding
                height: 'calc(100vh - 280px)',  // Adjusted height to prevent scrolling
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Typography 
                  variant="h5"
                  gutterBottom 
                  sx={{ 
                    mb: 2,
                    fontSize: '1.2rem'
                  }}
                >
                  Certificate Management
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>  {/* Reduced spacing */}
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
                            Save Changes
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handlePullCertData}
                          >
                            Pull Cert Data
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
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: 2,
                mr: 8,  // Increased right margin from 4 to 8
                height: 'calc(100vh - 280px)',  // Match height with management section
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white'
              }}>
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
    </Box>
  );
};
