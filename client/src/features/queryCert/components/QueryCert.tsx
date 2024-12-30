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
  TableSortLabel,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import GetAppIcon from '@mui/icons-material/GetApp';
import { searchCertificates, Certificate, CertificateSearchParams } from '../../../services/api/certificate';
import * as XLSX from 'xlsx';

// Add interface for sort
interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// Define column interface
interface Column {
  id: string;
  label: string;
  getValue: (cert: Certificate) => string | number | null;
}

// Define sortable columns
const columns: Column[] = [
  { 
    id: 'name',
    label: 'Certificate Name',
    getValue: (cert) => cert.name
  },
  { 
    id: 'website',
    label: 'Website',
    getValue: (cert) => cert.certManager.website
  },
  { 
    id: 'responsiblePerson',
    label: 'Person Responsible',
    getValue: (cert) => cert.certManager.responsiblePerson
  },
  { 
    id: 'validFrom',
    label: 'Valid From',
    getValue: (cert) => cert.validFrom
  },
  { 
    id: 'validTo',
    label: 'Valid To',
    getValue: (cert) => cert.validTo
  },
  { 
    id: 'issuer',
    label: 'Issuer',
    getValue: (cert) => cert.issuer
  },
  { 
    id: 'organization',
    label: 'Organization',
    getValue: (cert) => cert.organization
  },
  { 
    id: 'comments',
    label: 'Comments',
    getValue: (cert) => cert.certManager.comments
  }
];

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
  const [sort, setSort] = useState<SortConfig>({ field: '', direction: 'asc' });

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
    try {
      // Transform the data for Excel
      const excelData = certificates.map(cert => ({
        'Certificate Name': cert.name || '',
        'Website': cert.certManager.website || '',
        'Person Responsible': cert.certManager.responsiblePerson || '',
        'Valid From': cert.validFrom ? new Date(cert.validFrom).toLocaleDateString() : '',
        'Valid To': cert.validTo ? new Date(cert.validTo).toLocaleDateString() : '',
        'Issuer': cert.issuer || '',
        'Organization': cert.organization || '',
        'Comments': cert.certManager.comments || '',
        'Serial Number': cert.serialNumber || '',
        'Subject': cert.subject || '',
        'Organizational Unit': cert.organizationalUnit || '',
        'Last Queried': cert.certLastQueried ? new Date(cert.certLastQueried).toLocaleDateString() : '',
        'Country': cert.metadata?.country || '',
        'State': cert.metadata?.state || '',
        'Locality': cert.metadata?.locality || '',
        'Alternative Names': cert.metadata?.alternativeNames?.join(', ') || '',
        'Fingerprint': cert.metadata?.fingerprint || '',
        'Bits': cert.metadata?.bits || ''
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Certificates');

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      const fileName = `certificates_export_${date}.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export data to Excel');
    }
  };

  // Add sort handler
  const handleSort = (columnId: string) => {
    setSort(prevSort => ({
      field: columnId,
      direction: prevSort.field === columnId && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Add sort function
  const sortData = (data: Certificate[]) => {
    if (!sort.field) return data;

    return [...data].sort((a, b) => {
      const column = columns.find(col => col.id === sort.field);
      if (!column) return 0;

      const aValue = column.getValue(a) || '';
      const bValue = column.getValue(b) || '';

      if (sort.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
      }
    });
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

      {!loading && !error && searchValue && certificates.length === 0 && (
        <Alert severity="info" sx={{ mb: 2, mr: 8 }}>
          No certificates found matching your search criteria
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
              disabled={certificates.length === 0}
            >
              Export to Excel
            </Button>
          </Box>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sortDirection={sort.field === column.id ? sort.direction : false}
                    >
                      <TableSortLabel
                        active={sort.field === column.id}
                        direction={sort.field === column.id ? sort.direction : 'asc'}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                        {sort.field === column.id && (
                          <Box component="span" sx={visuallyHidden}>
                            {sort.direction === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        )}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortData(certificates).map((cert) => (
                  <TableRow hover key={cert._id}>
                    {columns.map(column => (
                      <TableCell key={`${cert._id}-${column.id}`}>
                        {column.id.includes('date')
                          ? new Date(column.getValue(cert) || '').toLocaleDateString()
                          : column.getValue(cert)}
                      </TableCell>
                    ))}
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
