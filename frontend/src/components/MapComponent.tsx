import './CSS/mapStyles.css';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';

// map styles imports (basically what allows us to change between maps)
import sataliteImage from './photos/satalite.png';
import standardImage from './photos/satalite.png'; //change back to standard
import darkImage from './photos/dark.png';
import streetsImage from './photos/streets.png';
import outsideImage from './photos/outside.png';

// HARDCODED IMAGES PLEASE REMOVE AFTER GETTING MULTER WORKING!!!!!!!!!!!!!!!!!!!
import msbImage from './photos/msb.jpg';
import FerrelCommonsImage from './photos/FerrelCommons.jpg';
import TenisCourtImage from './photos/TenisCourt.jpg';
import rwcImage from './photos/rwc.png';

// star images for the rating
import FULLSTAR from './photos/FULLSTAR.png';
import HALFSTAR from './photos/HALFSTAR.png';
import EMPTYSTAR from './photos/EMPTYSTAR.png';

// array that holds all the buildings
import ucfBuildings from './ucfBuildings';

// import of a stdlib of michael functions
import {
  calculateAverageRating,
  renderStars,
  countRatings,
} from './mapStdlib';

// set up all of the things that will be changed i.e checks for popups (mostly)
const MapComponent = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isTilted, setIsTilted] = useState<boolean>(true);
  const [showStylePopup, setShowStylePopup] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [selectedVending, setSelectedVending] = useState<any | null>(null); // Add state for selected vending machine

  const [isVendingPopupOpen, setIsVendingPopupOpen] = useState<boolean>(false); // State for vending popup visibility
  const [isVendingRequestPopupOpen, setIsVendingRequestPopupOpen] = useState(false);

  const requestMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [requestCoords, setRequestCoords] = useState<[number, number] | null>(null);

  // important for filling out the vending form STILL NEEDS IMAGE AREA!!!!!!!!!!!!!!!!!!!!!!!!!
  const [vendingForm, setVendingForm] = useState({
    building: '',
    description: '',
    type: '',
    coordinates: { lat: 0, lng: 0 },
  });

  // this is just a spot I thought looked good at the center of ucf, important for centering later
  const originalCenter = [-81.2, 28.6000];


  // HARDCODED REMOVE LATER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const userData = [
    { UserId: 1, Firstname: 'bob', Lastname: 'lob', Admin: 'false', Favorites: [1, 3,4,5,6] },
  ];
  const currentUserId = '1';
  const currentUserName = 'Bob lob';



  const [vendingData, setVendingData] = useState([]);


// does some api stuff idk im frontend
useEffect(() => {
  fetch('https://gerberthegoat.com/api/vending')
    .then(res => res.json())
    .then(data => setVendingData(data))
    .catch(err => console.error('Error fetching vending data:', err));
}, []);

  const [userRating, setUserRating] = useState<number>(0);
  const [userComment, setUserComment] = useState<string>('');

// goes through the vending machines in the database and will add markers at the coordinates
const renderMarkers = (mapInstance: mapboxgl.Map) => {

  const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
  existingMarkers.forEach(marker => marker.remove());

  vendingData.forEach(item => {
    const matchBuilding = selectedBuilding === 'all' || item.building === selectedBuilding;
    const matchType = selectedType === 'all' || item.type === selectedType;

    if (matchBuilding && matchType) {
      const marker = new mapboxgl.Marker()
        .setLngLat([item.coordinates[0], item.coordinates[1]])
        .addTo(mapInstance);

      marker.getElement().addEventListener('click', () => {
        setSelectedVending(item);
        setIsVendingPopupOpen(true);
      });
    }
  });
};



// set the rating for the user if it is changed
const handleRatingChange = (rating: number) => {
  setUserRating(rating);
};

// basic setup for mapbox very important probably should put my accessToken in a .env file but idk how to
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibWljYWFsbGUiLCJhIjoiY203dHAwM2N1MXdpbjJsb240djF3cWVnMCJ9.lIqkPrRisBYi0eR9iBjMOQ';

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center: originalCenter,
      pitch: 45,
      zoom: 15.8,
      maxBounds: [
        [-81.2256, 28.58065],
        [-81.1716, 28.62415],
      ],
    });

    mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);


