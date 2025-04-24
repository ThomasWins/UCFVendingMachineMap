import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar.tsx';

function RatingsPage(): JSX.Element {
  const [ratings, setRatings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userData = localStorage.getItem('user_data');
        const parsedData = userData ? JSON.parse(userData) : null;
        if (!parsedData || !parsedData.userId) {
          navigate('/'); // If not logged in send to login screen
          return;
        }

        const response = await fetch(`/api/user/${parsedData.userId}`);
        const data = await response.json();

        setRatings(data.ratings || []);
        setFavorites(data.favorites || []);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      }
    };

    fetchProfileData();
  }, [navigate]);

  return (
    <div>
      <NavBar />
      <h2>Your Favorites</h2>
      <ul>
        {favorites.length > 0 ? (
          favorites.map((fav: any, index: number) => (
            <li key={index}>
              <strong>{fav.name}</strong> — {fav.type} in {fav.building}
            </li>
          ))
        ) : (
          <p>You have no favorite vending machines.</p>
        )}
      </ul>

      <h2>Your Ratings</h2>
      <ul>
        {ratings.length > 0 ? (
          ratings.map((rating: any, index: number) => (
            <li key={index}>
              <strong>{rating.vendingName}</strong> in {rating.building} — Rated: {rating.rating}/5
            </li>
          ))
        ) : (
          <p>You haven't rated any vending machines yet.</p>
        )}
      </ul>
    </div>
  );
}

export default RatingsPage;
