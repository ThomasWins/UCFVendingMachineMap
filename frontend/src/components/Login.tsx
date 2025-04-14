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
      const response = await fetch('/api/login', {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' }
      });

      const res = await response.json();

      if (res.id <= 0) {
        setMessage('User/Password combination incorrect');
      } else {
        const user = {
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.id
        };
        localStorage.setItem('user_data', JSON.stringify(user));
        setMessage('');
        navigate('/cards');
      }
    } catch (error) {
      alert(error.toString());
    }
  }

  return (
    <div id="loginDiv">
      <span id="inner-title">PLEASE LOG IN</span><br />
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
      />
      <input
        type="submit"
        id="loginButton"
        className="buttons"
        value="Login"
        onClick={doLogin}
      />
      <a href="../pages/AccountCreationPage.tsx" id="createAccount">Sign Up</a>
      <span id="loginResult">{message}</span>
    </div>
  );
}

export default Login;
