import React, { useState } from 'react';
import RegisterModal from './RegisterModal';
import { useAuth } from '../context/AuthContext';

const AuthModalButton: React.FC = () => {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(prev => !prev);

  return (
    <>
      {user ? (
        <div className="user-info">
          <span className="user-name">{user.username}</span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <button className="btn btn-register" onClick={toggleModal}>
          Login / Register
        </button>
      )}
      {showModal && <RegisterModal show={showModal} toggleModal={toggleModal} />}
    </>
  );
};

export default AuthModalButton;
