create extension if not exists pgcrypto;

do $$
begin
  create type public.order_type as enum ('pickup', 'delivery');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.order_status as enum ('pending', 'confirmed', 'completed', 'cancelled');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  "customerName" text not null,
  "customerPhone" text not null,
  "orderType" public.order_type not null,
  "googleMapsLink" text,
  items jsonb not null,
  subtotal numeric(10, 2) not null default 0 check (subtotal >= 0),
  "deliveryFee" numeric(10, 2) not null default 0 check ("deliveryFee" >= 0),
  "deliveryDistanceKm" numeric(8, 2) check ("deliveryDistanceKm" is null or "deliveryDistanceKm" >= 0),
  total numeric(10, 2) not null check (total >= 0),
  notes text,
  status public.order_status not null default 'pending',
  "createdAt" timestamptz not null default now()
);

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
  "sortOrder" bigint not null default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

alter table public.orders enable row level security;
alter table public.menu_items enable row level security;

create index if not exists orders_created_at_idx on public.orders ("createdAt" desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists menu_items_available_sort_idx on public.menu_items ("isAvailable", "sortOrder", "nameAr");

drop policy if exists "Customers can create orders" on public.orders;
create policy "Customers can create orders"
on public.orders
for insert
to anon, authenticated
with check (
  status = 'pending'
  and jsonb_typeof(items) = 'array'
  and jsonb_array_length(items) > 0
  and total = subtotal + "deliveryFee"
  and (
    ("orderType" = 'pickup' and "deliveryFee" = 0 and "deliveryDistanceKm" is null)
    or
    ("orderType" = 'delivery' and "googleMapsLink" is not null and "deliveryDistanceKm" is not null)
  )
);

drop policy if exists "Staff can read orders" on public.orders;
create policy "Staff can read orders"
on public.orders
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'helpooclassmate@gmail.com');

drop policy if exists "Staff can update order status" on public.orders;
create policy "Staff can update order status"
on public.orders
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'helpooclassmate@gmail.com')
with check ((auth.jwt() ->> 'email') = 'helpooclassmate@gmail.com');

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
  alter publication supabase_realtime add table public.orders;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.menu_items;
exception
  when duplicate_object then null;
end $$;
