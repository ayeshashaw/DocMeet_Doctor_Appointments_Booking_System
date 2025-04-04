import React, { useContext, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { assets } from '../assets/assetsDoc';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { token, setToken } = useContext(AppContext);
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    setToken("");
    setShowDropdown(false);
    localStorage.removeItem("token");
    navigate("/")
  };

  // 🔹 Define the function before using it
  const handleMenuItemClick = () => {
    setShowDropdown(false); // Close dropdown
    setIsMenuOpen(false); // Close mobile menu
  };

  return (
    <div className='landing-page'>
      <header className='header'>
        <div className="header-container">
          <Link to="/" className="logo">
            <h1>DocMeet</h1>
          </Link>

          {/* Hamburger Menu Button */}
          <div 
            className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} 
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className={`nav ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? "active-link nav-link" : "nav-link")} onClick={toggleMenu}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/doctors" className={({ isActive }) => (isActive ? "active-link nav-link" : "nav-link")} onClick={toggleMenu}>
                All Doctors
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? "active-link nav-link" : "nav-link")} onClick={toggleMenu}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => (isActive ? "active-link nav-link" : "nav-link")} onClick={toggleMenu}>
                Contact
              </NavLink>
            </li>
            <li className="auth-section">
              {token ? (
                <div className="profile-dropdown">
                  <div className="profile-info" onClick={toggleDropdown} aria-expanded={showDropdown}>
                    <img src={assets.profile_pic} alt='profile' className="profile-image"/>
                    <img src={assets.dropdown_icon} alt='dropdown' className={`dropdown-icon ${showDropdown ? 'rotate' : ''}`}/>
                  </div>
                  {showDropdown && (
                    <div className="dropdown-menu">
                      <NavLink to="/my-profile" onClick={handleMenuItemClick}>My Profile</NavLink>
                      <NavLink to="/my-appointments" onClick={handleMenuItemClick}>My Appointments</NavLink>
                      <button onClick={handleLogout}>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink to="/login" className="auth-buttons">
                  Get Started
                </NavLink>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;
