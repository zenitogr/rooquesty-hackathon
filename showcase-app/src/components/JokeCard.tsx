import React from 'react';

interface JokeCardProps {
  joke: string;
}

const JokeCard: React.FC<JokeCardProps> = ({ joke }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg p-4 bg-white">
      <p className="text-gray-800">{joke}</p>
    </div>
  );
};

export default JokeCard;