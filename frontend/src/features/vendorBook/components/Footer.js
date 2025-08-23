/* eslint-disable jsx-a11y/anchor-is-valid */
// frontend/src/features/vendorBook/components/Footer.js

import React from "react";
import "../style/Footer.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer({
  brand = "Vendor Book",
  year = new Date().getFullYear(),
  links = {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#",
  },
}) {
  return (
    <footer className="footer">
      <div className="footer-line">
        <div className="footer-brand">{brand}</div>

        <div className="footer-bottom">© {year} MyPlatform. All rights reserved.</div>

        <div className="footer-socials">
          <a href={links.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
            <FaFacebook />
          </a>
          <a href={links.twitter} target="_blank" rel="noreferrer" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href={links.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}
