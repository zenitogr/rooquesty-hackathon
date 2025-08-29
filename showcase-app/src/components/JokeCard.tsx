import React, { forwardRef } from 'react';

interface JokeCardProps {
  joke: string;
}

const JokeCard = forwardRef<HTMLDivElement, JokeCardProps>(({ joke }, ref) => {
  return (
    <div ref={ref} className="rounded-lg overflow-hidden shadow-lg p-6 bg-card text-card-foreground w-full transition-all duration-300 hover:shadow-2xl hover:border-accent border-2 border-transparent">
      <p className="text-lg leading-relaxed break-words">{joke}</p>
    </div>
  );
});

JokeCard.displayName = 'JokeCard';

export default JokeCard;