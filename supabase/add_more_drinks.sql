insert into public.menu_items (
  id,
  "nameAr",
  "nameEn",
  category,
  price,
  calories,
  image,
  sizes,
  "isAvailable",
  "sortOrder"
)
values
  ('dr-4', 'مونتن ديو', 'Mountain Dew', 'drinks', 3, 170, '/menu/drinks/mountain-dew-can.png', null, true, 40),
  ('dr-5', 'سفن أب', '7 Up', 'drinks', 3, 140, '/menu/drinks/7up-can.png', null, true, 50),
  ('dr-6', 'سفن أب زيرو', '7 Up Zero', 'drinks', 3, 0, '/menu/drinks/7up-zero-can.png', null, true, 60),
  ('dr-7', 'ميرندا حمضيات', 'Mirinda Citrus', 'drinks', 3, 150, '/menu/drinks/mirinda-citrus-can.png', null, true, 70)
on conflict (id) do update
set
  "nameAr" = excluded."nameAr",
  "nameEn" = excluded."nameEn",
  category = excluded.category,
  price = excluded.price,
  calories = excluded.calories,
  image = excluded.image,
  sizes = excluded.sizes,
  "isAvailable" = excluded."isAvailable",
  "sortOrder" = excluded."sortOrder",
  "updatedAt" = now();
