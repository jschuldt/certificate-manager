import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import { searchCertificates, Certificate, CertificateSearchParams } from '../../../services/api/certificate';

const searchFields = [
  { value: 'name', label: 'Certificate Name' },
  { value: 'website', label: 'Website' },
  { value: 'responsiblePerson', label: 'Responsible Party' },
  { value: 'organization', label: 'Organization' },
  { value: 'issuer', label: 'Issuer' },
];

export const QueryCert: React.FC = () => {
  const [searchField, setSearchField] = useState('name');
  const [searchValue, setSearchValue] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const searchParams: CertificateSearchParams = {
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
      };

      // Add search field if there's a search value
      if (searchValue && searchField) {
        searchParams[searchField as keyof Pick<CertificateSearchParams, 'name' | 'issuer' | 'website' | 'organization' | 'responsiblePerson'>] = searchValue;
      }

      const response = await searchCertificates(searchParams);
      setCertificates(response.certificates);
      setTotalRecords(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }, [searchField, searchValue, page, rowsPerPage]);

  const handleChangePage = async (event: unknown, newPage: number) => {
    setPage(newPage);
    // Trigger new search with updated page
    await handleSearch();
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    // Trigger new search with updated rows per page
    await handleSearch();
  };

  const handleExportToExcel = () => {
    // TODO: Implement export functionality
    console.log('Exporting to Excel...');
  };

  return (
    <Box sx={{ ml: -25, mt: 2 }}>
      <Paper sx={{ p: 3, mb: 2, mr: 8 }}>
        <Typography variant="h4" gutterBottom>
          Query Certificate
        </Typography>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Search By"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
              >
                {searchFields.map((field) => (
                  <MenuItem key={field.value} value={field.value}>
                    {field.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Search Value"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Search'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2, mr: 8 }}>
          {error}
        </Alert>
      )}

      {certificates.length > 0 && (
        <Paper sx={{ p: 3, mb: 2, mr: 8 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2 
          }}>
            <Typography variant="body2">
              Total Records: {totalRecords}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="medium"
              onClick={handleExportToExcel}
              startIcon={<GetAppIcon />}
            >
              Export to Excel
            </Button>
          </Box>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Certificate Name</TableCell>
                  <TableCell>Website</TableCell>
                  <TableCell>Person Responsible</TableCell>
                  <TableCell>Valid From</TableCell>
                  <TableCell>Valid To</TableCell>
                  <TableCell>Issuer</TableCell>
                  <TableCell>Organization</TableCell>
                  <TableCell>Comments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certificates.map((cert) => (
                  <TableRow hover key={cert._id}>
                    <TableCell>{cert.name}</TableCell>
                    <TableCell>{cert.certManager.website}</TableCell>
                    <TableCell>{cert.certManager.responsiblePerson}</TableCell>
                    <TableCell>{new Date(cert.validFrom || '').toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(cert.validTo || '').toLocaleDateString()}</TableCell>
                    <TableCell>{cert.issuer}</TableCell>
                    <TableCell>{cert.organization}</TableCell>
                    <TableCell>{cert.certManager.comments}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={totalRecords}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[20, 50, 100]}
            sx={{ mt: 2 }}
          />
        </Paper>
      )}
    </Box>
  );
};
