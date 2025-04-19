import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface VendingRequest {
  _id: string;
  userId: number;
  userLogin: string;
  coordinates: { latitude: number; longitude: number };
  description: string;
  status: string;
  submittedAt: string;
  adminComment?: string;
}

const AdminPage: React.FC = () => {
  const [requests, setRequests] = useState<VendingRequest[]>([]);

  useEffect(() => {
    axios.get('/api/vending-requests')
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleUpdate = (id: string, status: string, comment: string) => {
    axios.patch(`/api/vending-requests/${id}`, {
      status,
      adminComment: comment,
      processedBy: 999 // Replace with actual admin ID
    }).then(res => {
      setRequests(prev => prev.map(r => r._id === id ? res.data : r));
    }).catch(err => console.error(err));
  };

  return (
    <div className="admin-page">
      <h2>Vending Machine Requests</h2>
      {requests.map(req => (
        <div key={req._id} className="request-card">
          <p><strong>User:</strong> {req.userLogin}</p>
          <p><strong>Description:</strong> {req.description}</p>
          <p><strong>Status:</strong> {req.status}</p>
          <p><strong>Location:</strong> ({req.coordinates.latitude}, {req.coordinates.longitude})</p>
          <textarea
            placeholder="Admin comment"
            onChange={(e) => req.adminComment = e.target.value}
          />
          <button onClick={() => handleUpdate(req._id, 'approved', req.adminComment || '')}>Approve</button>
          <button onClick={() => handleUpdate(req._id, 'rejected', req.adminComment || '')}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
