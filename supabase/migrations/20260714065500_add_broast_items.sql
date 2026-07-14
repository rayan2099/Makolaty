delete from public.menu_items
where category = 'broast'
  and id not in ('broast-chicken', 'broast-nuggets-regular', 'broast-nuggets-spicy')
  and (
    "nameAr" in ('بروست دجاج', 'مسحب')
    or lower("nameEn") in (
      'chicken broast',
      'broast chicken',
      'chicken strips',
      'regular chicken strips',
      'spicy chicken strips',
      'chicken nuggets'
    )
  );

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
  "updatedAt"
)
values
  (
    'broast-chicken',
    'بروست دجاج',
    'Chicken Broast',
    'broast',
    20,
    650,
    '/menu/broast/chicken-broast.jpeg',
    '[{"name":"عادي","price":20},{"name":"كبير","price":25}]'::jsonb,
    true,
    800,
    now()
  ),
  (
    'broast-nuggets-regular',
    'مسحب عادي',
    'Regular Chicken Nuggets',
    'broast',
    20,
    650,
    '/menu/broast/chicken-nuggets.jpeg',
    null,
    true,
    801,
    now()
  ),
  (
    'broast-nuggets-spicy',
    'مسحب حراق',
    'Spicy Chicken Nuggets',
    'broast',
    20,
    650,
    '/menu/broast/chicken-nuggets.jpeg',
    null,
    true,
    802,
    now()
  )
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
