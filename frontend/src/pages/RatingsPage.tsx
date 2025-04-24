import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar.tsx';

function RatingsPage(): JSX.Element {
  const [ratings, setRatings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchData = async () => {
    try {
      const userData = localStorage.getItem('user_data');
      const parsedData = userData ? JSON.parse(userData) : null;
      if (!parsedData || !parsedData.userId) {
        navigate('/');
        return;
      }

      // Fetch favorites
      const favRes = await fetch(`/api/user/${parsedData.userId}/favorites`);
      const favData = await favRes.json();
      setFavorites(favData || []);

      // Fetch full profile (or just ratings if you split it)
      const profileRes = await fetch(`/api/user/${parsedData.userId}`);
      const profileData = await profileRes.json();
      setRatings(profileData.ratings || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  fetchData();
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
