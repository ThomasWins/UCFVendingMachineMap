import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import AccountCreationPage from './pages/AccountCreationPage';
import HomePage from './pages/HomePage';
import Logout from './pages/LogoutPage';

function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/createAccount" element={<AccountCreationPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}
export default App;
