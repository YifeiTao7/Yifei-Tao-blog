import React, { useState } from 'react';
import RegisterModal from './RegisterModal'; // 确保路径正确

const AuthModalButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  const toggleModal = () => setShowModal(!showModal);

  const handleLoginSuccess = (username: string) => {
    console.log('Logged in as:', username); // 添加日志
    setIsAuthenticated(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <>
      {isAuthenticated ? (
         <div className="user-info">
         <span className="user-name">{username}</span>
         <button onClick={handleLogout} className="logout-btn">Logout</button>
       </div>
      ) : (
        <button onClick={toggleModal} className="btn btn-register">Login / Register</button>
      )}
      <RegisterModal show={showModal} toggleModal={toggleModal} onLoginSuccess={handleLoginSuccess} />
    </>
  );
};

export default AuthModalButton;
