import React, { forwardRef } from 'react';

interface JokeCardProps {
  joke: string;
}

const JokeCard = forwardRef<HTMLDivElement, JokeCardProps>(({ joke }, ref) => {
  return (
    <div ref={ref} className="rounded-lg overflow-hidden shadow-lg p-6 bg-zinc-800 text-white w-full">
      <p className="text-lg leading-relaxed break-words">{joke}</p>
    </div>
  );
});

JokeCard.displayName = 'JokeCard';

export default JokeCard;