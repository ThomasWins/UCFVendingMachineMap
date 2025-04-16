import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/navBar.css';

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/secret">GerberTheGoat</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/home">Home</Link></li>
        <li><a href="#aboutContainer">About</a></li>
        <li id ="machine"><Link to="/vendingrequest">Add Machine</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
