delete from public.menu_items
where image is null or btrim(image) = '';
