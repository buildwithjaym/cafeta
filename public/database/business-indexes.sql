
drop index if exists public.business_members_business_idx;




-- ============================================================
-- CAFÉTA BUSINESS CREATION HARDENING
-- ============================================================

-- Faster profile -> created businesses lookup
create index if not exists businesses_created_by_idx
on public.businesses(created_by);

-- Common Explore query:
-- where status = 'approved'
-- and category = ...
create index if not exists businesses_status_category_idx
on public.businesses(status, category);

-- Dashboard/profile lookup
create index if not exists businesses_created_at_idx
on public.businesses(created_at desc);

-- Business gallery ordering
create index if not exists business_images_business_sort_idx
on public.business_images(
  business_id,
  sort_order
);

-- Reviews displayed newest-first
create index if not exists reviews_business_created_at_idx
on public.reviews(
  business_id,
  created_at desc
);

-- Normalize slug uniqueness.
-- Your existing UNIQUE(slug) is case-sensitive.
create unique index if not exists businesses_slug_lower_unique
on public.businesses(lower(slug));

-- Prevent empty addresses/cities.
alter table public.businesses
drop constraint if exists businesses_address_not_empty;

alter table public.businesses
add constraint businesses_address_not_empty
check (
  char_length(trim(address)) > 0
);

alter table public.businesses
drop constraint if exists businesses_city_not_empty;

alter table public.businesses
add constraint businesses_city_not_empty
check (
  char_length(trim(city)) > 0
);

-- Hours consistency.
alter table public.business_hours
drop constraint if exists business_hours_time_check;

alter table public.business_hours
add constraint business_hours_time_check
check (
  (
    is_closed = true
  )
  or
  (
    opens_at is not null
    and closes_at is not null
  )
);


create or replace function public.create_business(
  p_name text,
  p_slug text,
  p_category public.business_category,
  p_description text,
  p_address text,
  p_barangay text,
  p_city text,
  p_latitude double precision,
  p_longitude double precision
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_business_id uuid;
  v_name text;
  v_slug text;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1
    from public.profiles p
    where p.id = v_user_id
  ) then
    raise exception 'Profile not found';
  end if;

  v_name := trim(p_name);

  v_slug := lower(
    trim(
      both '-'
      from regexp_replace(
        trim(p_slug),
        '[^a-zA-Z0-9]+',
        '-',
        'g'
      )
    )
  );

  if v_name = '' then
    raise exception 'Business name is required';
  end if;

  if char_length(v_name) > 120 then
    raise exception 'Business name is too long';
  end if;

  if v_slug = '' then
    raise exception 'Business slug is required';
  end if;

  if char_length(v_slug) > 140 then
    raise exception 'Business slug is too long';
  end if;

  if trim(p_address) = '' then
    raise exception 'Business address is required';
  end if;

  if trim(p_city) = '' then
    raise exception 'City is required';
  end if;

  if p_latitude is null
     or p_latitude < -90
     or p_latitude > 90 then
    raise exception 'Invalid latitude';
  end if;

  if p_longitude is null
     or p_longitude < -180
     or p_longitude > 180 then
    raise exception 'Invalid longitude';
  end if;

  if exists (
    select 1
    from public.businesses b
    where lower(b.slug) = v_slug
  ) then
    raise exception 'Business slug already exists';
  end if;

  insert into public.businesses (
    name,
    slug,
    category,
    description,

    address,
    barangay,
    city,
    province,

    latitude,
    longitude,

    status,
    is_verified,

    created_by
  )
  values (
    v_name,
    v_slug,
    p_category,

    nullif(
      trim(p_description),
      ''
    ),

    trim(p_address),

    nullif(
      trim(p_barangay),
      ''
    ),

    trim(p_city),

    'Basilan',

    p_latitude,
    p_longitude,

    'draft',
    false,

    v_user_id
  )
  returning id
  into v_business_id;

  insert into public.business_members (
    business_id,
    user_id,
    role
  )
  values (
    v_business_id,
    v_user_id,
    'owner'
  );

  return v_business_id;
end;
$$;

