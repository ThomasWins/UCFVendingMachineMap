import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MapComponent from '../components/MapComponent';

const MapPage: React.FC = () => {
  const location = useLocation();
  const [isVendingRequestPopupOpen, setIsVendingRequestPopupOpen] = useState(false);

  useEffect(() => {

  const _ud = localStorage.getItem('user_data');
    try {
      const parsedData = _ud ? JSON.parse(_ud) : null;
      if (parsedData && parsedData.userId) {
        setUserData({ firstName: parsedData.firstName, lastName: parsedData.lastName });
      } else {
        navigate('/');
      }
    } catch (e) {
      console.error('Error parsing user_data:', e);
      navigate('/');
    }
  }, [navigate]);
    
    if (location.state?.openPopup) {
      setIsVendingRequestPopupOpen(true);  // Open the popup when navigating from the "Add Machine" link
    }
  }, [location]);

  return (
    <div id="mapPage">
      <MapComponent isVendingRequestPopupOpen={isVendingRequestPopupOpen} />
    </div>
  );
};

export default MapPage;
