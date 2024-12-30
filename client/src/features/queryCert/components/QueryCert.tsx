import React, { useState } from 'react';
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
  Pagination,
  TablePagination,
} from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';  // Add this import

const searchFields = [
  { value: 'name', label: 'Certificate Name' },
  { value: 'website', label: 'Website' },
  { value: 'responsiblePerson', label: 'Responsible Party' },
  { value: 'organization', label: 'Organization' },
];

// Mock data
const mockCertificateData = {
  name: 'www.cnn.com',
  issuer: 'DigiCert Inc',
  validFrom: '2023-01-01',
  validTo: '2024-01-01',
  serialNumber: '123456789',
  subject: 'CN=www.cnn.com',
  organization: 'CNN',
  organizationalUnit: 'Digital',
  website: 'www.cnn.com',
  responsiblePerson: 'John Doe',
  renewalDueDate: '2023-12-01',
  comments: 'Production certificate',
  lastQueried: '2023-06-15',
  fingerprint: 'SHA256:1234567890abcdef',
  bits: 2048,
  alternativeNames: ['cnn.com', 'www.cnn.com', '*.cnn.com'],
};

export const QueryCert: React.FC = () => {
  const [searchField, setSearchField] = useState('name');
  const [searchValue, setSearchValue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
    setTotalRecords(100); // This should come from your API response
    setPage(0);
  };

  const handleExportToExcel = () => {
    // TODO: Implement export functionality
    console.log('Exporting to Excel...');
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
                >
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {showResults && (
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
                  <TableCell>Alert Notification Date</TableCell>
                  <TableCell>Valid From</TableCell>
                  <TableCell>Valid To</TableCell>
                  <TableCell>Issuer</TableCell>
                  <TableCell>Serial Number</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Fingerprint</TableCell>
                  <TableCell>Bits</TableCell>
                  <TableCell>Alternative Names</TableCell>
                  <TableCell>Comments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[mockCertificateData].slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                ).map((row, index) => (
                  <TableRow hover key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.website}</TableCell>
                    <TableCell>{row.responsiblePerson}</TableCell>
                    <TableCell>{row.renewalDueDate}</TableCell>
                    <TableCell>{row.validFrom}</TableCell>
                    <TableCell>{row.validTo}</TableCell>
                    <TableCell>{row.issuer}</TableCell>
                    <TableCell>{row.serialNumber}</TableCell>
                    <TableCell>{row.subject}</TableCell>
                    <TableCell>{row.fingerprint}</TableCell>
                    <TableCell>{row.bits}</TableCell>
                    <TableCell>{row.alternativeNames.join(', ')}</TableCell>
                    <TableCell>{row.comments}</TableCell>
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
