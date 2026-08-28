-- ============================================================
-- CAFÉTA - BUSINESS & DISCOVERY DATABASE
-- Run AFTER the existing profiles/auth setup
-- ============================================================


-- ============================================================
-- ENUMS
-- ============================================================

create type public.business_member_role as enum (
  'owner',
  'manager',
  'staff'
);

create type public.business_status as enum (
  'draft',
  'pending',
  'approved',
  'rejected',
  'suspended'
);

create type public.business_category as enum (
  'coffee_shop',
  'cafe',
  'milk_tea',
  'bakery_cafe',
  'restaurant_cafe',
  'other'
);


-- ============================================================
-- BUSINESSES
-- ============================================================

create table public.businesses (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text not null unique,

  category public.business_category not null,

  description text,

  logo_url text,
  cover_url text,

  phone text,
  email text,

  facebook_url text,
  instagram_url text,
  website_url text,

  address text not null,
  barangay text,
  city text not null,
  province text not null default 'Basilan',

  latitude double precision not null,
  longitude double precision not null,

  status public.business_status not null default 'draft',
  is_verified boolean not null default false,

  created_by uuid
    references public.profiles(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint businesses_latitude_check
    check (latitude between -90 and 90),

  constraint businesses_longitude_check
    check (longitude between -180 and 180),

  constraint businesses_name_not_empty
    check (char_length(trim(name)) > 0),

  constraint businesses_slug_not_empty
    check (char_length(trim(slug)) > 0)
);


-- ============================================================
-- BUSINESS MEMBERS
-- Connects CAFÉTA users to businesses
-- ============================================================

create table public.business_members (
  business_id uuid not null
    references public.businesses(id)
    on delete cascade,

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  role public.business_member_role not null default 'staff',

  created_at timestamptz not null default now(),

  primary key (business_id, user_id)
);


-- ============================================================
-- BUSINESS HOURS
-- 0 = Sunday
-- 1 = Monday
-- ...
-- 6 = Saturday
-- ============================================================

create table public.business_hours (
  id uuid primary key default gen_random_uuid(),

  business_id uuid not null
    references public.businesses(id)
    on delete cascade,

  day_of_week smallint not null,

  opens_at time,
  closes_at time,

  is_closed boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint business_hours_day_check
    check (day_of_week between 0 and 6),

  constraint business_hours_unique_day
    unique (business_id, day_of_week)
);


-- ============================================================
-- BUSINESS IMAGES
-- ============================================================

create table public.business_images (
  id uuid primary key default gen_random_uuid(),

  business_id uuid not null
    references public.businesses(id)
    on delete cascade,

  uploaded_by uuid
    references public.profiles(id)
    on delete set null,

  image_url text not null,

  alt_text text,

  sort_order integer not null default 0,

  created_at timestamptz not null default now()
);


-- ============================================================
-- FAVORITES
-- ============================================================

create table public.favorites (
  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  business_id uuid not null
    references public.businesses(id)
    on delete cascade,

  created_at timestamptz not null default now(),

  primary key (user_id, business_id)
);


-- ============================================================
-- REVIEWS
-- ============================================================

create table public.reviews (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  business_id uuid not null
    references public.businesses(id)
    on delete cascade,

  rating smallint not null,

  content text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint reviews_rating_check
    check (rating between 1 and 5),

  constraint reviews_one_per_user_business
    unique (user_id, business_id)
);


-- ============================================================
-- INDEXES
-- ============================================================

create index businesses_status_idx
on public.businesses(status);

create index businesses_category_idx
on public.businesses(category);

create index businesses_city_idx
on public.businesses(city);

create index businesses_location_idx
on public.businesses(latitude, longitude);

create index business_members_user_idx
on public.business_members(user_id);

create index business_members_business_idx
on public.business_members(business_id);

create index business_hours_business_idx
on public.business_hours(business_id);

create index business_images_business_idx
on public.business_images(business_id);

create index favorites_user_idx
on public.favorites(user_id);

create index favorites_business_idx
on public.favorites(business_id);

create index reviews_user_idx
on public.reviews(user_id);

create index reviews_business_idx
on public.reviews(business_id);


-- ============================================================
-- UPDATED_AT TRIGGERS
-- Reuse your EXISTING handle_updated_at() function
-- ============================================================

create trigger on_business_updated
before update on public.businesses
for each row
execute procedure public.handle_updated_at();


create trigger on_business_hours_updated
before update on public.business_hours
for each row
execute procedure public.handle_updated_at();


create trigger on_review_updated
before update on public.reviews
for each row
execute procedure public.handle_updated_at();


-- ============================================================
-- ENABLE RLS
-- ============================================================

alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.business_hours enable row level security;
alter table public.business_images enable row level security;
alter table public.favorites enable row level security;
alter table public.reviews enable row level security;


-- Anyone can see approved businesses.

create policy "Approved businesses are public"
on public.businesses
for select
to anon, authenticated
using (
  status = 'approved'
);


-- Logged-in users can see businesses they created.

create policy "Creators can view own businesses"
on public.businesses
for select
to authenticated
using (
  created_by = (select auth.uid())
);


-- Logged-in users can create a business.

create policy "Users can create businesses"
on public.businesses
for insert
to authenticated
with check (
  created_by = (select auth.uid())
);


-- Owners and managers can update their business.

create policy "Owners and managers can update businesses"
on public.businesses
for update
to authenticated
using (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = businesses.id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'manager')
  )
)
with check (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = businesses.id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'manager')
  )
);

