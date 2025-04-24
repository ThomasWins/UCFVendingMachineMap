import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Ratings.css';

interface VendingMachine {
  id: string;
  name: string;
  building: string;
  type: string;
}

interface Rating {
  vendingId: string;
  vendingName: string;
  building: string;
  rating: number;
}

interface Comment {
  vendingId: string;
  vendingName: string;
  building: string;
  rating: number;
  text: string;
}

function Ratings(): JSX.Element {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<VendingMachine[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userData = localStorage.getItem('user_data');
        const parsedData = userData ? JSON.parse(userData) : null;

        if (!parsedData || !parsedData.userId) {
          navigate('/');
          return;
        }

        const res = await fetch(`/api/users/profile/${parsedData.userId}`);
        if (!res.ok) throw new Error('Failed to fetch user profile');
        const data = await res.json();

        setFavorites(data.favorites || []);
        setRatings(data.ratings || []);
        setComments(data.comments || []);
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    fetchProfileData();
  }, [navigate]);

  return (
    <div id="ratingsWrapper">
      <div id="favoritesCol">
        <h2 className="text-xl font-semibold mb-2">Your Favorite Machines</h2>
        {favorites.length > 0 ? (
          <ul className="mb-6">
            {favorites.map((fav) => (
              <li key={fav.id}>
                <strong>{fav.name}</strong> — {fav.type} in {fav.building}
              </li>
            ))}
          </ul>
        ) : (
          <p>No favorite machines yet.</p>
        )}
      </div>
      <div id="ratingsCol">
        <h2 className="text-xl font-semibold mb-2">Your Ratings</h2>
        {ratings.length > 0 ? (
          <ul className="mb-6">
            {ratings.map((rate, idx) => (
              <li key={idx}>
                <strong>{rate.vendingName}</strong> — Rated {rate.rating}/5 in {rate.building}
              </li>
            ))}
          </ul>
        ) : (
          <p>No ratings yet.</p>
        )}
      </div>
      <div id="commentsCol">
        <h2 className="text-xl font-semibold mb-2">Your Comments</h2>
        {comments.length > 0 ? (
          <ul>
            {comments.map((comment, idx) => (
              <li key={idx} className="mb-2">
                <strong>{comment.vendingName}</strong> in {comment.building} — Rated {comment.rating}/5
                <br />
                <em>"{comment.text}"</em>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
}

export default Ratings;
