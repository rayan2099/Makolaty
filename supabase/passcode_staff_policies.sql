drop policy if exists "Staff can read orders" on public.orders;
drop policy if exists "Staff can update order status" on public.orders;

create policy "Passcode dashboard can read orders"
on public.orders
for select
to anon, authenticated
using (true);

create policy "Passcode dashboard can update order status"
on public.orders
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Customers can read available menu items" on public.menu_items;
drop policy if exists "Staff can create menu items" on public.menu_items;
drop policy if exists "Staff can update menu items" on public.menu_items;
drop policy if exists "Staff can delete menu items" on public.menu_items;

create policy "Anyone can read available menu items"
on public.menu_items
for select
to anon, authenticated
using ("isAvailable" = true);

create policy "Passcode dashboard can manage menu items"
on public.menu_items
for all
to anon, authenticated
using (true)
with check (true);
