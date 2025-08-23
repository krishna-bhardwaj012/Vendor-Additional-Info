import React from "react";
import { Routes, Route, Link } from "react-router-dom";

// styles
import "./style/VendorBook.css";
import "./style/Header.css";
import "./style/Footer.css";

// components
import VendorBook from "./components/VendorBook";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function VendorBookApp() {
  return (
    <div>
      <Header />

      <nav style={{ padding: 8 }}>
        <Link to="/">← Back to App</Link>
      </nav>

      <Routes>
        <Route index element={<VendorBook />} />
      </Routes>

      <Footer />
    </div>
  );
}
