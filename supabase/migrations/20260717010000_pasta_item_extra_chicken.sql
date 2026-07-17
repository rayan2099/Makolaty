begin;

alter table public.menu_items
add column if not exists "allowExtraChicken" boolean not null default true;

create or replace function public.set_pasta_item_extra_chicken(
  item_id text,
  item_allow_extra_chicken boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.menu_items
  set
    "allowExtraChicken" = item_allow_extra_chicken,
    "updatedAt" = now()
  where id = item_id
    and category = 'pasta'
    and id <> 'pasta-extra-chicken';

  if not found then
    raise exception 'Pasta item not found';
  end if;
end;
$$;

revoke all
on function public.set_pasta_item_extra_chicken(text, boolean)
from public;

grant execute
on function public.set_pasta_item_extra_chicken(text, boolean)
to anon, authenticated;

commit;
