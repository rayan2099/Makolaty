create or replace function public.update_order_status_passcode(
  order_id uuid,
  new_status public.order_status
)
returns table (
  id uuid,
  status public.order_status
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if new_status not in (
    'pending'::public.order_status,
    'completed'::public.order_status,
    'cancelled'::public.order_status
  ) then
    raise exception 'Unsupported order status';
  end if;

  return query
  update public.orders as target
  set status = new_status
  where target.id = order_id
  returning target.id, target.status;
end;
$$;

revoke all on function public.update_order_status_passcode(uuid, public.order_status) from public;
grant execute on function public.update_order_status_passcode(uuid, public.order_status) to anon, authenticated;
