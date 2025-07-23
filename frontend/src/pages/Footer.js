import React from "react";
import { FaLinkedin, FaGithub, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-section">
            <h3 className="footer-heading">JobMatch Portal</h3>
            <p className="footer-text">Empowering careers through technology and opportunity. Start your job journey with us today!</p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-subheading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/jobs">Jobs</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/faq">FAQs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-subheading">Contact Us</h4>
            <p><FaPhoneAlt /> +91 98765 43210</p>
            <p><FaEnvelope /> support@jobmatch.com</p>
            <p><FaMapMarkerAlt /> Lovely Professional University, Punjab, India</p>
          </div>

          {/* Social Media */}
          <div className="footer-section">
            <h4 className="footer-subheading">Follow Us</h4>
            <div className="social-icons">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="icon" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FaGithub className="icon" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="icon" />
              </a>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />
        <p className="footer-bottom-text">© {new Date().getFullYear()} JobMatch Portal. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
