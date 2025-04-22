import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import '../components/CSS/adminStyles.css'; 

import backgroundImage from '../assets/adminbk.png';

interface VendingRequest {
  _id: string;
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

const AdminPage = () => {
  const [requests, setRequests] = useState<VendingRequest[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<VendingRequest | null>(null);
  const [adminComment, setAdminComment] = useState<string>('');

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const parsed = JSON.parse(userData);
      setCurrentUser(parsed);

      fetch(`https://gerberthegoat.com/api/users/${parsed.userId}/vending-requests`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch vending requests');
          }
          return response.json();
        })
        .then((data) => {
          setRequests(data.requests);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const handleAction = async (status: 'approved' | 'rejected') => {
    if (!selectedRequest || !currentUser) return;

    try {
      const res = await fetch(
        `https://gerberthegoat.com/api/users/${currentUser.userId}/vending-requests/${selectedRequest._id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, adminComment }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert('Request processed!');
        setRequests(prev => prev.filter(r => r._id !== selectedRequest._id));
        setSelectedRequest(null);
        setAdminComment('');
      } else {
        alert(data.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    
    document.body.style.margin = '0';
    document.body.style.display = 'block';

    return () => {

      document.body.style.margin = '';
      document.body.style.display = '';
    };
  }, []);

  useEffect(() => {
    if (!selectedRequest) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibWljYWFsbGUiLCJhIjoiY203dHAwM2N1MXdpbjJsb240djF3cWVnMCJ9.lIqkPrRisBYi0eR9iBjMOQ';

    const map = new mapboxgl.Map({
      container: 'unique-popup-map',
      style: 'mapbox://styles/mapbox/standard',
      center: [
        selectedRequest.coordinates.longitude,
        selectedRequest.coordinates.latitude
      ],
      zoom: 15,
    });

    new mapboxgl.Marker()
      .setLngLat([selectedRequest.coordinates.longitude, selectedRequest.coordinates.latitude])
      .addTo(map);

    return () => map.remove();
  }, [selectedRequest]);
 return (
    <div className="unique-admin-container">
      {/* background image of a map to make it look more consistant */}
      <img
        src={backgroundImage}
        alt="Background"
        className="unique-background-image"
      />

      {/* just copied my overlay from before */}
      <div className="unique-overlay"></div>

      {/* left box displaying the information idk if I like this format */}
      <div className="unique-admin-layout">
        <div className="unique-request-list-box">
          <h3>Vending Request List</h3>
          <div className="unique-request-list">
            {requests.map((req) => (
              <div
                key={req._id}
                className="unique-request-card"
                onClick={() => setSelectedRequest(req)}
              >
                <p><strong>Submitted by User:</strong> {req.userLogin}</p>
                <p><strong>Building:</strong> {req.building}</p>
                <p><strong>Type:</strong> {req.type}</p>
                <p><strong>Description:</strong> {req.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* the box on the right side that shows the map and info the user checks */}
        {selectedRequest && (
          <div className="unique-vending-request-popup">
            <button
              className="unique-close-vending-request-popup"
              onClick={() => setSelectedRequest(null)}
            >
              &times;
            </button>
            <h3>Request Details</h3>
            <div id="unique-popup-map"></div>

            <label>Description:</label>
            <div className="unique-info-box">{selectedRequest.description}</div>

            <label>Building:</label>
            <div className="unique-info-box">{selectedRequest.building}</div>

            <label>Type:</label>
            <div className="unique-info-box">{selectedRequest.type}</div>

            <label>User:</label>
            <div className="unique-info-box">{selectedRequest.userLogin}</div>

            {/*doesn't do anything yet*/}
            {selectedRequest.imagePath && (
              <img
                src={`https://merntest.michaelwebsite.xyz/${selectedRequest.imagePath}`}
                alt="Vending"
                style={{ maxWidth: '100%', borderRadius: '8px' }}
              />
            )}

            {/* I was going to format some scrolling here but i switched things up so now its all messed up*/}
            <div className="unique-vending-scrollable-fields">
              <label>Admin Comment:</label>
              <textarea
                placeholder="Optional admin comment"
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
              />

              <button
                type="submit"
                onClick={() => handleAction('approved')}
              >
                Approve
              </button>
              <button
                type="submit"
                onClick={() => handleAction('rejected')}
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

