delete from public.menu_items
where category = 'meals';

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
    'ml-1',
    'دجاج مشوي',
    'Grilled Chicken Burger',
    'meals',
    18,
    580,
    '/menu/burgers/grilled-chicken.jpeg',
    null,
    true,
    400,
    now(),
    now()
  ),
  (
    'ml-2',
    'لحم مشوي',
    'Grilled Beef Burger',
    'meals',
    23,
    465,
    '/menu/burgers/grilled-beef.jpeg',
    null,
    true,
    401,
    now(),
    now()
  ),
  (
    'ml-3',
    'كرسبي',
    'Crispy Burger',
    'meals',
    16,
    480,
    '/menu/burgers/crispy.jpeg',
    null,
    true,
    402,
    now(),
    now()
  ),
  (
    'ml-4',
    'زنجر',
    'Zinger Burger',
    'meals',
    18,
    850,
    '/menu/burgers/zinger.jpeg',
    null,
    true,
    403,
    now(),
    now()
  ),
  (
    'ml-5',
    'دجاج مقلي',
    'Fried Chicken Burger',
    'meals',
    16,
    650,
    '/menu/burgers/fried-chicken.jpeg',
    null,
    true,
    404,
    now(),
    now()
  );
