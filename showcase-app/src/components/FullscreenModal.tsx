import React from 'react';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-4 rounded-lg max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white">Close</button>
        {children}
      </div>
    </div>
  );
};

export default FullscreenModal;