import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-links">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms & Conditions</Link>
      </div>
      <p>© 2025 Book in Hand Campaign. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
