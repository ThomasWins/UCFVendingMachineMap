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
        <li><Link to="/">Home</Link></li> {/* Changed from anchor to Link */}
        <li><a href="/#aboutContainer">About</a></li> {/* Changed to root path with hash */}

        {isLoggedIn ? (
          <>
            <li id="machine"><Link to="/map" state={{ openPopup: true }}>Add Machine</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li className="separator">|</li>
            <li><Link to="/logout">Logout</Link></li>
          </>
        ) : (
          <>
            <li id="machine"><Link to="/login">Add Machine</Link></li> {/* Changed to /login */}
            <li><Link to="/login">Login</Link></li> {/* Changed to /login */}
            <li className="separator">|</li>
            <li id="last"><Link to="/createAccount">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
