insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'menu-images',
  'menu-images',
  true,
  12582912,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can read menu images" on storage.objects;
create policy "Anyone can read menu images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'menu-images');

drop policy if exists "Staff dashboard can upload menu images" on storage.objects;
create policy "Staff dashboard can upload menu images"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'menu-images');

drop policy if exists "Staff dashboard can update menu images" on storage.objects;
create policy "Staff dashboard can update menu images"
on storage.objects
for update
to anon, authenticated
using (bucket_id = 'menu-images')
with check (bucket_id = 'menu-images');

drop policy if exists "Staff dashboard can delete menu images" on storage.objects;
create policy "Staff dashboard can delete menu images"
on storage.objects
for delete
to anon, authenticated
using (bucket_id = 'menu-images');
