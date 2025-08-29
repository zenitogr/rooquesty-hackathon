import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';

const ReactionInput = ({ itemId }: { itemId: string }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await supabase.from('reactions').insert({
      item_id: itemId,
      type: 'text',
      content,
    });

    setContent('');
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a reaction..."
        className="w-full p-2 border rounded bg-zinc-700 text-white"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  );
};

export default ReactionInput;