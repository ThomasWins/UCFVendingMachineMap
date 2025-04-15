import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch('/api/users/logout', { // api endpoint
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          localStorage.removeItem('user_data'); // Is this a thing?
          navigate('/');
        } else {
          console.error('Logout failed');
        }
      } catch (err) {
        console.error('Logout error:', err);
      }
    };

    logout();
  }, [navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
