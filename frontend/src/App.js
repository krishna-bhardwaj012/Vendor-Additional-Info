import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VendorInfoTable from './components/VendorInfoTable';
import { Container, Typography, TextField, MenuItem, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function App() {
  const [vendorData, setVendorData] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [vendorId, setVendorId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorSearch, setVendorSearch] = useState('');

  // Fetch vendor IDs from backend based on vendorSearch (autocomplete)
  useEffect(() => {
    if (vendorSearch.length > 0) {
      axios
        .get(`http://localhost:5000/api/vendors/search?q=${vendorSearch}`)
        .then((response) => {
          setVendorOptions(response.data);
        })
        .catch((error) =>
          console.error('Error fetching vendor IDs:', error)
        );
    } else {
      setVendorOptions([]);
    }
  }, [vendorSearch]);

  // Fetch vendor data when vendorId changes
  useEffect(() => {
    if (vendorId) {
      axios
        .get(`http://localhost:5000/api/vendor/${vendorId}`)
        .then((response) => setVendorData(response.data))
        .catch((error) =>
          console.error('Error fetching vendor info:', error)
        );
    }
  }, [vendorId]);

  // Search filter for table
  const filteredData = vendorData.filter((row) =>
    Object.values(row).some((val) =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Function to refresh vendor data after add/update/delete
  const refreshData = (id) => {
    axios
      .get(`http://localhost:5000/api/vendor/${id}`)
      .then((res) => setVendorData(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Vendor Additional Info
      </Typography>

      {/* 🔹 Button to go to Vendor Book Server */}
      <Box sx={{ marginBottom: 3 }}>
        <Link to="/vendor-book" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">
            Vendor Book Server
          </Button>
        </Link>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
        <TextField
          label="Search Vendor ID..."
          variant="outlined"
          value={vendorSearch}
          onChange={(e) => setVendorSearch(e.target.value)}
          sx={{ minWidth: 200 }}
        />

        <TextField
          select
          label="Select Vendor ID"
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {vendorOptions.map((id) => (
            <MenuItem key={id} value={id}>
              {id}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Filter Table..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
        />
      </Box>

      <VendorInfoTable
        data={filteredData}
        vendorId={vendorId}
        refreshData={refreshData}
      />
    </Container>
  );
}

export default App;
