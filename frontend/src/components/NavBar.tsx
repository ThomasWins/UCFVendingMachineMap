import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/navBar.css';

const NavBar: React.FC = () => {
  const _ud = localStorage.getItem('user_data');
  let isLoggedIn = false;

  try {
    const userData = _ud ? JSON.parse(_ud) : null; 
    if (userData && userData.id) {
      isLoggedIn = true;
    }
  } catch (e) {
    console.error("Error parsing user_data:", e);
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/secret">GerberTheGoat</Link>
      </div>
      <ul className="navbar-links">
        <li><a href="/home#">Home</a></li>
        <li><a href="/home#aboutContainer">About</a></li>
        <li id="machine"><Link to="/map" state={{ openPopup: true }}>Add Machine</Link></li>

        {isLoggedIn ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li className="separator">|</li> {/* separator bar */}
            <li><Link to="/logout">Logout</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/">Login</Link></li>
            <li className="separator">|</li> {/* separator bar */}
            <li id="last"><Link to="/createAccount">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
