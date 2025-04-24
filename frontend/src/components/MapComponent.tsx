
import './CSS/mapStyles.css';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import { useNavigate} from 'react-router-dom';

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
import Contributions from './Contributions';

interface MapComponentProps {
  isVendingRequestPopupOpen: boolean;
}
interface VendingForm {
  building: string;
  description: string;
  type: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image: File | null;
}
// set up all of the things that will be changed i.e checks for popups (mostly)
const MapComponent = ({ isVendingRequestPopupOpen: initialPopupOpen }: MapComponentProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isTilted, setIsTilted] = useState<boolean>(true);
  const [showStylePopup, setShowStylePopup] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [selectedVending, setSelectedVending] = useState<any | null>(null); 

  // new favorites use state
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [isVendingPopupOpen, setIsVendingPopupOpen] = useState<boolean>(false); 
  const [isVendingRequestPopupOpen, setIsVendingRequestPopupOpen] = useState(false);

  const requestMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [requestCoords, setRequestCoords] = useState<[number, number] | null>(null);

  // important for filling out the vending form STILL NEEDS IMAGE AREA!!!!!!!!!!!!!!!!!!!!!!!!!
  const [vendingForm, setVendingForm] = useState({
    building: '',
    description: '',
    type: '',
    coordinates: { lat: 0, lng: 0 },
    image: null,
  });

  const [userData, setUserData] = useState<any | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('');


const fetchVendingData = async () => {
  try {
    const res = await fetch('https://gerberthegoat.com/api/vending');
    const data = await res.json();
    setVendingData(data);
  } catch (err) {
    console.error('Error fetching vending data:', err);
  }
};

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

  //test to see if it works
 useEffect(() => {
    const fetchFullUserData = async (userId: number) => {
      try {
        const response = await fetch(`https://gerberthegoat.com/api/users/info/${userId}`);

        if (!response.ok) {
          throw new Error('Failed to get the user data');
        }

        const user_data = await response.json();

        setUserData(user_data);
        setCurrentUserId(user_data.userId);
        setCurrentUserName(`${user_data.firstName} ${user_data.lastName}`);
      } catch (err: any) {
        console.error('Error fetching user profile:', err.message);
      }
    };
    const storedUserData = localStorage.getItem('user_data');

    if (storedUserData) {
      const localUser = JSON.parse(storedUserData);

      if (localUser?.userId) {
        fetchFullUserData(localUser.userId);
      } else {
        console.error('userId not found in stored user_data');
      }
    } else {
      console.error('User data not found in localStorage');
    }
  }, []);


  // this is just a spot I thought looked good at the center of ucf, important for centering later
  const originalCenter = [-81.2, 28.6000];


  const [vendingData, setVendingData] = useState([]);

useEffect(() => {
    // Set the local state based on the initial prop
    setIsVendingRequestPopupOpen(initialPopupOpen);
}, [initialPopupOpen]);



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
const navigate = useNavigate();

const goHome = () => {
    navigate('/home');
  };

const goAdmin = () => {
  window.open('/admin', '_blank');
};

