import React, { useEffect, useState } from "react";
import axios from "axios";
import VendorInfoTable from "./components/VendorInfoTable";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Box,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function App() {
  const [vendorData, setVendorData] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");

  // autocomplete vendor IDs
  useEffect(() => {
    if (vendorSearch.length > 0) {
      axios
        .get(`http://localhost:5000/api/vendors/search?q=${vendorSearch}`)
        .then((res) => setVendorOptions(res.data))
        .catch((err) => console.error("Error fetching vendor IDs:", err));
    } else {
      setVendorOptions([]);
    }
  }, [vendorSearch]);

  // load vendor rows
  useEffect(() => {
    if (vendorId) {
      axios
        .get(`http://localhost:5000/api/vendor/${vendorId}`)
        .then((res) => setVendorData(res.data))
        .catch((err) => console.error("Error fetching vendor info:", err));
    }
  }, [vendorId]);

  const filteredData = vendorData.filter((row) =>
    Object.values(row).some((v) =>
      v?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const refreshData = (id) => {
    axios
      .get(`http://localhost:5000/api/vendor/${id}`)
      .then((res) => setVendorData(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4 }}>
      {/* HEADER ROW: title left, button right */}
      <Box
        sx={{
          mb: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Vendor Additional Info
        </Typography>

        <Button
          component={RouterLink}
          to="/vendor-book"
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: 12,
            px: 2.5,
            py: 1,
            fontWeight: 600,
            background:
              "linear-gradient(90deg, rgba(91,110,225,1) 0%, rgba(138,91,220,1) 100%)",
            boxShadow: "0 6px 14px rgba(0,0,0,.2)",
            "&:hover": {
              background:
                "linear-gradient(90deg, rgba(81,100,215,1) 0%, rgba(128,81,210,1) 100%)",
            },
          }}
        >
          Vendor Book Server
        </Button>
      </Box>

      {/* FILTERS */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Search Vendor ID..."
          variant="outlined"
          value={vendorSearch}
          onChange={(e) => setVendorSearch(e.target.value)}
          sx={{ minWidth: 220 }}
        />

        <TextField
        
          select
          label="Select Vendor ID"
          variant="outlined"
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          sx={{ flex: 1 }}
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

      {/* TABLE */}
      <VendorInfoTable
        data={filteredData}
        vendorId={vendorId}
        refreshData={refreshData}
      />
    </Container>
  );
}

export default App;
