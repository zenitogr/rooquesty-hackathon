"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { getCatMeme, getBabyYodaMemes, getDadJokes } from '@/lib/api';
import GridColumn from './GridColumn';
import MemeCard from './MemeCard';
import JokeCard from './JokeCard';

import { supabase } from '@/lib/supabase';

import FullscreenModal from './FullscreenModal';
import ReactionStream from './ReactionStream';
import ReactionInput from './ReactionInput';

const ShowcaseGrid = () => {
  const [items, setItems] = useState<any[]>([]);
  const [numCols, setNumCols] = useState(7);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: dbItems, error } = await supabase.from('items').select('*');

      if (dbItems && dbItems.length > 0) {
        setItems(dbItems);
      } else {
        const catMemes = await Promise.all([getCatMeme('Hello'), getCatMeme('World'), getCatMeme('LFG'), getCatMeme('Roo')]);
        const babyYodaMemes = await getBabyYodaMemes(4);
        const dadJokes = await getDadJokes(4);

        const allItems = [
          ...catMemes.map(url => ({ type: 'cat_meme', content_url: url })),
          ...babyYodaMemes.map((url: string) => ({ type: 'baby_yoda_meme', content_url: url })),
          ...dadJokes.map((joke: string) => ({ type: 'dad_joke', text_content: joke })),
        ].sort(() => Math.random() - 0.5);

        await supabase.from('items').insert(allItems);
        setItems(allItems);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const calculateNumCols = () => {
      const longestWord = items
        .filter(item => item.type === 'dad_joke')
        .reduce((longest: string, item: any) => {
          const words = item.text_content.split(' ');
          const currentLongest = words.reduce((l: string, w: string) => w.length > l.length ? w : l, '');
          return currentLongest.length > longest.length ? currentLongest : longest;
        }, '');

      const minWidth = longestWord.length * 10 + 48; // 10px per char + padding
      const newNumCols = Math.floor(window.innerWidth / minWidth);
      setNumCols(newNumCols > 0 ? newNumCols : 1);
    };

    calculateNumCols();
    window.addEventListener('resize', calculateNumCols);
    return () => window.removeEventListener('resize', calculateNumCols);
  }, [items]);

  const columns = useMemo(() => {
    const cols = Array.from({ length: numCols }, () => []) as any[][];
    items.forEach((item, i) => {
      cols[i % numCols].push(item);
    });
    return cols;
  }, [items, numCols]);

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className={`grid grid-cols-7 gap-2 ${selectedItem ? 'blur-sm' : ''}`}>
        {columns.map((col, i) => (
          <GridColumn key={i} msPerPixel={20 + i * 5} direction={i % 2 === 0 ? 'down' : 'up'}>
            {col.map((item, index) => (
              <div key={index} onClick={() => setSelectedItem(item)}>
                {item.type === 'cat_meme' || item.type === 'baby_yoda_meme' ? (
                  <MemeCard imageUrl={item.content_url} />
                ) : (
                  <JokeCard joke={item.text_content} />
                )}
              </div>
            ))}
          </GridColumn>
        ))}
      </div>
      <FullscreenModal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>
        {selectedItem && (
          <div>
            {selectedItem.type === 'cat_meme' || selectedItem.type === 'baby_yoda_meme' ? (
              <img src={selectedItem.content_url} alt="Meme" className="w-full h-auto max-h-[70vh] object-contain" />
            ) : (
              <div className="p-8 bg-zinc-900 rounded-lg">
                <p className="text-3xl text-white text-center">{selectedItem.text_content}</p>
              </div>
            )}
            <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
              <ReactionStream itemId={selectedItem.id} />
              <ReactionInput itemId={selectedItem.id} />
            </div>
          </div>
        )}
      </FullscreenModal>
    </div>
  );
};

export default ShowcaseGrid;