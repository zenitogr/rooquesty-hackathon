import React from 'react';

interface JokeCardProps {
  joke: string;
}

const JokeCard: React.FC<JokeCardProps> = ({ joke }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg p-6 bg-zinc-800 text-white">
      <p className="text-lg leading-relaxed">{joke}</p>
    </div>
  );
};

export default JokeCard;