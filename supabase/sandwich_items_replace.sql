delete from public.menu_items
where category = 'sandwiches';

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
) values
  (
    'sw-1',
    'فاهيتا',
    'Fajita Sandwich',
    'sandwiches',
    12,
    850,
    '/menu/sandwiches/fajita.jpg',
    null,
    true,
    500,
    now(),
    now()
  ),
  (
    'sw-2',
    'روست دجاج',
    'Roast Chicken Sandwich',
    'sandwiches',
    10,
    433,
    '/menu/sandwiches/roast-chicken.jpg',
    null,
    true,
    501,
    now(),
    now()
  ),
  (
    'sw-3',
    'كرسبي جامبو',
    'Jumbo Crispy Sandwich',
    'sandwiches',
    12,
    2033,
    '/menu/sandwiches/jumbo-crispy.jpg',
    null,
    true,
    502,
    now(),
    now()
  );
