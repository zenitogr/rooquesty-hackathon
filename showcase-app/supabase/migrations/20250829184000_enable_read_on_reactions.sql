CREATE POLICY "Enable read access for all users" ON "public"."reactions"
AS PERMISSIVE FOR SELECT
TO public
USING (true);