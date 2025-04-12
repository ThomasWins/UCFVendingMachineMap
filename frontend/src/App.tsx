import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import AccountCreationPage from './pages/AccountCreationPage';
import HomePage from 'pages/HomePage';

function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/CreateAccount" element={<AccountCreationPage />} />
        <Route path="/Home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}
export default App;
