import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
     
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-dark">Left</span>
            <span className="logo-green">Over</span>
          </div>
          <p className="copyright-text">
            © 2026 LeftOver. Sharing love, reducing waste.
          </p>
        </div>

        <div className="footer-links">
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
