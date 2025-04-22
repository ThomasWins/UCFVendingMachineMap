
import React, { useState } from 'react';
import { JSX } from 'react';
import styles from '../components/CSS/ProfilePage.module.css';
import profilePic from '../assets/profilepictureicon.jpg';
import NavBar from '../components/NavBar.tsx';
import Contributions from '../components/Contributions';

function ProfilePage(): JSX.Element {
  const [view, setView] = useState<'favorites' | 'contributions' | null>(null);
  const userId = 1; // testing, gotta make this dynamic 

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.leftPanel}>
        <img src={profilePic} alt="Profile" className={styles.profileImage} />
      </div>
      <div className={styles.rightPanel}>
        <h2>PROFILE MANAGER</h2>
        <ul className={styles.menu}>
          <li onClick={() => setView('favorites')}>Favorites</li>
          <li onClick={() => setView('contributions')}>Contributions</li>
        </ul>

        <div className={styles.content}>
          {view === 'contributions' && <Contributions userId={userId} />}
          {view === 'favorites' && <p>Favorites view coming soon!</p>}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