// set the rating for the user if it is changed this now works when clicking on stars!
const handleRatingChange = async (rating) => {
  setUserRating(rating);

  if (selectedVending && currentUserId) {
    const payload = {
      userId: currentUserId,
      rating: rating,
    };

    try {
      const response = await fetch(`/api/vending/${selectedVending._id}/updateRating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('Rating updated successfully!');
        setSelectedVending(data.vending);
        fetchVendingData();
      } else {
        console.error('failed to update rating:', data.error || data.message);
      }
    } catch (error) {
      console.error('error updating ratng:', error);
    }
  }
};

// basic setup for mapbox very important probably should put my accessToken in a .env file but idk how to
  useEffect(() => {
    if (!mapContainerRef.current) return;
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.padding = '0';
    document.body.style.color = '#5e5e5e';

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

     return () => {
    mapInstance.remove();
    document.body.style.margin = '';
    document.body.style.overflow = 'auto';
    document.body.style.padding = '';
    document.body.style.color = '';
  };
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
const handleVendingRequestSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!vendingForm.building || !vendingForm.description || !vendingForm.type || !requestCoords) {
    alert('Please fill out all required fields.');
    return;
  }

  const formData = new FormData();
  formData.append('building', vendingForm.building);
  formData.append('description', vendingForm.description);
  formData.append('type', vendingForm.type);
  formData.append('latitude', requestCoords[1].toString());
  formData.append('longitude', requestCoords[0].toString());


  if (vendingForm.image) {
    formData.append('image', vendingForm.image);
  }

  try {
    const response = await fetch(`/api/users/${currentUserId}/vending-requests`, {
      method: 'POST',
      body: formData,
      credentials: 'include' // Important for sessions
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();

    // Reset form and close popup on success
    setVendingForm({
      building: '',
      description: '',
      type: '',
      coordinates: { lat: 0, lng: 0 },
      image: null
    });
    setIsVendingRequestPopupOpen(false);



  } catch (error) {
    console.error('Error uploading:', error);
    alert('Failed to upload vending machine data');
  }
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

  console.log('Comment payload:', {
  userId: currentUserId,
  userName: currentUserName,
  rating: userRating,
  comment: userComment
  });

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
      fetchVendingData();
      setUserComment('');
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

// favorites use effect
useEffect(() => {
  if (selectedVending && userData) {
    setIsFavorite(userData.favorites.includes(selectedVending.id));
  }
}, [selectedVending, userData]);

//handle the changing of the favorites look at all the ? : statements basically just shuffles between them and acts the same as a prior function just for favorites
const handleToggleFavorite = async () => {
  if (!userData || !selectedVending) return;
//basically just a true or false to determine the correct path
  try {
    const url = isFavorite
      ? `/api/users/${userData.userId}/favorites/${selectedVending.id}`
      : '/api/users/favorites/add';
    
    const options = isFavorite
      ? { method: 'DELETE' }
      : {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userData.userId,
            vendingId: selectedVending.id
          }),
        };

    const res = await fetch(url, options);
    const data = await res.json();

    if (res.ok) {
      
      const updatedFavorites = isFavorite
        ? userData.favorites.filter((id: number) => id !== selectedVending.id)
        : [...userData.favorites, selectedVending.id];

      // update the favorite state, pretty much exactly how i did all the other ones just with favorites
      setUserData({ ...userData, favorites: updatedFavorites });

      setIsFavorite(!isFavorite);
    } else {
      console.error(data.error);
    }
  } catch (err) {
    console.error('error with favorite:', err);
  }
};



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

    {/*filter logic now updated for new building logic*/}
    {isFilterVisible && (
      <div className="filter-container">
        <select
          className="filter-select"
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
        >
        <option value="all">All Buildings</option>
          {ucfBuildings.map((building) => (
           <option key={building} value={building}>
             {building}
           </option>
         ))}
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

    {/*favorites logic is now connected to the database*/}
    <div className={`favorites-popup ${isFavoritesOpen ? 'open' : ''}`}>
      <button className="favorites-close-button" onClick={toggleFavorites}>×</button>
      <h2>Favorites</h2>

{userData?.favorites?.length === 0 ? (
  <p>Favorite a vending machine to see it here.</p>
) : (
  userData?.favorites?.map(favId => {
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
            src={selectedVending.imageUrl}
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

          <div className="my-p">Type: {selectedVending.type}</div>
          <div className="my-p"><strong>Description</strong></div>
          <div className="my-p">{selectedVending.description}</div>

          {/* This had to be done slightly differently then the function due to the half stars and this setting what would be input into the database so I added some styling here that should probably be taken somewhere else but im not going to do it*/}
          <div>
            <div className="my-h3">Rate this Vending Machine</div>
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
            <div className="my-h3">Leave a Review PLACEHOLDER</div>
                   <input
              type="text"
              value={userComment}
              onChange={handleCommentChange}
              placeholder="Write a review..."
              style={{ width: '90%', padding: '8px' }}
            />
            <div style={{ marginTop: '8px', display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSubmitComment}
                style={{ padding: '8px 16px' }}
              >
                Submit Review
              </button>
              {/* i just copy and pasted the submit review button for the favorites one and added a true/false switch condition*/}
              <button
                onClick={handleToggleFavorite}
                style={{ padding: '8px 16px' }}
              >
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            </div>
            {/*will rending the username along with the comment and stars should be all correct*/}
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
        <p className="menu-link" onClick={goAdmin} >Admin Portal</p>
        <p className="menu-link" onClick={goHome} >Home</p>
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
            <label htmlFor="image">Upload image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={(e) => setVendingForm(prev => ({
                ...prev,
                image: e.target.files?.[0] || null
              }))}
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
