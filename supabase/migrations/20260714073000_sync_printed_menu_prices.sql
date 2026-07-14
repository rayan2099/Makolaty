-- Printed Makolaty menu price audit (2026-07-14).
-- The first value in each sizes array is the base price shown on item cards.

update public.menu_items
set price = 16, "updatedAt" = now()
where id = 'sh-2'; -- Shawarma Bazooka

update public.menu_items
set price = 20, "updatedAt" = now()
where id = 'sh-3'; -- Double Turkish Arabic Shawarma

update public.menu_items
set price = 23, "updatedAt" = now()
where id = 'ml-3'; -- Classic Crispy meal

update public.menu_items
set
  price = 16,
  sizes = '[{"name":"صغير","price":16},{"name":"وسط","price":27},{"name":"كبير","price":32}]'::jsonb,
  "updatedAt" = now()
where id = 'pz-1'; -- Special Shawarma Pizza

update public.menu_items
set
  price = 10,
  sizes = '[{"name":"صغير","price":10},{"name":"وسط","price":17},{"name":"كبير","price":23}]'::jsonb,
  "updatedAt" = now()
where id = 'pz-2'; -- Mixed Pizza

update public.menu_items
set price = 30, sizes = null, "updatedAt" = now()
where id = 'pt-12'; -- Mixed Pastries Plate

update public.menu_items
set
  price = 8,
  sizes = '[{"name":"صغير","price":8},{"name":"وسط","price":13},{"name":"كبير","price":18}]'::jsonb,
  "updatedAt" = now()
where id = 'pt-13'; -- Akkawi Cheese Pie

update public.menu_items
set price = 15, sizes = null, "updatedAt" = now()
where id = 'pt-14'; -- Shawarma and Cheese Pie

update public.menu_items
set
  price = 18,
  sizes = '[{"name":"عادي","price":18},{"name":"حراق","price":18}]'::jsonb,
  "updatedAt" = now()
where id = 'broast-chicken';

update public.menu_items
set price = 18, sizes = null, "updatedAt" = now()
where id = 'broast-nuggets-regular';

update public.menu_items
set price = 18, sizes = null, "updatedAt" = now()
where id = 'broast-nuggets-spicy';
