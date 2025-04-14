import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MAP_GIF from '../assets/showcaseVideo.mp4'; // PLACEHOLDER (Change to gif or picture of map?)
import './CSS/HomeBody.css';

const HomeBody = () => {
  const navigate = useNavigate();

  const goToMap = () => {
    navigate('/map');
  };

  return (
    <div id="container">
      <h1 id="title">Vending Machine UCF Map</h1>
      <button onClick={goToMap} id="mapButton">Go to Map</button>
      <video
        id="mapvid"
        src={MAP_GIF}
        alt="Showcase video"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};

export default HomeBody;
