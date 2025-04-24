
import React, { useEffect, useState } from 'react';
import  './CSS/Contributions.css';

interface Contribution {
  _id: string;
  description: string;
  building: string;
  type: string;
  status: string;
  submittedAt: string;
  imagePath?: string;
  adminComment?: string;
}

interface ContributionsListProps {
  userId: number;
}

const Contributions: React.FC<ContributionsListProps> = ({ userId }) => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/contributions`, {
          credentials: 'include' 
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setContributions(data.contributions.map((contribution: any) => ({ ...contribution, userId })));
      } catch (err: any) {
        setError(err.message || 'Failed to load contributions');
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [userId]);

  if (loading) return <p>Loading contributions...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (contributions.length === 0) return <p>No contributions found.</p>;

  return (
    <div className="contributionsContainer">
      <h3>Your Contributions</h3>
      <ul className="list">
        {contributions.map((item) => (
          <li key={item._id} className="card">
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Building:</strong> {item.building}</p>
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Submitted At:</strong> {new Date(item.submittedAt).toLocaleString()}</p>
            {item.adminComment && <p><strong>Admin Comment:</strong> {item.adminComment}</p>}
                {item.imagePath && (
                    <img
                        src={`https://gerberthegoat.com/${item.imagePath}`}
                        alt="Vending submission"
                        className="image"
                    />
                )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contributions;
