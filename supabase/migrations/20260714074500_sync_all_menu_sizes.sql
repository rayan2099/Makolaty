-- Full authoritative size-tier synchronization from the printed menu.
-- This intentionally rewrites every known item that has printed size prices,
-- even when its base price was already correct.

with authoritative_sizes (id, price, sizes) as (
  values
    ('ap-2', 6::numeric, '[{"name":"صغير","price":6},{"name":"وسط","price":8},{"name":"كبير","price":14}]'::jsonb),
    ('ap-5', 6::numeric, '[{"name":"صغير","price":6},{"name":"كبير","price":15}]'::jsonb),

    ('ps-1', 10::numeric, '[{"name":"صغير","price":10},{"name":"كبير","price":20}]'::jsonb),
    ('ps-2', 15::numeric, '[{"name":"صغير","price":15},{"name":"كبير","price":25}]'::jsonb),
    ('ps-3', 15::numeric, '[{"name":"صغير","price":15},{"name":"كبير","price":25}]'::jsonb),
    ('ps-4', 20::numeric, '[{"name":"صغير","price":20},{"name":"كبير","price":30}]'::jsonb),
    ('ps-5', 10::numeric, '[{"name":"صغير","price":10},{"name":"كبير","price":20}]'::jsonb),
    ('ps-6', 15::numeric, '[{"name":"صغير","price":15},{"name":"كبير","price":25}]'::jsonb),
    ('ps-7', 20::numeric, '[{"name":"صغير","price":20},{"name":"كبير","price":31}]'::jsonb),
    ('ps-8', 10::numeric, '[{"name":"صغير","price":10},{"name":"كبير","price":20}]'::jsonb),
    ('ps-9', 15::numeric, '[{"name":"صغير","price":15},{"name":"كبير","price":25}]'::jsonb),

    ('pz-1', 16::numeric, '[{"name":"صغير","price":16},{"name":"وسط","price":27},{"name":"كبير","price":32}]'::jsonb),
    ('pz-2', 10::numeric, '[{"name":"صغير","price":10},{"name":"وسط","price":17},{"name":"كبير","price":23}]'::jsonb),
    ('pz-3', 13::numeric, '[{"name":"صغير","price":13},{"name":"وسط","price":24},{"name":"كبير","price":29}]'::jsonb),
    ('pz-4', 10::numeric, '[{"name":"صغير","price":10},{"name":"وسط","price":17},{"name":"كبير","price":23}]'::jsonb),
    ('pz-5', 9::numeric, '[{"name":"صغير","price":9},{"name":"وسط","price":16},{"name":"كبير","price":22}]'::jsonb),
    ('pz-6', 13::numeric, '[{"name":"صغير","price":13},{"name":"وسط","price":24},{"name":"كبير","price":29}]'::jsonb),
    ('pz-7', 13::numeric, '[{"name":"صغير","price":13},{"name":"وسط","price":24},{"name":"كبير","price":29}]'::jsonb),
    ('pz-8', 13::numeric, '[{"name":"صغير","price":13},{"name":"وسط","price":24},{"name":"كبير","price":29}]'::jsonb),
    ('pz-9', 15::numeric, '[{"name":"صغير","price":15},{"name":"وسط","price":25},{"name":"كبير","price":30}]'::jsonb),
    ('pz-10', 10::numeric, '[{"name":"صغير","price":10},{"name":"وسط","price":17},{"name":"كبير","price":23}]'::jsonb),
    ('pz-11', 13::numeric, '[{"name":"صغير","price":13},{"name":"وسط","price":24},{"name":"كبير","price":29}]'::jsonb),

    ('pt-1', 7::numeric, '[{"name":"صغير","price":7},{"name":"وسط","price":11},{"name":"كبير","price":17}]'::jsonb),
    ('pt-2', 10::numeric, '[{"name":"صغير","price":10},{"name":"وسط","price":16},{"name":"كبير","price":22}]'::jsonb),
    ('pt-3', 8::numeric, '[{"name":"صغير","price":8},{"name":"وسط","price":13},{"name":"كبير","price":18}]'::jsonb),
    ('pt-4', 9::numeric, '[{"name":"صغير","price":9},{"name":"وسط","price":17},{"name":"كبير","price":23}]'::jsonb),
    ('pt-5', 8::numeric, '[{"name":"صغير","price":8},{"name":"وسط","price":13},{"name":"كبير","price":18}]'::jsonb),
    ('pt-6', 8::numeric, '[{"name":"صغير","price":8},{"name":"وسط","price":13},{"name":"كبير","price":18}]'::jsonb),
    ('pt-7', 9::numeric, '[{"name":"صغير","price":9},{"name":"وسط","price":16},{"name":"كبير","price":22}]'::jsonb),
    ('pt-8', 7::numeric, '[{"name":"صغير","price":7},{"name":"وسط","price":12},{"name":"كبير","price":17}]'::jsonb),
    ('pt-9', 7::numeric, '[{"name":"صغير","price":7},{"name":"وسط","price":12},{"name":"كبير","price":17}]'::jsonb),
    ('pt-10', 9::numeric, '[{"name":"صغير","price":9},{"name":"وسط","price":16},{"name":"كبير","price":22}]'::jsonb),
    ('pt-11', 9::numeric, '[{"name":"صغير","price":9},{"name":"وسط","price":16},{"name":"كبير","price":22}]'::jsonb),
    ('pt-12', 5::numeric, '[{"name":"الحبة","price":5},{"name":"صحن مشكل","price":30}]'::jsonb),
    ('pt-13', 8::numeric, '[{"name":"صغير","price":8},{"name":"وسط","price":13},{"name":"كبير","price":18}]'::jsonb),
    ('pt-15', 9::numeric, '[{"name":"صغير","price":9},{"name":"وسط","price":16},{"name":"كبير","price":22}]'::jsonb),
    ('pt-16', 9::numeric, '[{"name":"صغير","price":9},{"name":"وسط","price":16},{"name":"كبير","price":22}]'::jsonb),

    ('broast-chicken', 18::numeric, '[{"name":"عادي","price":18},{"name":"حراق","price":18}]'::jsonb)
)
update public.menu_items as menu
set
  price = source.price,
  sizes = source.sizes,
  "updatedAt" = now()
from authoritative_sizes as source
where menu.id = source.id;

-- These printed-menu items have one fixed price and must not show size buttons.
with fixed_price_items (id, price) as (
  values
    ('pt-14', 15::numeric),
    ('broast-nuggets-regular', 18::numeric),
    ('broast-nuggets-spicy', 18::numeric)
)
update public.menu_items as menu
set
  price = source.price,
  sizes = null,
  "updatedAt" = now()
from fixed_price_items as source
where menu.id = source.id;
