import React from 'react';

interface MemeCardProps {
  imageUrl: string;
}

const MemeCard: React.FC<MemeCardProps> = ({ imageUrl }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-zinc-800">
      <img src={imageUrl} alt="Meme" className="w-full h-auto object-cover aspect-square" />
    </div>
  );
};

export default MemeCard;