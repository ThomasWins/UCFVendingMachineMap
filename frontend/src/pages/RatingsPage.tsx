import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar.tsx';
import Ratings from '../components/Ratings.tsx';

const RatingsPage = () => {
  return (
    <div>
      <NavBar />
      <Ratings />
    </div>
  );
};

export default RatingsPage;
