import React, { useRef } from 'react';
import NavBar from '../components/NavBar';
import HomeBody from '../components/HomeBody';

const HomePage = () => {
const aboutRef = useRef(null);

const scrollToAbout = () => {
  aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
};

return (
  <div>
    <NavBar onAboutClick={scrollToAbout} /> 
    <HomeBody aboutRef={aboutRef} />
  </div>
  );
};

export default HomePage;
