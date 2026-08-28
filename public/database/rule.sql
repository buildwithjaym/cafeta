create or replace function public.explore_businesses(
  search_term text default null,
  category_filter public.business_category default null,
  page_limit integer default 12,
  page_offset integer default 0
)
returns table (
  id uuid,
  name text,
  slug text,
  category public.business_category,
  description text,

  cover_url text,
  logo_url text,

  address text,
  barangay text,
  city text,
  province text,

  latitude double precision,
  longitude double precision,

  is_verified boolean,

  avg_rating numeric,
  review_count bigint,

  is_saved boolean,

  today_opens_at time,
  today_closes_at time,
  today_is_closed boolean,

  total_count bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  with matching_businesses as (
    select
      b.id,
      b.name,
      b.slug,
      b.category,
      b.description,

      b.cover_url,
      b.logo_url,

      b.address,
      b.barangay,
      b.city,
      b.province,

      b.latitude,
      b.longitude,

      b.is_verified

    from public.businesses b

    where
      b.status = 'approved'

      and (
        category_filter is null
        or b.category = category_filter
      )

      and (
        search_term is null
        or trim(search_term) = ''

        or b.name ilike '%' || trim(search_term) || '%'

        or coalesce(b.description, '')
          ilike '%' || trim(search_term) || '%'

        or b.address
          ilike '%' || trim(search_term) || '%'

        or coalesce(b.barangay, '')
          ilike '%' || trim(search_term) || '%'

        or b.city
          ilike '%' || trim(search_term) || '%'

        or b.province
          ilike '%' || trim(search_term) || '%'
      )
  ),

  review_stats as (
    select
      r.business_id,

      round(
        avg(r.rating)::numeric,
        1
      ) as avg_rating,

      count(*)::bigint as review_count

    from public.reviews r

    group by r.business_id
  ),

  result as (
    select
      b.id,
      b.name,
      b.slug,
      b.category,
      b.description,

      b.cover_url,
      b.logo_url,

      b.address,
      b.barangay,
      b.city,
      b.province,

      b.latitude,
      b.longitude,

      b.is_verified,

      coalesce(
        rs.avg_rating,
        0::numeric
      ) as avg_rating,

      coalesce(
        rs.review_count,
        0::bigint
      ) as review_count,

      case
        when auth.uid() is null then false

        else exists (
          select 1
          from public.saved_businesses sb

          where sb.business_id = b.id
            and sb.user_id = auth.uid()
        )
      end as is_saved,

      bh.opens_at as today_opens_at,
      bh.closes_at as today_closes_at,

      coalesce(
        bh.is_closed,
        true
      ) as today_is_closed,

      count(*) over ()::bigint
        as total_count

    from matching_businesses b

    left join review_stats rs
      on rs.business_id = b.id

    left join public.business_hours bh
      on bh.business_id = b.id
      and bh.day_of_week =
        extract(dow from current_date)::smallint
  )

  select *
  from result

  order by
    is_verified desc,
    avg_rating desc,
    review_count desc,
    name asc,
    id asc

  limit least(
    greatest(page_limit, 1),
    50
  )

  offset greatest(page_offset, 0);
$$;

revoke all
on function public.explore_businesses(
  text,
  public.business_category,
  integer,
  integer
)
from public;

grant execute
on function public.explore_businesses(
  text,
  public.business_category,
  integer,
  integer
)
to anon, authenticated;


drop function if exists public.create_business(
  text,
  text,
  public.business_category,
  text,
  text,
  text,
  text,
  double precision,
  double precision
);

create or replace function public.create_business(
  p_name text,
  p_slug text,
  p_category public.business_category,
  p_description text default null,
  p_address text default null,
  p_barangay text default null,
  p_city text default 'Isabela City',
  p_latitude double precision default null,
  p_longitude double precision default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_business_id uuid;
  v_slug text;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Authentication required'
      using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.profiles p
    where p.id = v_user_id
  ) then
    raise exception 'Profile not found'
      using errcode = 'P0001';
  end if;

  if p_name is null
     or char_length(trim(p_name)) < 2 then
    raise exception 'Business name is required'
      using errcode = '22023';
  end if;

  v_slug := lower(trim(p_slug));

  v_slug := regexp_replace(
    v_slug,
    '[^a-z0-9]+',
    '-',
    'g'
  );

  v_slug := trim(
    both '-' from v_slug
  );

  if char_length(v_slug) < 2 then
    raise exception 'Invalid business URL'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from public.businesses b
    where lower(b.slug) = v_slug
  ) then
    raise exception 'Business URL already exists'
      using errcode = '23505';
  end if;

  if p_address is null
     or trim(p_address) = '' then
    raise exception 'Business address is required'
      using errcode = '22023';
  end if;

  if p_city is null
     or trim(p_city) = '' then
    raise exception 'Business city is required'
      using errcode = '22023';
  end if;

  if p_latitude is null
     or p_latitude < -90
     or p_latitude > 90 then
    raise exception 'Invalid latitude'
      using errcode = '22023';
  end if;

  if p_longitude is null
     or p_longitude < -180
     or p_longitude > 180 then
    raise exception 'Invalid longitude'
      using errcode = '22023';
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
    trim(p_name),
    v_slug,
    p_category,
    nullif(trim(p_description), ''),
    trim(p_address),
    nullif(trim(p_barangay), ''),
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

  update public.profiles
  set role = 'business_owner'
  where id = v_user_id
    and role = 'user';

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

alter table public.businesses
enable row level security;

alter table public.business_members
enable row level security;

alter table public.business_hours
enable row level security;

alter table public.menu_categories
enable row level security;

alter table public.menu_items
enable row level security;


drop policy if exists
  "Business members can update businesses"
on public.businesses;

create policy
  "Business members can update businesses"
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


drop policy if exists
  "Business members can manage hours"
on public.business_hours;

create policy
  "Business members can manage hours"
on public.business_hours
for all
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


drop policy if exists
  "Business members can manage menu categories"
on public.menu_categories;

create policy
  "Business members can manage menu categories"
on public.menu_categories
for all
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


drop policy if exists
  "Business members can manage menu items"
on public.menu_items;

create policy
  "Business members can manage menu items"
on public.menu_items
for all
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
);

drop policy if exists
  "Users can view own business memberships"
on public.business_members;

create policy
  "Users can view own business memberships"
on public.business_members
for select
to authenticated
using (
  user_id = (select auth.uid())
);