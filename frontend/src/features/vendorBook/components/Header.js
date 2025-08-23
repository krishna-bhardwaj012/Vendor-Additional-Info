// frontend/src/features/vendorBook/components/Header.js
import React from "react";
import "../style/Header.css";
import { FaUserCircle } from "react-icons/fa";


const Header = ({ title = "Vendor Book", onProfileClick }) => {
  return (
    <header className="header">
      <div className="logo">{title}</div>
      <div
        className="profile"
        onClick={onProfileClick}
        style={{ cursor: onProfileClick ? "pointer" : "default" }}
        title="Profile"
      >
        <FaUserCircle size={28} />
      </div>
    </header>
  );
};

export default Header;
