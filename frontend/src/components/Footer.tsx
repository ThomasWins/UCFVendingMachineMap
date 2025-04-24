import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/footer.css';
import instagramLogo from '../assets/instagramlogo2.png';
import facebookLogo from '../assets/facebooklogo.png';
import twitterLogo from '../assets/xlogo.jpg';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-section">
          <h4>UCF Vending Locator</h4>
          <p>Helping you find vending machines across UCF campus—fast and easy.</p>
        </div>

        <div className="footer-section">
          <h4>Links</h4>
          <ul>
            <li><a href="#aboutContainer">About</a></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/map" state={{ openPopup: true}}>Add a Machine</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: FakeEmail@vending.com</p>
        </div>

        <div className="footer-section social-icons">
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} UCF Vending Locator. All rights reserved.    Disclaimer: We are not at all affiliated with UCF</p>
      </div>
    </footer>
  );
};

export default Footer;