// this is the second mapbox instance made when the vending request popup is made. We probably need a third for the admin stuff
useEffect(() => {
  if (!isVendingRequestPopupOpen) return;

  const mapInstance = new mapboxgl.Map({
    container: 'popup-map',
    style: 'mapbox://styles/mapbox/standard',
    center: originalCenter,
    zoom: 13,
  });

  const handleMapClick = (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
    const { lng, lat } = e.lngLat;

    // basically makes it so that if you click again it will remove the marker
    if (requestMarkerRef.current) {
      requestMarkerRef.current.remove();
    }

    // makes a new marker
    const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapInstance);
    requestMarkerRef.current = marker;
    setRequestCoords([lng, lat]);
  };

  mapInstance.on('click', handleMapClick);

  return () => {
    mapInstance.off('click', handleMapClick);
    mapInstance.remove();

    // clean up for when it is closed
    if (requestMarkerRef.current) {
      requestMarkerRef.current.remove();
      requestMarkerRef.current = null;
    }
  };
}, [isVendingRequestPopupOpen]);

// this updates the form state in react for the vending machine submission form
const handleVendingFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setVendingForm(prev => ({ ...prev, [name]: value }));
};


// handles the submit form mostly with checks and stuff PLACEHOLDER IMPLEMENT THIS INTO THE API WITH BUFFER FOR ADMIN CHECK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const handleVendingRequestSubmit = (e: React.FormEvent) => {
  e.preventDefault();

    if (!vendingForm.building) {
    alert('Please fill out the building field.');
    return;
  }

  if (!vendingForm.description) {
    alert('Please fill out the description field.');
    return;
  }

  if (!vendingForm.type) {
    alert('Please select a vending machine type.');
    return;
  }

  if (!requestCoords) {
    alert('Please click on the map to place a marker.');
    return;
  }
  const isFormValid = () => {
  return (
    vendingForm.building &&
    vendingForm.description &&
    vendingForm.type &&
    requestCoords !== null
  );
};

  const submissionData = {
    ...vendingForm,
    coordinates: requestCoords,
  };

  // tester for submissions
  console.log('Submitting vending machine request:', submissionData);

  // reset the form for later and submit it
  setVendingForm({ building: '', description: '', type: '' });
  setRequestCoords(null);
  requestMarkerRef.current.remove();
  requestMarkerRef.current = null;
  setIsVendingRequestPopupOpen(false);
};


// some checks that keep users from having too many comments by syncing new one with whatever they had before, was originally meant to just update the rating but i figured too many comments from the same guy is annoying
// CAN BE UPDATED LATER TO ALLOW MULTIPLE COMMENTS ONCE DELETING COMMENTS IS ADDED!!!!!!!!!!!!!!!
useEffect(() => {
  if (selectedVending && currentUserId) {
    const prevRating = selectedVending.ratings.find(r => r.userId === currentUserId);
    setUserRating(prevRating?.rating || 0);

  }
}, [selectedVending, currentUserId]);


useEffect(() => {
    if (map && vendingData.length > 0) {
      renderMarkers(map);
    }
  }, [map, vendingData, selectedBuilding, selectedType]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserComment(e.target.value);
  };