revoke all
on function public.create_business(
  text,
  text,
  public.business_category,
  text,
  text,
  text,
  text,
  double precision,
  double precision
)
from public;

grant execute
on function public.create_business(
  text,
  text,
  public.business_category,
  text,
  text,
  text,
  text,
  double precision,
  double precision
)
to authenticated;


-- ============================================================
-- CAFÉTA BASIC BUSINESS MENU
-- ============================================================

create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),

  business_id uuid not null
    references public.businesses(id)
    on delete cascade,

  name text not null,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),

  constraint menu_categories_name_not_empty
    check (char_length(trim(name)) > 0),

  constraint menu_categories_unique_name
    unique (business_id, name)
);


create table public.menu_items (
  id uuid primary key default gen_random_uuid(),

  business_id uuid not null
    references public.businesses(id)
    on delete cascade,

  category_id uuid
    references public.menu_categories(id)
    on delete set null,

  name text not null,

  description text,

  price numeric(10, 2) not null,

  image_url text,

  is_available boolean not null default true,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint menu_items_name_not_empty
    check (char_length(trim(name)) > 0),

  constraint menu_items_price_check
    check (price >= 0)
);


-- ============================================================
-- INDEXES
-- ============================================================

create index menu_categories_business_idx
on public.menu_categories(
  business_id,
  sort_order
);

create index menu_items_business_idx
on public.menu_items(
  business_id,
  sort_order
);

create index menu_items_category_idx
on public.menu_items(
  category_id,
  sort_order
);

create index menu_items_available_idx
on public.menu_items(
  business_id,
  is_available
);


-- ============================================================
-- UPDATED AT
-- ============================================================

create trigger on_menu_item_updated
before update on public.menu_items
for each row
execute procedure public.handle_updated_at();


-- ============================================================
-- RLS
-- ============================================================

alter table public.menu_categories
enable row level security;

alter table public.menu_items
enable row level security;


-- Public can view menu categories belonging to approved businesses.

create policy "Approved business menu categories are public"
on public.menu_categories
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.businesses b
    where b.id = menu_categories.business_id
      and b.status = 'approved'
  )
);


-- Business members can view their own menu categories,
-- including draft/pending businesses.

create policy "Business members can view own menu categories"
on public.menu_categories
for select
to authenticated
using (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = menu_categories.business_id
      and bm.user_id = (select auth.uid())
  )
);


create policy "Business managers can create menu categories"
on public.menu_categories
for insert
to authenticated
with check (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = menu_categories.business_id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'manager')
  )
);


create policy "Business managers can update menu categories"
on public.menu_categories
for update
to authenticated
using (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = menu_categories.business_id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'manager')
  )
)
with check (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = menu_categories.business_id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'manager')
  )
);


create policy "Business managers can delete menu categories"
on public.menu_categories
for delete
to authenticated
using (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = menu_categories.business_id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'manager')
  )
);


-- Public menu items.

create policy "Approved business menu items are public"
on public.menu_items
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.businesses b
    where b.id = menu_items.business_id
      and b.status = 'approved'
  )
);


create policy "Business members can view own menu items"
on public.menu_items
for select
to authenticated
using (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = menu_items.business_id
      and bm.user_id = (select auth.uid())
  )
);


create policy "Business managers can create menu items"
on public.menu_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = menu_items.business_id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'manager')
  )

  and (
    menu_items.category_id is null

    or exists (
      select 1
      from public.menu_categories mc
      where mc.id = menu_items.category_id
        and mc.business_id = menu_items.business_id
    )
  )
);


create policy "Business managers can update menu items"
on public.menu_items
for update
to authenticated
using (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = menu_items.business_id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'manager')
  )
)
with check (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = menu_items.business_id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'manager')
  )

  and (
    menu_items.category_id is null

    or exists (
      select 1
      from public.menu_categories mc
      where mc.id = menu_items.category_id
        and mc.business_id = menu_items.business_id
    )
  )
);


create policy "Business managers can delete menu items"
on public.menu_items
for delete
to authenticated
using (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = menu_items.business_id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'manager')
  )
);