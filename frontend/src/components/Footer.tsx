import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/footer.css';

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
          <p>Email: contact@ucfvending.com</p>
        </div>

        <div className="footer-section social-icons">
          <h4>Follow Us</h4>
          <a href="#"><i className="fab fa-twitter" /></a>
          <a href="#"><i className="fab fa-instagram" /></a>
          <a href="#"><i className="fab fa-facebook" /></a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} UCF Vending Locator. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
