update public.menu_items
set image = '/menu/appetizers/french-fries.png',
    "updatedAt" = now()
where id = 'ap-2';

update public.menu_items
set image = '/menu/appetizers/vine-leaves.jpeg',
    "updatedAt" = now()
where id = 'ap-5';

update public.menu_items
set image = '/menu/appetizers/mixed-appetizers.jpeg',
    "updatedAt" = now()
where id in ('ap-7', 'ap-8', 'ap-9');

update public.menu_items
set image = '/menu/appetizers/onion-rings.jpeg',
    "updatedAt" = now()
where id = 'ap-9';

update public.menu_items
set "nameAr" = 'مقبلات مشكلة',
    "updatedAt" = now()
where id = 'ap-8';

update public.menu_items
set "nameAr" = 'صوص كوكتيل',
    "nameEn" = 'Cocktail Sauce',
    image = '/menu/sauces/cocktail-sauce.jpeg',
    "updatedAt" = now()
where id = 'sc-1';

update public.menu_items
set image = '/menu/sauces/hot-garlic-sauce.jpeg',
    "updatedAt" = now()
where id = 'sc-2';

update public.menu_items
set "nameAr" = 'صوص ثوم',
    image = '/menu/sauces/garlic-sauce.jpeg',
    "updatedAt" = now()
where id = 'sc-3';

update public.menu_items
set image = '/menu/sauces/makolaty-sauce.jpeg',
    "updatedAt" = now()
where id = 'sc-4';

update public.menu_items
set "nameAr" = 'صوص الديناميت',
    "nameEn" = 'Dynamite Sauce',
    image = '/menu/sauces/dynamite-sauce.jpeg',
    "updatedAt" = now()
where id = 'sc-5';

update public.menu_items
set image = '/menu/sauces/smoked-sauce.jpeg',
    "updatedAt" = now()
where id = 'sc-6';

update public.menu_items
set "nameAr" = 'جبنة شيدر',
    "nameEn" = 'Cheddar Cheese Sauce',
    image = '/menu/sauces/cheese-sauce.jpeg',
    "updatedAt" = now()
where id = 'sc-7';
