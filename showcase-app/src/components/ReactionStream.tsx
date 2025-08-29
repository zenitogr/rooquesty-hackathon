import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';

const ReactionStream = ({ itemId }: { itemId: string }) => {
  const [reactions, setReactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchReactions = async () => {
      const { data, error } = await supabase
        .from('reactions')
        .select('*')
        .eq('item_id', itemId);
      if (data) {
        setReactions(data);
      }
    };

    fetchReactions();

    const channel = supabase.channel(`reactions:${itemId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reactions', filter: `item_id=eq.${itemId}` }, (payload) => {
        setReactions((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [itemId]);

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Reactions</h3>
      <ul>
        {reactions.map((reaction) => (
          <li key={reaction.id} className="mb-2">
            {reaction.type === 'image' ? (
              <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/reaction_images/${reaction.content}`} alt="Reaction" className="max-w-xs" />
            ) : (
              reaction.content
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReactionStream;