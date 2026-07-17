create table if not exists public.menu_items (
  id text primary key,
  "nameAr" text not null,
  "nameEn" text not null,
  category text not null,
  price numeric(10, 2) not null check (price >= 0),
  calories integer check (calories is null or calories >= 0),
  image text not null,
  sizes jsonb,
  "isAvailable" boolean not null default true,
  "allowExtraChicken" boolean not null default true,
  "sortOrder" bigint not null default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

alter table public.menu_items
add column if not exists "allowExtraChicken" boolean not null default true;

alter table public.menu_items enable row level security;

create index if not exists menu_items_available_sort_idx
on public.menu_items ("isAvailable", "sortOrder", "nameAr");

drop policy if exists "Customers can read available menu items" on public.menu_items;
create policy "Customers can read available menu items"
on public.menu_items
for select
to anon, authenticated
using ("isAvailable" = true or (auth.jwt() ->> 'email') = 'helpooclassmate@gmail.com');

drop policy if exists "Staff can create menu items" on public.menu_items;
create policy "Staff can create menu items"
on public.menu_items
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'helpooclassmate@gmail.com');

drop policy if exists "Staff can update menu items" on public.menu_items;
create policy "Staff can update menu items"
on public.menu_items
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'helpooclassmate@gmail.com')
with check ((auth.jwt() ->> 'email') = 'helpooclassmate@gmail.com');

drop policy if exists "Staff can delete menu items" on public.menu_items;
create policy "Staff can delete menu items"
on public.menu_items
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'helpooclassmate@gmail.com');

do $$
begin
  alter publication supabase_realtime add table public.menu_items;
exception
  when duplicate_object then null;
end $$;