create policy "Users can view own favorites"
on public.favorites
for select
to authenticated
using (
  user_id = (select auth.uid())
);


create policy "Users can add favorites"
on public.favorites
for insert
to authenticated
with check (
  user_id = (select auth.uid())
);


create policy "Users can remove favorites"
on public.favorites
for delete
to authenticated
using (
  user_id = (select auth.uid())
);

create policy "Approved business reviews are public"
on public.reviews
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.businesses b
    where b.id = reviews.business_id
      and b.status = 'approved'
  )
);


create policy "Users can create reviews"
on public.reviews
for insert
to authenticated
with check (
  user_id = (select auth.uid())

  and exists (
    select 1
    from public.businesses b
    where b.id = reviews.business_id
      and b.status = 'approved'
  )
);


create policy "Users can update own reviews"
on public.reviews
for update
to authenticated
using (
  user_id = (select auth.uid())
)
with check (
  user_id = (select auth.uid())
);


create policy "Users can delete own reviews"
on public.reviews
for delete
to authenticated
using (
  user_id = (select auth.uid())
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
begin

  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Authentication required';
  end if;


  insert into public.businesses (
    name,
    slug,
    category,
    description,
    address,
    barangay,
    city,
    latitude,
    longitude,
    created_by
  )
  values (
    trim(p_name),
    lower(trim(p_slug)),
    p_category,
    nullif(trim(p_description), ''),
    trim(p_address),
    nullif(trim(p_barangay), ''),
    trim(p_city),
    p_latitude,
    p_longitude,
    v_user_id
  )
  returning id into v_business_id;


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

create policy "Users can view own business memberships"
on public.business_members
for select
to authenticated
using (
  user_id = (select auth.uid())
);

create policy "Approved business hours are public"
on public.business_hours
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.businesses b
    where b.id = business_hours.business_id
      and b.status = 'approved'
  )
);

create policy "Business managers can insert hours"
on public.business_hours
for insert
to authenticated
with check (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = business_hours.business_id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'manager')
  )
);


create policy "Business managers can update hours"
on public.business_hours
for update
to authenticated
using (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = business_hours.business_id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'manager')
  )
)
with check (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = business_hours.business_id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'manager')
  )
);


create policy "Business managers can delete hours"
on public.business_hours
for delete
to authenticated
using (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = business_hours.business_id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'manager')
  )
);

create policy "Business managers can view own hours"
on public.business_hours
for select
to authenticated
using (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = business_hours.business_id
      and bm.user_id = (select auth.uid())
  )
);

create policy "Approved business images are public"
on public.business_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.businesses b
    where b.id = business_images.business_id
      and b.status = 'approved'
  )
);


create policy "Business members can view own business images"
on public.business_images
for select
to authenticated
using (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = business_images.business_id
      and bm.user_id = (select auth.uid())
  )
);


create policy "Business managers can add images"
on public.business_images
for insert
to authenticated
with check (
  uploaded_by = (select auth.uid())

  and exists (
    select 1
    from public.business_members bm
    where bm.business_id = business_images.business_id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'manager')
  )
);


create policy "Business managers can delete images"
on public.business_images
for delete
to authenticated
using (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = business_images.business_id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'manager')
  )
);

create policy "Business members can view their businesses"
on public.businesses
for select
to authenticated
using (
  exists (
    select 1
    from public.business_members bm
    where bm.business_id = businesses.id
      and bm.user_id = (select auth.uid())
  )
);


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
from anon;

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