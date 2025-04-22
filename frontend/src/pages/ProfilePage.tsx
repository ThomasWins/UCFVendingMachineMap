import React, { JSX } from 'react';
import styles from '../components/CSS/ProfilePage.module.css';
import profilePic from '../assets/profilepictureicon.jpg';
import { useNavigate } from 'react-router-dom';

import NavBar from '../components/NavBar.tsx';

function ProfilePage(): JSX.Element {

  const navigate = useNavigate(); 
  let isLoggedIn = false;

  useEffect(() => {
    const _ud = localStorage.getItem('user_data');
    try {
      const userData = _ud ? JSON.parse(_ud) : null;
      if (userData && userData.userId) {
        isLoggedIn = true;
      }
      else {
        navigate('/');
      }
    } catch (e) {
      console.error('Error parsing user_data:', e);
      navigate('/');
    }

  
  return (
    <div className={styles.container}>
        <NavBar />
      <div className={styles.leftPanel}>
        <img src={profilePic} alt="Profile" className={styles.profileImage} />
      </div>
      <div className={styles.rightPanel}>
        <h2>PROFILE MANAGER</h2>
        <p>Hello {user_data.firstName} {user_data.lastName}</p>
        <ul className={styles.menu}>
          <li>Favorites</li>
          <li>Contributions</li>
        </ul>
      </div>
    </div>
  );
}

export default ProfilePage;

