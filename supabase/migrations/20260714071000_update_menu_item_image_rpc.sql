create or replace function public.update_menu_item_image(
  item_id text,
  image_url text
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

  if image_url is null or btrim(image_url) = '' then
    raise exception 'Image URL is required';
  end if;

  update public.menu_items
  set
    image = image_url,
    "updatedAt" = now()
  where id = item_id;

  if not found then
    raise exception 'Menu item not found';
  end if;
end;
$$;

revoke all on function public.update_menu_item_image(text, text) from public;
grant execute on function public.update_menu_item_image(text, text) to anon, authenticated;
