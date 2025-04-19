import React, { useEffect, useState } from 'react';

type RequestType = {
  _id: string;
  userId: number;
  userLogin: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  adminComment?: string;
};

const AdminPage: React.FC = () => {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [userId, setUserId] = useState<number | null>(null); // Set this with session or props
  const [error, setError] = useState('');
  const [commentMap, setCommentMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Mock userId for testing. Replace this with session storage or prop
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.userId);
    }
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetch(`/api/vending-requests/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.requests) setRequests(data.requests);
          else setError(data.error || 'Could not fetch requests');
        })
        .catch((err) => setError(err.message));
    }
  }, [userId]);

  const handleDecision = async (requestId: string, status: 'approved' | 'rejected') => {
    const comment = commentMap[requestId] || '';
    const res = await fetch(`/api/vending-requests/${userId}/${requestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, adminComment: comment }),
    });

    const data = await res.json();
    if (res.ok) {
      // Refresh the request list
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId
            ? { ...req, status, adminComment: comment, processedAt: new Date().toISOString() }
            : req
        )
      );
    } else {
      alert(data.error || 'Failed to update request');
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-page">
      <h1>Admin Panel - Vending Machine Requests</h1>
      {requests.length === 0 ? (
        <p>No vending requests found.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req._id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
              <p><strong>User:</strong> {req.userLogin} (ID: {req.userId})</p>
              <p><strong>Description:</strong> {req.description}</p>
              <p><strong>Coordinates:</strong> ({req.coordinates.latitude}, {req.coordinates.longitude})</p>
              <p><strong>Status:</strong> {req.status}</p>
              {req.status === 'pending' && (
                <>
                  <textarea
                    placeholder="Add admin comment..."
                    value={commentMap[req._id] || ''}
                    onChange={(e) =>
                      setCommentMap({ ...commentMap, [req._id]: e.target.value })
                    }
                    style={{ width: '100%', marginBottom: '10px' }}
                  />
                  <button onClick={() => handleDecision(req._id, 'approved')}>Approve</button>
                  <button onClick={() => handleDecision(req._id, 'rejected')} style={{ marginLeft: '10px' }}>Reject</button>
                </>
              )}
              {req.adminComment && <p><strong>Admin Comment:</strong> {req.adminComment}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPage;
