update public.menu_items
set
  image = '/menu/drinks/pepsi-bottle-v2.png',
  price = 3,
  calories = 150,
  sizes = jsonb_build_array(
    jsonb_build_object('name', 'صغير', 'price', 3, 'calories', 150),
    jsonb_build_object('name', 'وسط', 'price', 5),
    jsonb_build_object('name', 'كبير', 'price', 9)
  ),
  "updatedAt" = now()
where id = 'dr-1';

update public.menu_items
set
  image = '/menu/drinks/rabeea-orange-v2.png',
  "updatedAt" = now()
where id = 'dr-2';

update public.menu_items
set
  image = '/menu/drinks/water-bottle-v2.png',
  "updatedAt" = now()
where id = 'dr-3';
