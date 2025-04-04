import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h2>DocMeet</h2>
              <p>Medical appointment booking system</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h3>Company</h3>
                <ul className="footer-links-list">
                  <li><Link to='/about'>About Us</Link></li>
                  <li><Link to='/doctors'>Our Doctors</Link></li>
                  <li><Link to='/contact'>Contact Us</Link></li>
                </ul>
              </div>

              <div className="footer-section">
                <h3>Connect</h3>
                <ul>
                  <li><a href="https://x.com/i/flow/login?lang=en" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                  <li><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                  <li><a href="https://www.instagram.com/accounts/login/?hl=en" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                  <li><a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 DocMeet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
