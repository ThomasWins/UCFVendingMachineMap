import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar.tsx';

function RatingsPage(): JSX.Element {
  const [ratings, setRatings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const userData = localStorage.getItem('user_data');
        const parsedData = userData ? JSON.parse(userData) : null;
        if (!parsedData || !parsedData.userId) {
          navigate('/');
          return;
        }

        const response = await fetch(`/api/user/${parsedData.userId}`);
        const data = await response.json();
        setRatings(data.ratings || []);
      } catch (err) {
        console.error('Failed to fetch ratings:', err);
      }
    };

    fetchRatings();
  }, [navigate]);

  return (
    <div>
      <NavBar />
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
