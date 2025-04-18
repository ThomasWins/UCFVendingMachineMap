import React, { useState } from 'react';
import PageTitle from '../components/PageTitle.tsx';
import Login from '../components/Login.tsx';
import IMAGE from '../assets/vendingmachinetrial.jpg';
import CreateAccount from '../components/CreateAccount.tsx';
import '../components/CSS/LoginPage.css';
import '../components/CSS/PageTitle.css';

const LoginPage = () => {

  return (
    <div id="LoginBody">
  <div className="container">
    <div className="left">
      <img src={IMAGE} alt="Login visual" />
    </div>
    <div id="loginForm">
      <PageTitle />
      <Login />
    </div>
  </div>
</div>
  );
  }
export default LoginPage;

