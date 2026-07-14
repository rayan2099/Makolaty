create or replace function public.update_menu_item_details(
  item_id text,
  item_name_ar text,
  item_name_en text,
  item_category text,
  item_price numeric,
  item_calories integer,
  item_image text,
  item_sizes jsonb,
  item_is_available boolean,
  item_sort_order bigint
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if item_id is null or btrim(item_id) = '' then
    raise exception 'Item id is required';
  end if;

  if item_name_ar is null or btrim(item_name_ar) = '' then
    raise exception 'Arabic item name is required';
  end if;

  if item_name_en is null or btrim(item_name_en) = '' then
    raise exception 'English item name is required';
  end if;

  if item_price is null or item_price <= 0 then
    raise exception 'A valid item price is required';
  end if;

  if item_sizes is not null and jsonb_typeof(item_sizes) <> 'array' then
    raise exception 'Sizes must be a JSON array';
  end if;

  update public.menu_items
  set
    "nameAr" = btrim(item_name_ar),
    "nameEn" = btrim(item_name_en),
    category = item_category,
    price = item_price,
    calories = item_calories,
    image = item_image,
    sizes = item_sizes,
    "isAvailable" = item_is_available,
    "sortOrder" = item_sort_order,
    "updatedAt" = now()
  where id = item_id;

  if not found then
    raise exception 'Menu item not found';
  end if;
end;
$$;

revoke all
on function public.update_menu_item_details(
  text,
  text,
  text,
  text,
  numeric,
  integer,
  text,
  jsonb,
  boolean,
  bigint
)
from public;

grant execute
on function public.update_menu_item_details(
  text,
  text,
  text,
  text,
  numeric,
  integer,
  text,
  jsonb,
  boolean,
  bigint
)
to anon, authenticated;
