update public.menu_items
set
  price = 3,
  calories = 150,
  sizes = jsonb_build_array(
    jsonb_build_object('name', 'صغير', 'price', 3, 'calories', 150),
    jsonb_build_object('name', 'وسط', 'price', 5),
    jsonb_build_object('name', 'كبير', 'price', 9)
  ),
  "updatedAt" = now()
where id = 'dr-1';
