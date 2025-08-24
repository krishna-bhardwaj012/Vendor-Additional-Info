import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import VendorBook from "./components/VendorBook"; // <-- IMPORT THIS

export default function VendorBookApp() {
  return (
    <div className="vendorbook-page">
      <div className="vb-container">
        <div className="vb-top">
          <Link to="/" className="vb-back">← Back to App</Link>
        </div>

        <div className="vb-content">
          <Routes>
            <Route
              index
              element={
                <div className="vb-content-inner">
                  <VendorBook />   {/* <-- RENDER IT HERE */}
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
