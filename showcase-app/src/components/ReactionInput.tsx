
import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

const ReactionInput = ({ itemId }: { itemId: string }) => {
  const [content, setContent] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setContent(prev => prev + emojiObject.emoji);
    setShowPicker(false);
  };


  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    let fileUrl = '';
    if (file) {
      const { data, error } = await supabase.storage
        .from('reaction_images')
        .upload(`${itemId}/${file.name}`, file);
      if (data) {
        fileUrl = data.path;
      }
    }

    await supabase.from('reactions').insert({
      item_id: itemId,
      type: file ? 'image' : 'text',
      content: file ? fileUrl : content,
    });

    setContent('');
    setFile(null);
  };

  return (
    <div className="mt-4 relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer text-2xl">
          📎
        </label>
        <input
          type="text"
          placeholder="Add a reaction..."
          className="flex-grow p-2 border rounded bg-zinc-700 text-white"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="button" onClick={() => setShowPicker(val => !val)} className="text-2xl">
          😊
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
      {showPicker && (
        <div className="absolute bottom-16 right-0 z-10">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default ReactionInput;