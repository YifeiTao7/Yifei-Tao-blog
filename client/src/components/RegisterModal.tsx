import React from 'react';
import Auth from './Auth'; // 确保路径正确

interface RegisterModalProps {
  show: boolean;
  toggleModal: () => void;
}

const RegisterModal = ({ show, toggleModal }: RegisterModalProps) => {
  if (!show) return null;

  return (
    <div className="modal show" tabIndex={-1} style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Login / Register</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={toggleModal}></button>
          </div>
          <div className="modal-body">
            <Auth toggleModal={toggleModal} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
