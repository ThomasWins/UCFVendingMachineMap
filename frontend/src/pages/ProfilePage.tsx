import React, { useEffect, useState } from 'react';
import styles from '../components/CSS/ProfilePage.module.css';
import profilePic from '../assets/profilepictureicon.jpg';
import { useNavigate, Link } from 'react-router-dom';

import NavBar from '../components/NavBar.tsx';

function ProfilePage(): JSX.Element {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{ firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    const _ud = localStorage.getItem('user_data');
    try {
      const parsedData = _ud ? JSON.parse(_ud) : null;
      if (parsedData && parsedData.userId) {
        setUserData({ firstName: parsedData.firstName, lastName: parsedData.lastName });
      } else {
        navigate('/');
      }
    } catch (e) {
      console.error('Error parsing user_data:', e);
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <NavBar />
        <div className={styles.leftPanel}>
          {userData && ( <p className={styles.introUser}>
          Hello {userData.firstName} {userData.lastName}!
          </p>)}
          <img src={profilePic} alt="Profile" className={styles.profileImage} />
        </div>
        <div className={styles.rightPanel}>
          <h2 className={styles.profileTitle}>PROFILE MANAGER</h2>
          <ul className={styles.menu}>
            <li>Favorites</li>
            <li><Link to="/profile/contributions">Contributions</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
