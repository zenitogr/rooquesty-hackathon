import React from 'react';

interface MemeCardProps {
  imageUrl: string;
}

const MemeCard: React.FC<MemeCardProps> = ({ imageUrl }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <img src={imageUrl} alt="Meme" className="w-full" />
    </div>
  );
};

export default MemeCard;