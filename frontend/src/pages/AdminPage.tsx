import React, { useEffect, useState } from 'react';

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
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  // Fetch requests from backend
  useEffect(() => {
    fetch('/api/vending-requests')
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.error('Error fetching requests:', err));
  }, []);

  const handleCommentChange = (id: string, comment: string) => {
    setComments(prev => ({ ...prev, [id]: comment }));
  };

  const handleUpdate = (id: string, status: string) => {
    fetch(`/api/vending-requests/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        adminComment: comments[id] || '',
        processedBy: 999, // Replace with actual admin ID if needed
      }),
    })
      .then(res => res.json())
      .then(updated => {
        setRequests(prev =>
          prev.map(r => (r._id === updated._id ? updated : r))
        );
      })
      .catch(err => console.error('Error updating request:', err));
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
            value={comments[req._id] || ''}
            onChange={(e) => handleCommentChange(req._id, e.target.value)}
          />
          <button onClick={() => handleUpdate(req._id, 'approved')}>Approve</button>
          <button onClick={() => handleUpdate(req._id, 'rejected')}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;


export default AdminPage;
