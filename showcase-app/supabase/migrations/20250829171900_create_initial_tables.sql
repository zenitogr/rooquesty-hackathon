CREATE TABLE items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL,
    content_url text,
    text_content text,
    external_id text UNIQUE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE reactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id uuid REFERENCES items(id) ON DELETE CASCADE,
    user_id uuid,
    type text NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);