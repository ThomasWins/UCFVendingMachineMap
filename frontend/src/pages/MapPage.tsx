import MapComponent from '../components/MapComponent';
import React, { useEffect } from 'react';////////////////
import { useLocation } from 'react-router-dom';////////////////

const MapPage: React.FC = () => {
////////////////////////////////////////////////
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openPopup) {
      // Open popup logic here
      console.log('Popup should open');
    }
  }, [location]);
////////////////////////////////////////////////
  
return (
  <div id="mapPage">
    <MapComponent /> 
  </div>
  );
};

export default MapPage;
