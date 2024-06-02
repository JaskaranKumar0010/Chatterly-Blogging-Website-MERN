import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LogInPrompt.css';

const LogInPrompt = ({ onClose }) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleLogIn = () => {
    navigate('/login');
  };

  return (
    <div className="signup-prompt-overlay">
      <div className="signup-prompt">
        <h2>Please Log In or Sign Up </h2>
        <p>You need to log in or sign up to access all services.</p>
        <div className="signup-prompt-buttons">
          <button onClick={handleLogIn}>Log In</button>
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LogInPrompt;
