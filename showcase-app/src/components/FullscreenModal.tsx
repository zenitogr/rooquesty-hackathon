import React from 'react';
import ReactionColumn from './ReactionColumn';
import ReactionStream from './ReactionStream';
import ReactionInput from './ReactionInput';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactElement & { props: { itemId: string } };
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card rounded-lg max-w-6xl w-full h-[90vh] flex overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white z-20">Close</button>
        <div className="w-2/3 flex items-center justify-center bg-zinc-900 p-4">
          {children}
        </div>
        <div className="w-1/3 p-4 flex flex-col bg-zinc-800">
          <h3 className="text-2xl font-bold mb-4 text-white">Reactions</h3>
          <div className="flex-grow overflow-y-auto">
            <ReactionStream itemId={children.props.itemId} />
          </div>
          <ReactionInput itemId={children.props.itemId} />
        </div>
      </div>
    </div>
  );
};

export default FullscreenModal;