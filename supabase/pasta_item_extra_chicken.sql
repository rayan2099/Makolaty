begin;

alter table public.menu_items
add column if not exists "allowExtraChicken" boolean not null default true;

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
  "allowExtraChicken",
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
  true,
  9999,
  now(),
  now()
)
on conflict (id) do update set
  "nameAr" = excluded."nameAr",
  "nameEn" = excluded."nameEn",
  category = excluded.category,
  "isAvailable" = true,
  "updatedAt" = now();

commit;
