// AuthModalButton.tsx
import React, { useState } from 'react';
import RegisterModal from './RegisterModal';
import { useAuth } from '../context/AuthContext';

// Define the type for the component's props
interface AuthModalButtonProps {
  isMessageBoard?: boolean; // This prop is optional
}

const AuthModalButton: React.FC<AuthModalButtonProps> = ({ isMessageBoard = false }) => {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const btnClass = isMessageBoard ? "btn-register-message-board" : "btn-register";

  return (
    <>
      {user ? (
        <div className="user-info">
          <span className="user-name">{user.username}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      ) : (
        <button onClick={toggleModal} className={`btn ${btnClass}`}>Login / Register</button>
      )}
      <RegisterModal show={showModal} toggleModal={toggleModal} />
    </>
  );
};

export default AuthModalButton;
