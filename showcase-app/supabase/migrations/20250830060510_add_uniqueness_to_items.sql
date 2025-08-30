ALTER TABLE public.items
ADD CONSTRAINT items_content_uniqueness UNIQUE (content_url, text_content);