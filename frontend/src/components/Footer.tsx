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
            <li><a href="#team">Meet the Team</a></li>
            <li><Link to="/map" state={{ openPopup: true}}>Add a Machine</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: FakeEmail@vending.com</p>
        </div>

        <div className="footer-section social-icons">
          <h4>Follow Us</h4>
          <a href="https://www.x.com" target="_blank" rel="noopener noreferrer">
            <img src={twitterLogo}
              alt="Twitter"
              style={{ width: '24px', height: '24px' }} />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src={instagramLogo}
              alt="Instagram"
              style={{ width: '24px', height: '24px' }} />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src={facebookLogo}
              alt="Facebook"
              style={{ width: '24px', height: '24px' }} />
          </a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} UCF Vending Locator. All rights reserved.    Disclaimer: We are not at all affiliated with UCF</p>
      </div>
    </footer>
  );
};

export default Footer;
