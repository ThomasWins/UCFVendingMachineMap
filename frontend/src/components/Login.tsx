import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './CSS/Login.css';

function Login() {
  const [message, setMessage] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setPassword] = useState('');
  const navigate = useNavigate();

async function doLogin(event: React.FormEvent) {
  event.preventDefault();

  const obj = { login: loginName, password: loginPassword };
  const js = JSON.stringify(obj);

  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: js,
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 401) {
      const errorData = await response.json();
      setMessage(errorData.error || 'User/Password combination incorrect');
      return;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Network response was not ok');
    }

    const res = await response.json();

    if (res.success) {
      // Store the entire user object in localStorage
      localStorage.setItem('user_data', JSON.stringify(res.user));
      
      setMessage('');
      navigate('/home');
    } else {
      setMessage('An unexpected error occurred.');
    }
  } catch (error) {
    console.error('Login error:', error);
    setMessage(error.message || 'An error occurred during login. Please try again.');
  }
}

  const sendToSignup = () => {
    navigate('/createAccount');
  };

  return (
    <div id="loginDiv">
      <span id="inner-title">LOG IN</span><br />
      <form onSubmit={doLogin}>
        <input
          type="text"
          id="loginName"
          placeholder="Username"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
        /><br />
        <input
          type="password"
          id="loginPassword"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setPassword(e.target.value)}
          
        />
        <input
          type="submit"
          id="loginButton"
          className="buttons"
          value="Login"
        />
      </form>
      <Link to="/createAccount">Sign Up</Link>
        Sign Up
      </button>
      <span id="loginResult">{message}</span>
    </div>
  );
}

export default Login;
