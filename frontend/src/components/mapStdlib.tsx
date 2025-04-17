import mapboxgl from 'mapbox-gl';

// star image imports
import FULLSTAR from './photos/FULLSTAR.png';
import HALFSTAR from './photos/HALFSTAR.png';
import EMPTYSTAR from './photos/EMPTYSTAR.png';


// rating function fixed for the new database parameters
export const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const total = ratings.reduce((sum, r) => sum + r.rating, 0);
  return (total / ratings.length).toFixed(1);
};

// I felt really smart for making this function, basically just renders the stars via the picture files
export const renderStars = (averageRating: number | string): JSX.Element => {
  const avg = typeof averageRating === 'string' ? parseFloat(averageRating) : averageRating;

  const fullStars = Math.floor(avg);
  const hasHalfStar = avg % 1 >= 0.25 && avg % 1 < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starStyle = {
    width: '14px',
    height: '14px',
    display: 'inline-block',
    marginRight: '1px',
  };

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<img key={`full-${i}`} src={FULLSTAR} alt="Full Star" style={starStyle} />);
  }

  if (hasHalfStar) {
    stars.push(<img key="half" src={HALFSTAR} alt="Half Star" style={starStyle} />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<img key={`empty-${i}`} src={EMPTYSTAR} alt="Empty Star" style={starStyle} />);
  }

  return <>{stars}</>;
};

export const countRatings = (ratings: number[] | undefined): number => ratings?.length || 0;

//i meant to put more here to clean up my code but changing all of my code to make it work is more of a inconvenience then just shifting through 700 lines
