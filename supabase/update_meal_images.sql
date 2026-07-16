-- Add every supplied combo to the live وجبات category.
-- This inserts missing rows and refreshes existing rows without changing availability.
begin;

insert into public.menu_items (
  id, "nameAr", "nameEn", category, price, calories, image, sizes,
  "isAvailable", "sortOrder", "createdAt", "updatedAt"
) values
  ('ml-1',  'وجبة برجر دجاج مشوي',       'Grilled Chicken Burger Meal',       'meals', 18,  580,  '/menu/meals/grilled-chicken-burger-meal.jpeg',        null, true, 300, now(), now()),
  ('ml-2',  'وجبة برجر لحم مشوي',        'Grilled Beef Burger Meal',          'meals', 23,  465,  '/menu/meals/grilled-beef-burger-meal.jpeg',           null, true, 301, now(), now()),
  ('ml-3',  'وجبة كلاسيك كرسبي',         'Classic Crispy Meal',               'meals', 23,  480,  '/menu/meals/classic-crispy-meal.jpeg',                null, true, 302, now(), now()),
  ('ml-4',  'وجبة زنجر برجر',            'Zinger Burger Meal',                'meals', 18,  850,  '/menu/meals/zinger-burger-meal.jpeg',                 null, true, 303, now(), now()),
  ('ml-5',  'وجبة برجر دجاج',            'Chicken Burger Meal',               'meals', 16,  300,  '/menu/meals/fried-chicken-burger-meal.jpeg',          null, true, 304, now(), now()),
  ('ml-6',  'وجبة كرسبي جامبو',          'Crispy Jumbo Meal',                 'meals', 20, 2033,  '/menu/meals/crispy-jumbo-meal.jpeg',                  null, true, 305, now(), now()),
  ('ml-7',  'وجبة ساندويتش تورتيلا',     'Tortilla Sandwich Meal',            'meals', 20,  800,  '/menu/meals/tortilla-meal.jpeg',                      null, true, 306, now(), now()),
  ('ml-8',  'وجبة سبيشل كرسبي',          'Special Crispy Meal',               'meals', 23,  480,  '/menu/meals/special-crispy-meal.jpeg',                null, true, 307, now(), now()),
  ('ml-9',  'وجبة كلاسيك كرسبي حراق',    'Classic Spicy Crispy Meal',         'meals', 23,  480,  '/menu/meals/classic-spicy-crispy-meal.jpeg',          null, true, 308, now(), now()),
  ('ml-10', 'وجبة برجر لحم كراميل',      'Caramel Beef Burger Meal',          'meals', 23,  460,  '/menu/meals/caramel-beef-burger-meal.jpeg',           null, true, 309, now(), now()),
  ('ml-11', 'وجبة برجر لحم كراميل دبل',  'Double Caramel Beef Burger Meal',   'meals', 33,  720,  '/menu/meals/double-caramel-beef-burger-meal.jpeg',    null, true, 310, now(), now()),
  ('ml-12', 'وجبة برجر لحم مشوي دبل',    'Double Grilled Beef Burger Meal',   'meals', 33,  660,  '/menu/meals/double-grilled-beef-burger-meal.jpeg',    null, true, 311, now(), now()),
  ('ml-13', 'وجبة برجر دجاج مشوي دبل',   'Double Grilled Chicken Burger Meal','meals', 26,  470,  '/menu/meals/double-grilled-chicken-burger-meal.jpeg', null, true, 312, now(), now()),
  ('ml-14', 'وجبة فاهيتا دجاج',          'Chicken Fajita Meal',               'meals', 20,  850,  '/menu/meals/chicken-fajita-meal.jpeg',                null, true, 313, now(), now()),
  ('ml-15', 'وجبة روست دجاج',            'Roast Chicken Meal',                'meals', 18,  630,  '/menu/meals/roast-chicken-meal.jpeg',                 null, true, 314, now(), now()),
  ('ml-16', 'وجبة صاروخ دجاج',           'Chicken Rocket Meal',               'meals', 18,  850,  '/menu/meals/chicken-rocket-meal.jpeg',                null, true, 315, now(), now())
on conflict (id) do update set
  "nameAr" = excluded."nameAr",
  "nameEn" = excluded."nameEn",
  category = excluded.category,
  price = excluded.price,
  calories = excluded.calories,
  image = excluded.image,
  sizes = excluded.sizes,
  "sortOrder" = excluded."sortOrder",
  "updatedAt" = now();

commit;
