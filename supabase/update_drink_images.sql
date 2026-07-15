update public.menu_items
set
  image = '/menu/drinks/pepsi-can.png',
  "updatedAt" = now()
where id = 'dr-1';

update public.menu_items
set
  image = '/menu/drinks/rabeea-orange.png',
  "updatedAt" = now()
where id = 'dr-2';

update public.menu_items
set
  image = '/menu/drinks/water.svg',
  "updatedAt" = now()
where id = 'dr-3';
