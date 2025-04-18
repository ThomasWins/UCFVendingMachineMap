import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        // Handle unauthorized access
        const errorData = await response.json();
        setMessage(errorData.error || 'User/Password combination incorrect');
        return;
      }
  
      if (!response.ok) {
        // Handle other potential errors
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }
  
      const res = await response.json();
  
      if (res.success) {
        const user = {
          firstName: res.user.firstName,
          lastName: res.user.lastName,
          id: res.user.userId // Ensure this matches the field name returned by your backend
        };
  
        localStorage.setItem('user_data', JSON.stringify(user));
        setMessage('');
        navigate('/home');
      } else {
        setMessage('An unexpected error occurred.');
      }
    } catch (error) {
      console.error('Login error:', error); // Debugging line
      setMessage(error.message || 'An error occurred during login. Please try again.');
    }
  }
  const sendToSignup = () => {
    navigate('/createAccount');
  };

  return (
    <div id="loginDiv">
      <a href="./home" id="createAccount">TEMP Home Page</a>
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
      <button id="loginButton" className="signUpButton" onClick={sendToSignup}>
        Sign Up
      </button>
      <span id="loginResult">{message}</span>
    </div>
  );
}

export default Login;
