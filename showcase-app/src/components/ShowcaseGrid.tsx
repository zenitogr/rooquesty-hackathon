"use client";
import React, { useEffect, useState } from 'react';
import { getCatMeme, getBabyYodaMeme, getDadJoke } from '@/lib/api';
import GridColumn from './GridColumn';
import MemeCard from './MemeCard';
import JokeCard from './JokeCard';

const ShowcaseGrid = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const catMeme1 = await getCatMeme('Hello');
      const catMeme2 = await getCatMeme('World');
      const babyYodaMeme = await getBabyYodaMeme();
      const dadJoke1 = await getDadJoke();
      const dadJoke2 = await getDadJoke();

      setItems([
        { type: 'cat_meme', content_url: catMeme1 },
        { type: 'dad_joke', text_content: dadJoke1 },
        { type: 'baby_yoda_meme', content_url: babyYodaMeme },
        { type: 'dad_joke', text_content: dadJoke2 },
        { type: 'cat_meme', content_url: catMeme2 },
      ]);
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Showcase Grid</h1>
      <div className="grid grid-cols-3 gap-4">
        <GridColumn>
          {items.slice(0, 2).map((item, index) =>
            item.type === 'cat_meme' || item.type === 'baby_yoda_meme' ? (
              <MemeCard key={index} imageUrl={item.content_url} />
            ) : (
              <JokeCard key={index} joke={item.text_content} />
            )
          )}
        </GridColumn>
        <GridColumn>
          {items.slice(2, 4).map((item, index) =>
            item.type === 'cat_meme' || item.type === 'baby_yoda_meme' ? (
              <MemeCard key={index} imageUrl={item.content_url} />
            ) : (
              <JokeCard key={index} joke={item.text_content} />
            )
          )}
        </GridColumn>
        <GridColumn>
          {items.slice(4, 5).map((item, index) =>
            item.type === 'cat_meme' || item.type === 'baby_yoda_meme' ? (
              <MemeCard key={index} imageUrl={item.content_url} />
            ) : (
              <JokeCard key={index} joke={item.text_content} />
            )
          )}
        </GridColumn>
      </div>
    </div>
  );
};

export default ShowcaseGrid;