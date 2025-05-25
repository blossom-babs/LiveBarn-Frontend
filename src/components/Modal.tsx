import React from "react";


type ModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ visible, onClose, children }: ModalProps) => {
  if (!visible) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
