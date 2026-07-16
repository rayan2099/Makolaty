begin;

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
  "sortOrder",
  "createdAt",
  "updatedAt"
)
values (
  'pasta-extra-chicken',
  'اكسترا دجاج',
  'Extra Chicken',
  'pasta',
  5,
  null,
  '/menu/pasta/fettuccine.jpg',
  null,
  true,
  9999,
  now(),
  now()
)
on conflict (id) do update set
  "nameAr" = excluded."nameAr",
  "nameEn" = excluded."nameEn",
  category = excluded.category,
  price = excluded.price,
  image = excluded.image,
  "updatedAt" = now();

commit;
