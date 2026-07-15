update public.menu_items
set
  "nameAr" = case id
    when 'ap-8' then 'مقبلات مشكلة'
    when 'sc-1' then 'صوص كوكتيل'
    when 'sc-3' then 'صوص ثوم'
    when 'sc-5' then 'صوص الديناميت'
    when 'sc-7' then 'جبنة شيدر'
    else "nameAr"
  end,
  "nameEn" = case id
    when 'sc-1' then 'Cocktail Sauce'
    when 'sc-5' then 'Dynamite Sauce'
    when 'sc-7' then 'Cheddar Cheese Sauce'
    else "nameEn"
  end,
  image = case id
    when 'ap-2' then '/menu/appetizers/french-fries.png'
    when 'ap-8' then '/menu/appetizers/mixed-appetizers.jpeg'
    when 'ap-5' then '/menu/appetizers/vine-leaves.jpeg'
    when 'ap-7' then '/menu/appetizers/mixed-appetizers.jpeg'
    when 'sc-1' then '/menu/sauces/cocktail-sauce.jpeg'
    when 'sc-2' then '/menu/sauces/hot-garlic-sauce.jpeg'
    when 'sc-3' then '/menu/sauces/garlic-sauce.jpeg'
    when 'sc-4' then '/menu/sauces/makolaty-sauce.jpeg'
    when 'sc-5' then '/menu/sauces/dynamite-sauce.jpeg'
    when 'sc-6' then '/menu/sauces/smoked-sauce.jpeg'
    when 'sc-7' then '/menu/sauces/cheese-sauce.jpeg'
    else image
  end,
  "updatedAt" = now()
where id in ('ap-2', 'ap-8', 'ap-7', 'ap-5', 'sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5', 'sc-6', 'sc-7');
