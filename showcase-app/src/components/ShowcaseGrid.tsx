"use client";
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { getCategorizedMemes, getDadJokes } from '@/lib/api';
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
  const loadingRef = useRef(false);
  const [numCols, setNumCols] = useState(1);
  
  const existingUrlsRef = useRef(new Set<string>());
  const existingJokesRef = useRef(new Set<string>());

  const loadMoreItems = useCallback(async (direction: 'up' | 'down' = 'down') => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      const imgflipMemes = await getCategorizedMemes(15, existingUrlsRef.current);
      const dadJokes = await getDadJokes(10, existingJokesRef.current);

      const newItems = [
        ...imgflipMemes.map((url: string) => ({ type: 'meme', content_url: url })),
        ...dadJokes.map((joke: string) => ({ type: 'dad_joke', text_content: joke })),
      ].filter(Boolean);

      const uniqueNewItems = newItems.filter(item => {
        const key = (item as any).content_url || (item as any).text_content;
        if ((item as any).content_url) {
          if (existingUrlsRef.current.has(key)) return false;
          existingUrlsRef.current.add(key);
        } else {
          if (existingJokesRef.current.has(key)) return false;
          existingJokesRef.current.add(key);
        }
        return true;
      });

      if (uniqueNewItems.length > 0) {
        const { data: insertedItems, error } = await supabase.from('items').upsert(uniqueNewItems, { onConflict: 'content_url, text_content' }).select();
        if (insertedItems) {
            setItems(prevItems => {
                const newItemsMap = new Map(prevItems.map(i => [i.id, i]));
                insertedItems.forEach(i => newItemsMap.set(i.id, i));
                const allItems = Array.from(newItemsMap.values());
                return direction === 'up' ? [...insertedItems, ...prevItems] : [...prevItems, ...insertedItems];
            });
        }
      }
    } finally {
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const initialLoad = async () => {
      const { data: dbItems } = await supabase.from('items').select('*').limit(50);
      
      let currentItems = dbItems || [];

      currentItems.forEach(item => {
        if (item.content_url) existingUrlsRef.current.add(item.content_url);
        if (item.text_content) existingJokesRef.current.add(item.text_content);
      });
      
      setItems(currentItems);
      
      if (currentItems.length < 50) {
        loadMoreItems();
      }

    };
    initialLoad();
  }, [loadMoreItems]);

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
    if (numCols === 0) return [];
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
          <GridColumn key={i} onLoadMore={(dir) => loadMoreItems(dir)} direction={i % 2 === 0 ? 'down' : 'up'}>
            {col.map((item) => (
              <div key={item.id} onClick={() => setSelectedItem(item)}>
                {item.type === 'meme' ? (
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
            {selectedItem.type === 'meme' ? (
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