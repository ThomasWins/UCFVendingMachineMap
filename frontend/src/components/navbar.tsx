import React from 'react';
import { useNavigate } from 'react-router-dom';

const navbar = () => {
  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem('user_data');
  navigate('/login');
};



  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>MyApp</div>
      <ul style={styles.navList}>
        <li onClick={() => navigate('/map')} style={styles.navItem}>View Map</li>
        <li onClick={() => navigate('/account')} style={styles.navItem}>View Account</li> 
        <li onClick={handleLogout} style={styles.navItem}>Logout</li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: '1rem',
    color: 'white',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  navList: {
    display: 'flex',
    gap: '1.5rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    cursor: 'pointer',
  },
  navItem: {
    transition: '0.3s',
  },
};

export default NavBar;
