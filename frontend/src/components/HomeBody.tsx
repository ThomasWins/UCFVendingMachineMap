import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MAP_GIF from '../assets/Desktop_2025.04.14_-_16.54.12.02.mp4'; // PLACEHOLDER (Change to gif or picture of map?)
import './CSS/HomePage';

const HomePage = () => {
  const navigate = useNavigate();

  const goToMap = () => {
    navigate('/map');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Vending Machine UCF Map</h1>
      <button onClick={goToMap} style={styles.button}>Go to Map</button>
      <img
        src={MAP_GIF}
        alt="UCF Map GIF"
        style={styles.mp4}
      />
    </div>
  );
};

export default HomePage;
