import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Contributions from '../components/Contributions';
import { useNavigate } from 'react-router-dom';

const ContributionsPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    try {
      const parsedData = userData ? JSON.parse(userData) : null;
      if (parsedData && parsedData.userId) {
        setUserId(parsedData.userId);
      } else {
        navigate('/');
      }
    } catch (e) {
      console.error('Error parsing user_data:', e);
      navigate('/');
    }
  }, [navigate]);

  if (!userId) return null;

  return (
    <div>
      <NavBar />
      <h1>Contributions</h1>
      <Contributions userId={userId} />
    </div>
  );
};

export default ContributionsPage;
