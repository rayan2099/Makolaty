update public.menu_items
set
  price = 5,
  sizes = '[{"name":"الحبة","price":5},{"name":"صحن مشكل","price":30}]'::jsonb,
  "updatedAt" = now()
where id = 'pt-12';

insert into public.menu_items (
  id, "nameAr", "nameEn", category, price, image, sizes,
  "isAvailable", "sortOrder", "updatedAt"
)
values
  (
    'pt-15', 'جبن عسل', 'Cheese and Honey', 'pastries', 9, '',
    '[{"name":"صغير","price":9},{"name":"وسط","price":16},{"name":"كبير","price":22}]'::jsonb,
    true, 815, now()
  ),
  (
    'pt-16', 'لبنة بالعسل', 'Labaneh with Honey', 'pastries', 9, '',
    '[{"name":"صغير","price":9},{"name":"وسط","price":16},{"name":"كبير","price":22}]'::jsonb,
    true, 816, now()
  )
on conflict (id) do update
set
  "nameAr" = excluded."nameAr",
  "nameEn" = excluded."nameEn",
  category = excluded.category,
  price = excluded.price,
  image = excluded.image,
  sizes = excluded.sizes,
  "isAvailable" = true,
  "sortOrder" = excluded."sortOrder",
  "updatedAt" = now();
