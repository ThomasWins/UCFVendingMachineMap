import React, { JSX } from 'react';
import styles from '../components/CSS/ProfilePage.module.css';
import profilePic from '../assets/profilepictureicon.jpg';
import NavBar from '../components/NavBar.tsx';

function ProfilePage(): JSX.Element {
  return (
    <div className={styles.container}>
        <NavBar />
      <div className={styles.leftPanel}>
        <img src={profilePic} alt="Profile" className={styles.profileImage} />
      </div>
      <div className={styles.rightPanel}>
        <h2>PROFILE MANAGER</h2>
        <ul className={styles.menu}>
          <li>Favorites</li>
          <li>Contributions</li>
        </ul>
      </div>
    </div>
  );
}

export default ProfilePage;

