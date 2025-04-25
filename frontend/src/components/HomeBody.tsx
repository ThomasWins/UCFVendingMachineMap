import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MAP_GIF from '../assets/showcaseVideo.mp4'; // PLACEHOLDER (Change to gif or picture of map?)
import './CSS/HomeBody.css';

const HomeBody = () => {
  const navigate = useNavigate();

  const goToMap = () => {
    navigate('/map');
    window.scrollTo(0, 0);
  };

  const goToContributions = () => {
    navigate('/profile/contributions');
  }

  const goToLogin = () => {
    navigate('/');
  }

  const _ud = localStorage.getItem('user_data');
  let isLoggedIn = false;

  try {
    const userData = _ud ? JSON.parse(_ud) : null; 
    if (userData && userData.userId) {
      isLoggedIn = true;
    }
  } catch (e) {
    console.error("Error parsing user_data:", e);
  }

  return (
    <div id="container" className="home-page-des">
      <h1 id="title">Vending Machine UCF Map</h1>
      <h2 id="description">Displays the locations of vending machines across the UCF campus, helping students and visitors easily find snacks and drinks nearby.</h2>
      <video
        id="mapvid"
        src={MAP_GIF}
        alt="Showcase video"
        autoPlay
        loop
        muted
        playsInline
      />

      <div id="buttons-row">

        {isLoggedIn ? (
          <>
            <button onClick={goToMap} id="mapButton">Go to the Map</button>
            <button onClick={goToContributions} id="contributionButton">Your Contributions</button>
          </>
        ) : (
          <>
            <button onClick={goToMap} id="mapButton2">View Map</button>
          </>
        )}
        
      </div>
      

      <div id="aboutContainer">
        <h1 id="aboutUs">About us</h1>
        <p>
          We are a team of 5 computer science students who want to make students' lives easier. Our interactive UCF Vending Machine Map is designed to help students and visitors quickly locate snack and drink machines across the UCF campus. Whether you're rushing between classes or just exploring campus, our map makes it easy to find exactly what you're craving.
        </p>

        <h3>Find Vending Machines Near You</h3>
        <p>
          Browse an up-to-date map of all vending machines around campus. Use filters to narrow down machines by location, item type (snacks, drinks, healthy options), or availability.
        </p>

        <h3>Save Favorites</h3>
        <p>
          Logged-in users can mark machines as favorites, making it easy to revisit your go-to snack spots without searching every time.
        </p>

        <h3>Leave Reviews</h3>
        <p>
          Leave reviews and feedback on vending machines. Help others know if a machine is often empty, has card issues, or stocks your favorite items.
        </p>

        <h3>Add New Machines</h3>
        <p>
          Know about a vending machine that’s not on the map? Contribute to the community by adding its location and details.
        </p>

        <h3>Real-Time Campus Overview</h3>
        <p>
          See all vending machines at a glance, with real-time updates and a clean, mobile-friendly interface designed for quick access on the go.
        </p>
      </div>
    </div>
  );
};

export default HomeBody;
