import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MAP_GIF from '../assets/Desktop_2025.04.14_-_16.54.12.02.mp4'; // PLACEHOLDER (Change to gif or picture of map?)
import './CSS/HomePage.css';

const HomeBody = () => {
  const navigate = useNavigate();

  const goToMap = () => {
    navigate('/map');
  };

  return (
    <div id="container">
      <h1>Vending Machine UCF Map</h1>
      <button onClick={goToMap}>Go to Map</button>
      <img
        id="gif"
        src={MAP_GIF}
        alt="UCF Map GIF"
      />
    </div>
  );
};

export default HomeBody;
