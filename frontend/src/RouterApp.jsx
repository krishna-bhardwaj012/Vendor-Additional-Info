// frontend/src/RouterApp.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import VendorBookApp from "./features/vendorBook/VendorBookApp"; // ✅ sahi file

export default function RouterApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/vendor-book/*" element={<VendorBookApp />} />
      </Routes>
    </BrowserRouter>
  );
}
