import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/home" className="logo-link">
        <h2 className="logo">
          <span className="logo-job">JOB</span>
          <span className="logo-portal">PORTAL</span>
        </h2>
      </Link>
      
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/home" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/jobs" className="nav-link" onClick={() => setMenuOpen(false)}>View Jobs</Link>
        <Link to="/match-resume" className="nav-link" onClick={() => setMenuOpen(false)}>Match All Jobs</Link>
        <Link to="/online-jobs" className="nav-link" onClick={() => setMenuOpen(false)}>Match Online Jobs</Link>
        <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>My Profile</Link>
        <span className="nav-link logout-link" onClick={handleLogout}>Logout</span>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
      </div>
    </nav>
  );
};

export default Navbar;
