import React from 'react';
import Register from './Register'; // 确保路径正确

interface RegisterModalProps {
  show: boolean;
  toggleModal: () => void;
}

const RegisterModal = ({ show, toggleModal }: RegisterModalProps) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">注册</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={toggleModal}></button>
          </div>
          <div className="modal-body">
            <Register />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
