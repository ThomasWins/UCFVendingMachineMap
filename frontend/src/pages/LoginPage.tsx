import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle.tsx';
import Login from '../components/Login.tsx';
import IMAGE from '../assets/vendingmachinetrial.jpg';
import CreateAccount from '../components/CreateAccount.tsx';
import '../components/CSS/LoginPage.css';
import '../components/CSS/PageTitle.css';
import NavBar from '../components/NavBar.tsx';
import Footer from '../components/Footer.tsx';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const _ud = localStorage.getItem('user_data');
    try {
      const userData = _ud ? JSON.parse(_ud) : null;
      if (userData && userData.userId) {
        navigate('/home');
      }
    } catch (e) {
      console.error('Error parsing user_data:', e);
    }
  }, []);

  return (
    <div id="LoginBody">
      <NavBar />
      <div className="container">
        <div className="left">
          <img src={IMAGE} alt="Login visual" />
        </div>
        <div id="loginForm">
          <PageTitle />
          <Login />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
