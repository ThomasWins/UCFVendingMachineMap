import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const res = await fetch('/api/users/logout', {
          method: 'POST',
          credentials: 'include', // important if using cookies
        });

        const data = await res.json();
        console.log('Logout response:', res.status, data);

        if (res.ok) {
          localStorage.removeItem('user_data');
          navigate('/home');
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
