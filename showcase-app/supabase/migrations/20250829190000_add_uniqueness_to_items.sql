ALTER TABLE "public"."items" ADD CONSTRAINT "items_content_url_key" UNIQUE ("content_url");
ALTER TABLE "public"."items" ADD CONSTRAINT "items_text_content_key" UNIQUE ("text_content");