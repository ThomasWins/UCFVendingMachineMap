import React, { useState, useEffect } from 'react';
import './CSS/Contributions.css';

interface VendingRequest {
  userId: number;
  userLogin: string;
  building: string;
  type: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
  imagePath?: string;
  status: string;
  submittedAt: string;
  processedAt?: string;
  processedBy?: number;
  adminComment?: string;
}

interface Rating {
  userId: number;
  rating: number;
}

interface ContributionsProps {
  userId: number;
  vendingMachineId: number;
}

const Contributions: React.FC<ContributionsProps> = ({ userId, vendingMachineId }) => {
  const [vendingRequests, setVendingRequests] = useState<VendingRequest[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVendingRequests = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/contributions`);
        const data = await response.json();
        setVendingRequests(data);
      } catch (error) {
        console.error('Error fetching vending requests:', error);
      }
    };

    const fetchRatings = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/vending/${vendingMachineId}/ratings`);
        const data = await response.json();
        setRatings(data);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    fetchVendingRequests();
    fetchRatings();

    setLoading(false);
  }, [userId, vendingMachineId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Vending Requests</h2>
      <ul>
        {vendingRequests.map((request) => (
          <li key={request.userId}>
            <strong>{request.userLogin}</strong> requested a vending machine at {request.building}.
            Status: {request.status}
          </li>
        ))}
      </ul>

      <h2>Ratings</h2>
      <ul>
        {ratings.map((rating, index) => (
          <li key={index}>
            User ID: {rating.userId} gave a rating of {rating.rating}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contributions;

