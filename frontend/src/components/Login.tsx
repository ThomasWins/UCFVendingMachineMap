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

      // Catch unauthorized access
      if (response.status === 401) {
        const errorData = await response.json();
        setMessage(errorData.error || 'User/Password combination incorrect');
        return;
      }

      // Catch other possible errors
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const res = await response.json();

      if (res.success) {
        const user = {
          firstName: res.user.firstName,
          lastName: res.user.lastName,
          id: res.user.userId
        };

        localStorage.setItem('user_data', JSON.stringify(user));
        setMessage('');
        navigate('/cards');
      } else {
        setMessage('An unexpected error occurred.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An error occurred during login. Please try again.');
    }
  }

  return (
    <div id="loginDiv">
      <a href="./Home" id="createAccount">TEMP Home Page</a>
      <span id="inner-title">PLEASE LOG IN</span><br />
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
      <a href="./CreateAccount" id="createAccount">Sign Up</a>
      <span id="loginResult">{message}</span>
    </div>
  );
}

export default Login;
