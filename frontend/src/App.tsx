import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import AccountCreationPage from './pages/AccountCreationPage';
import HomePage from './pages/HomePage';
import Logout from './pages/LogoutPage';
import TheGoat from './pages/TheGoatPage';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import ContributionsPage from './pages/ContributionsPage';
import RatingsPage from './pages/RatingsPage';

function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/createAccount" element={<AccountCreationPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/secret" element={<TheGoat />} />
        <Route path="/admin" element={<AdminPage/>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/contributions" element={<ContributionsPage />} />
        <Route path="/profile/ratings" element={<RatingsPage />} />
      </Routes>
    </Router>
  );
}
export default App;
