import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MapComponent from '../components/MapComponent';

const MapPage: React.FC = () => {
  const location = useLocation();
  const [isVendingRequestPopupOpen, setIsVendingRequestPopupOpen] = useState(false);

  useEffect(() => {
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
