"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { getCatMeme, getBabyYodaMemes, getDadJokes } from '@/lib/api';
import GridColumn from './GridColumn';
import MemeCard from './MemeCard';
import JokeCard from './JokeCard';

const ShowcaseGrid = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const catMemes = await Promise.all([getCatMeme('Hello'), getCatMeme('World'), getCatMeme('LFG'), getCatMeme('Roo')]);
      const babyYodaMemes = await getBabyYodaMemes(4);
      const dadJokes = await getDadJokes(4);

      const allItems = [
        ...catMemes.map(url => ({ type: 'cat_meme', content_url: url })),
        ...babyYodaMemes.map((url: string) => ({ type: 'baby_yoda_meme', content_url: url })),
        ...dadJokes.map((joke: string) => ({ type: 'dad_joke', text_content: joke })),
      ].sort(() => Math.random() - 0.5);

      setItems(allItems);
    };

    fetchData();
  }, []);

  const columns = useMemo(() => {
    const cols = [[], [], []] as any[][];
    items.forEach((item, i) => {
      cols[i % 3].push(item);
    });
    return cols;
  }, [items]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Showcase Grid</h1>
      <div className="grid grid-cols-5 gap-4">
        {columns.map((col, i) => (
          <GridColumn key={i} msPerPixel={20 + i * 5} direction={i % 2 === 0 ? 'down' : 'up'}>
            {col.map((item, index) =>
              item.type === 'cat_meme' || item.type === 'baby_yoda_meme' ? (
                <MemeCard key={index} imageUrl={item.content_url} />
              ) : (
                <JokeCard key={index} joke={item.text_content} />
              )
            )}
          </GridColumn>
        ))}
      </div>
    </div>
  );
};

export default ShowcaseGrid;