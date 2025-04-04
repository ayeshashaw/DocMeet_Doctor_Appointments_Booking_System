import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { 
  Bell, 
  User, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';
import './Style.css';

function Navbar() {
  const { aToken, setAtoken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  // State for toggling dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Determine if admin or doctor is logged in
  const isAdmin = !!aToken;
  const isDoctor = !!dToken;

  // Handle click outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    if (isAdmin) {
      // Clear admin token from local storage
      localStorage.removeItem('aToken');
      // Clear admin token in context
      setAtoken(null);
    } else if (isDoctor) {
      // Clear doctor token from local storage
      localStorage.removeItem('dToken');
      // Clear doctor token in context
      setDToken(null);
    }
    
    // Close dropdown
    setIsDropdownOpen(false);
    
    // Redirect to login page
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>{isAdmin ? 'DocMeet Admin' : isDoctor ? 'DocMeet Doctor' : 'DocMeet'}</span>
      </div>
      
      <div className="navbar-right">
        {/* Notifications Icon (Optional) */}
        <button 
          className="notification-button" 
          aria-label="Notifications"
        >
          <Bell className="notification-icon" />
        </button>

        {/* User Profile Section */}
        <div 
          ref={dropdownRef}
          className="navbar-user" 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          <div className="user-info">
            <User className="user-icon" />
            <span>{isAdmin ? 'Admin' : isDoctor ? 'Doctor' : 'Guest'}</span>
            <ChevronDown 
              className={`dropdown-icon ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div 
              className="user-dropdown"
              role="menu"
            >
              <button 
                onClick={handleLogout} 
                className="logout-button"
                role="menuitem"
              >
                <LogOut className="logout-icon" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;