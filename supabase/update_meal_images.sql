-- Update the live Supabase menu to use the bundled artwork for the meals category.
-- Run this once in the Supabase SQL editor after deploying the matching public files.
update public.menu_items
set image = case id
  when 'ml-1' then '/menu/meals/grilled-chicken-burger-meal.jpeg'
  when 'ml-2' then '/menu/meals/grilled-beef-burger-meal.jpeg'
  when 'ml-3' then '/menu/meals/classic-crispy-meal.jpeg'
  when 'ml-4' then '/menu/meals/zinger-burger-meal.jpeg'
  when 'ml-5' then '/menu/meals/fried-chicken-burger-meal.jpeg'
  when 'ml-6' then '/menu/meals/crispy-jumbo-meal.jpeg'
  when 'ml-7' then '/menu/meals/tortilla-meal.jpeg'
  when 'ml-8' then '/menu/meals/special-crispy-meal.jpeg'
  when 'ml-9' then '/menu/meals/classic-spicy-crispy-meal.jpeg'
  when 'ml-10' then '/menu/meals/caramel-beef-burger-meal.jpeg'
  when 'ml-11' then '/menu/meals/double-caramel-beef-burger-meal.jpeg'
  when 'ml-12' then '/menu/meals/double-grilled-beef-burger-meal.jpeg'
  when 'ml-13' then '/menu/meals/double-grilled-chicken-burger-meal.jpeg'
  when 'ml-14' then '/menu/meals/chicken-fajita-meal.jpeg'
  when 'ml-15' then '/menu/meals/roast-chicken-meal.jpeg'
  when 'ml-16' then '/menu/meals/chicken-rocket-meal.jpeg'
  else image
end,
"updatedAt" = now()
where id in (
  'ml-1', 'ml-2', 'ml-3', 'ml-4', 'ml-5', 'ml-6', 'ml-7', 'ml-8',
  'ml-9', 'ml-10', 'ml-11', 'ml-12', 'ml-13', 'ml-14', 'ml-15', 'ml-16'
);

-- Standalone burgers remain separate from combo meals.
update public.menu_items
set category = 'burgers',
    "updatedAt" = now()
where id in (
  'sw-5', 'sw-6', 'sw-7', 'sw-8', 'sw-9', 'sw-10',
  'sw-11', 'sw-12', 'sw-13', 'sw-14', 'sw-15'
);
