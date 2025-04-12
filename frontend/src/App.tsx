import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage'
import AccountCreationPage from './pages/AccountCreationPage';

function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/CreateAccount" element={<AccountCreationPage />} />
      </Routes>
    </Router>
  );
}
export default App;