// connecting to the database which will check and then submit the comment and rating into the code
// CURRENTLY USES HARDCODED USER FIX LATER
const handleSubmitComment = async () => {
  if (!selectedVending || !userRating || !userComment) return;

  const payload = {
    userId: currentUserId,
    userName: currentUserName,
    rating: userRating,
    comment: userComment,
  };

  try {
    const res = await fetch(`/api/vending/${selectedVending._id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      setSelectedVending(data.vending);
    } else {
      console.error('Server error:', data.error || data.message);
    }
  } catch (err) {
    console.error('Network error submitting comment:', err);
  }
};


// basically just closes what needs to be closed when it is opened idk if there was a better way but this is how i did it
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleFavorites = () => {
    setIsFavoritesOpen(!isFavoritesOpen);
    setIsVendingPopupOpen(false);
     setIsFilterVisible(false);
     setIsMenuOpen(false);
};

// same as the one before ^
  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
    setIsVendingPopupOpen(false);
    setIsFavoritesOpen(false);
    setIsMenuOpen(false);
};

//---------------------------------------------------------------------------
// basic code for when the map needs to be manipulated
  const toggleTilt = () => {
    if (map) {
      const newTilt = isTilted ? 0 : 45;
      map.easeTo({
        pitch: newTilt,
        speed: 0.2,
        curve: 1,
        duration: 500,
        easing: t => t,
      });
      setIsTilted(!isTilted);
    }
  };

  const changeStyle = (style: string) => {
    if (map) {
      map.setStyle(style);
      setShowStylePopup(false);
      setCurrentMapStyle(style);
    }
  };

  const centerOnOrigin = () => {
    if (map) {
      map.flyTo({
        center: originalCenter,
        zoom: 15.8,
        speed: 0.5,
        curve: 1,
        easing: t => t,
      });
    }
  };

  const centerMapOnVending = (coordinates: [number, number]) => {
    if (map) {
      map.flyTo({
        center: coordinates,
        zoom: 17,
        speed: 0.8,
        curve: 1,
        easing: t => t,
      });
    }
  };
//---------------------------------------------------------------------------


const countRatings = (ratings) => ratings?.length || 0;

  const filteredVending = vendingData.filter(item => {
    const matchBuilding = selectedBuilding === 'all' || item.building === selectedBuilding;
    const matchType = selectedType === 'all' || item.type === selectedType;
    return matchBuilding && matchType;
  });





// this part of the code is very messy

return (
  <div>
    <div ref={mapContainerRef} id="map" />
    {/* left rectangle on the side with what is currently the favorites button and the filter button*/}
    <div className="left-rectangle">
      <button className="open-button" onClick={toggleMenu}>≡</button>

      {/*favorites button*/}
      <div className="favorites-container">
        <button className="favorites-button" onClick={toggleFavorites}>𖢨</button>
        <span className="favorites-button-label">Favorites</span>
      </div>
      {/*filter button*/}
      <div className="filter-container-button">
        <button className="filter-button" onClick={toggleFilter}>⚙️</button>
        <span className="filter-button-label">Filter</span>
      </div>
    </div>

    {/*filter logic NEEDS TO BE UPDATED FOR NEW BUILDING ARRAY AND PROBABLY FORMATTED*/}
    {isFilterVisible && (
      <div className="filter-container">
        <select
          className="filter-select"
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
        >
          <option value="all">All Buildings</option>
          <option value="Math Science">Math Science</option>
          <option value="Ferrel Commons">Ferrel Commons</option>
          <option value="Recreation Center">Recreation Center</option>
          <option value="Tennis Courts">Tennis Courts</option>
        </select>

        <select
          className="filter-select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="snacks">Snacks</option>
          <option value="drinks">Drinks</option>
        </select>
      </div>
    )}

    {isFilterVisible && (
      <div className="vending-list-container">
        {filteredVending.map((vending) => (
          <div
            key={vending.id}
            className="vending-item"
            onClick={() => centerMapOnVending(vending.coordinates)}
          >
            <strong>{vending.name}</strong><br />
            <span>{vending.building} - {vending.type}</span>
          </div>
        ))}
      </div>
    )}

    {/*favorites logic NEEDS TO BE CONNECTED FOR DATABASE ASWELL*/}
    <div className={`favorites-popup ${isFavoritesOpen ? 'open' : ''}`}>
      <button className="favorites-close-button" onClick={toggleFavorites}>×</button>
      <h2>Favorites</h2>

      {userData[0].Favorites.length === 0 ? (
        <p>No favorites yet. Favorite a vending machine to see it here.</p>
      ) : (
        userData[0].Favorites.map(favId => {
          const favoriteVending = vendingData.find(vending => vending.id === favId);
          return favoriteVending ? (
            <div
              key={favoriteVending.id}
              className="vending-item"
              onClick={() => centerMapOnVending(favoriteVending.coordinates)}
            >
              <strong>{favoriteVending.name}</strong><br />
              <span>{favoriteVending.building} - {favoriteVending.type}</span>
            </div>
          ) : null;
        })
      )}
    </div>
    {/*formatting for the vending machine popup (i.e clicking on a marker)*/}
    {isVendingPopupOpen && selectedVending && (
      <div className="vending-popup">
        {/*HARDCODED IMAGE NEEDS TO BE CHANGED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/}
        {selectedVending.imageUrl && (
          <img
            src={msbImage}
            alt={selectedVending.name}
            className="vending-popup-image"
          />
        )}
        <div className="vending-popup-content">
          <button className="close-vending-popup" onClick={() => setIsVendingPopupOpen(false)}>×</button>
          <div className="vending-title">{selectedVending.name}</div>

          {/*find the average rating and display the stars using my stdlib functions*/}
          <div className="average-rating">
            <span className="average-rating-number">
              {calculateAverageRating(selectedVending.ratings)}
              {renderStars(calculateAverageRating(selectedVending.ratings))}
              ({countRatings(selectedVending.ratings)})
            </span>
          </div>

          <p>Type: {selectedVending.type}</p>
          <p><strong>Description</strong></p>
          <p>{selectedVending.description}</p>

          {/* This had to be done slightly differently then the function due to the half stars and this setting what would be input into the database so I added some styling here that should probably be taken somewhere else but im not going to do it*/}
          <div>
            <h3>Rate this Vending Machine</h3>
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '24px',
                  height: '24px',
                  marginRight: '-10px'
                }}
              >
                <div
                  onClick={() => handleRatingChange(star - 0.5)}
                  style={{
                    position: 'absolute',
                    width: '50%',
                    height: '100%',
                    left: 0,
                    top: 0,
                    cursor: 'pointer',
                    zIndex: 1
                  }}
                />
                <div
                  onClick={() => handleRatingChange(star)}
                  style={{
                    position: 'absolute',
                    width: '50%',
                    height: '100%',
                    right: 0,
                    top: 0,
                    cursor: 'pointer',
                    zIndex: 1
                  }}
                />
                {renderStars(userRating).props.children[star - 1]}
              </div>
            ))}
          </div>
          {/*This just allows the users to write comments and preps them for database, I currently think this is ugly so CHANGE At SOME POINT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/}
          <div>
            <h3>Leave a Review PLACEHOLDER</h3>
            <input
              type="text"
              value={userComment}
              onChange={handleCommentChange}
              placeholder="Write a review..."
              style={{ width: '90%', padding: '8px' }}
            />
            <button
              onClick={handleSubmitComment}
              style={{ padding: '8px 16px', marginTop: '8px' }}
            >
              Submit Review
            </button>
            {/*will rending the username along with the comment and stars FORMAT LATER TO COMBINE FIRST AND LAST NAME AND USE THAT INSTEAD !!!!!!!!!!!!!!!!!!!!!!*/}
            <div className="comments-container">
              <h4><strong>Reviews</strong></h4>
              {selectedVending.comments.length === 0 ? (
                <p>No comments yet.</p>
              ) : (
                selectedVending.comments.map((comment, index) => (
                  <div key={index} className="comment-item">
                    <p className="comment-user">{comment.userName}</p>
                    <p className="comment-rating">{renderStars(comment.rating)}</p>
                    <p className="comment-text">{comment.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    )}

    {/*this is for the menu that opens and dims the screen a bit with the overlay most of the buttons here lead to nothing but connect them to thomas or ken page later!!!!*/}
    <div className={`overlay ${isMenuOpen ? 'visible' : ''}`} onClick={toggleMenu} />

    <div className={`side-panel ${isMenuOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={toggleMenu}>×</button>
      <p className="menu-title-box"><strong>Vending Machine Map</strong></p>
      <div className="menu-links">
        <p className="menu-link" onClick={toggleFavorites}>Favorites</p>
        <p className="menu-link" onClick={toggleFilter}>Filter</p>
        <p className="menu-link">Your Contributions</p>
        <p
          className="menu-link"
          onClick={() => (
            setIsMenuOpen(false),
            setIsVendingRequestPopupOpen(true)
          )}
        >
          Submit Vending Request
        </p>
        <p className="menu-link">Admin Portal</p>
        <p className="menu-link">About</p>
      </div>
    </div>
    {/* this is for the popup for submitting a new vending machine request, I personally thought the popup-backdrop filter on the background was really cool*/}
    {isVendingRequestPopupOpen && (
      <>
        <div className="popup-backdrop" />
        <div className="vending-request-popup">
          <button
            className="close-vending-request-popup"
            onClick={() => setIsVendingRequestPopupOpen(false)}
          >
            ×
          </button>
          <h2>Submit Vending Request</h2>
          {/*I have the map parameters here for editing as im not sure of the size of it is curently too small, probably move to a css later*/}
          <div id="popup-map" style={{ height: '300px', width: '100%' }} />
          {/*when a location is clicked on it will get the coordinates the code works in a way that the newest marker is saved and the newest cordinates*/}
          {requestCoords && (
            <p style={{ marginTop: '10px', fontSize: '14px' }}>
              <strong>Selected Location:</strong>{' '}
              {requestCoords[1].toFixed(5)}, {requestCoords[0].toFixed(5)}
            </p>
          )}
          <form onSubmit={handleVendingRequestSubmit}>
            {/*I have a file filled with a random list of ucf buildings FORMAT LATER TO MAKE SURE IT ACTUALLY HAS ALL BUILDINGS!!!!!!!!!!!!!!!*/}
            <label htmlFor="building">Building</label>
            <input
              list="ucf-buildings"
              id="building"
              name="building"
              placeholder="Start typing a building name"
              value={vendingForm.building}
              onChange={handleVendingFormChange}
            />

            <datalist id="ucf-buildings">
              {ucfBuildings.map((building, index) => (
                <option key={index} value={building} />
              ))}
            </datalist>
            {/*place for users to describe what floor or location the vending machine is at*/}
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe where this vending machine is located"
              value={vendingForm.description}
              onChange={handleVendingFormChange}
            />
            {/*this is not correctly formatting for submitting a user CHANGE WHEN IMPLEMENTING MULTER FOR FILE SUBMISSIONS*/}
            <label htmlFor="image">Import image</label>
            <textarea
              id="image"
              name="image"
              placeholder="some sort of import here or somewhere idk i just copy and pasted the description parameters but probably use multer in the backend to store it"
            />
            {/*snacks or drinks I also have a combo but i havent implemented that anywhere else, i guess just change the filter to show those too regardless of the filter*/}
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={vendingForm.type}
              onChange={handleVendingFormChange}
            >
              <option value="">Select type</option>
              <option value="snacks">Snacks</option>
              <option value="drinks">Drinks</option>
              <option value="combo">Snacks & Drinks</option>
            </select>

            <button type="submit">Submit</button>
          </form>
        </div>
      </>
    )}
    {/*button for centering and tilting the angle SWITCH TO ACTUAL PCITURES INSTEAD OF UNNICODE AS IT DOESN"T TRANSLATE TO OTHER DEVICES!!!!!!!!!!!!!!!!!!!!!!*/}
    <div className="right-button-box">
      <button className="tilt-button" onClick={toggleTilt}>ඞ</button>
      <button className="arrow-button" onClick={centerOnOrigin}>🞊</button>
    </div>
    {/*this holds all of the styles in a box i also need to change the icon for this as well !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/}
    <div className="topright-button-box">
      <button className="style-button" onClick={() => setShowStylePopup(!showStylePopup)}>🗺</button>
      {showStylePopup && (
        <div className="style-popup">
          <div className="style-images-container">
            <div className="style-image-wrapper">
              <img
                src={sataliteImage}
                alt="Satellite"
                className="style-image"
                onClick={() => changeStyle('mapbox://styles/mapbox/standard-satellite')}
              />
              <span className="image-label">Satellite</span>
            </div>
            <div className="style-image-wrapper">
              <img
                src={standardImage}
                alt="Standard"
                className="style-image"
                onClick={() => changeStyle('mapbox://styles/mapbox/standard')}
              />
              <span className="image-label">Standard</span>
            </div>
            <div className="style-image-wrapper">
              <img
                src={darkImage}
                alt="Dark"
                className="style-image"
                onClick={() => changeStyle('mapbox://styles/mapbox/dark-v11')}
              />
              <span className="image-label">Night</span>
            </div>
            <div className="style-image-wrapper">
              <img
                src={streetsImage}
                alt="Streets"
                className="style-image"
                onClick={() => changeStyle('mapbox://styles/mapbox/streets-v11')}
              />
              <span className="image-label">Streets</span>
            </div>
            <div className="style-image-wrapper">
              <img
                src={outsideImage}
                alt="Outdoors"
                className="style-image"
                onClick={() => changeStyle('mapbox://styles/mapbox/outdoors-v11')}
              />
              <span className="image-label">Outdoors</span>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default MapComponent;









