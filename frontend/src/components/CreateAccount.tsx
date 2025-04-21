import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Login.css';

function Register() {
  const [message, setMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const navigate = useNavigate();

  async function doCreateAccount(event: React.FormEvent) {
    event.preventDefault();

    if (loginPassword !== confPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    if (loginPassword.length < 6) {
      setMessage('Password has to be 6 characters or longer.');
      return;
    }

    const obj = {
    firstName,
    lastName,
    login: loginName,
    password: loginPassword
    };

    const js = JSON.stringify(obj);

    try {
      const response = await fetch('/api/users/register', { // New API endpoint 
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' }
      });

      const res = await response.json();

      if (res.error) {
        setMessage(res.error);
      } else {
        const user = {
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.id
        };
        localStorage.setItem('user_data', JSON.stringify(user));
        setMessage('');
        navigate('/home'); // Set to home page later (wherever we want new user directed)
      }
    } catch (error) {
      alert(error.toString());
    }
  }
  const sendToLogin = () => {
    navigate('../');
  };

  return (
    <div id="createDiv">
      <span id="inner-title">CREATE AN ACCOUNT</span><br />
      <input
      type="text"
      id="firstName"
      placeholder="First Name"
      onChange={(e) => setFirstName(e.target.value)}
      /><br />
      
      <input
      type="text"
      id="lastName"
      placeholder="Last Name"
      onChange={(e) => setLastName(e.target.value)}
      /><br />

      <input
        type="text"
        id="loginName"
        placeholder="Username"
        onChange={(e) => setLoginName(e.target.value)}
      /><br />
      
      <input
        type="password"
        id="loginPassword"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <input
        type="password"
        id="confirmPassword"
        placeholder="Confirm Password"
        onChange={(e) => setConfPassword(e.target.value)}
      /><br />
      <input
        type="submit"
        id="createAccountButton"
        className="buttons"
        value="Create Account"
        onClick={doCreateAccount}  // implement this backend
      />
      <Link to="/" id="myLink> Already have an account? Log in </Link >
        
      <span id="loginResult">{message}</span>
      

    </div>
  );
}

export default Register;
