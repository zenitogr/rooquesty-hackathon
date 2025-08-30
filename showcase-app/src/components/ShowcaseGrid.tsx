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
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: dbItems, error } = await supabase.from('items').select('*');

      let currentItems = dbItems || [];

      if (currentItems.length < 20) {
        const existingUrls = new Set(currentItems.map(i => i.content_url).filter(Boolean));
        const existingJokes = new Set(currentItems.map(i => i.text_content).filter(Boolean));

        const newCatPromises = [];
        for(let i=0; i<5; i++) newCatPromises.push(getCatMeme(existingUrls));
        const catMemes = await Promise.all(newCatPromises);

        const babyYodaMemes = await getBabyYodaMemes(10, existingUrls);
        const dadJokes = await getDadJokes(10, existingJokes);

        const newItems = [
          ...catMemes.map((url: string) => ({ type: 'cat_meme', content_url: url })),
          ...babyYodaMemes.map((url: string) => ({ type: 'baby_yoda_meme', content_url: url })),
          ...dadJokes.map((joke: string) => ({ type: 'dad_joke', text_content: joke })),
        ];
        
        const uniqueNewItems = Array.from(new Map(newItems.map(item => [(item as any).content_url || (item as any).text_content, item])).values());

        const itemsToInsert = uniqueNewItems.filter(item =>
          (item as any).content_url
            ? !existingUrls.has((item as any).content_url)
            : !existingJokes.has((item as any).text_content)
        );

        if (itemsToInsert.length > 0) {
          await supabase.from('items').insert(itemsToInsert);
          const { data: newDbItems } = await supabase.from('items').select('*');
          currentItems = newDbItems || [];
        }
      }
      
      const uniqueItems = Array.from(new Map(currentItems.map(item => [item.content_url || item.text_content, item])).values());
      setItems(uniqueItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    };

    fetchData();
  }, []);

  const [numCols, setNumCols] = useState(1);

  useEffect(() => {
    const calculateNumCols = () => {
      const newNumCols = Math.floor(window.innerWidth / 320);
      setNumCols(newNumCols > 0 ? newNumCols : 1);
    };

    calculateNumCols();
    window.addEventListener('resize', calculateNumCols);
    return () => window.removeEventListener('resize', calculateNumCols);
  }, []);

  const columns = useMemo(() => {
    if (numCols === 0) {
      return [];
    }
    const cols = Array.from({ length: numCols }, () => []) as any[][];
    items.forEach((item, i) => {
      cols[i % numCols].push(item);
    });
    return cols;
  }, [items, numCols]);

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className={`grid grid-cols-auto-fit-300 gap-2 ${selectedItem ? 'blur-sm' : ''}`}>
        {columns.map((col, i) => (
          <GridColumn key={i} msPerPixel={20 + (i % 3) * 5} direction={i % 2 === 0 ? 'down' : 'up'}>
            {col.map((item) => (
              <div key={item.id} onClick={() => setSelectedItem(item)}>
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