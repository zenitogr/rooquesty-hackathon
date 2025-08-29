import React from 'react';

interface MemeCardProps {
  imageUrl: string;
}

const MemeCard: React.FC<MemeCardProps> = ({ imageUrl }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-card transition-all duration-300 hover:shadow-2xl hover:border-accent border-2 border-transparent">
      <img src={imageUrl} alt="Meme" className="w-full h-auto object-cover aspect-square" />
    </div>
  );
};

export default MemeCard;