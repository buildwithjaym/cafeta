-- =========================================================
-- CAFÉTA
-- BUSINESS MEDIA STORAGE
-- =========================================================


-- ---------------------------------------------------------
-- 1. CREATE / UPDATE BUCKET
-- ---------------------------------------------------------

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'business-media',
  'business-media',
  true,
  5242880,
  array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id)
do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


-- ---------------------------------------------------------
-- 2. REMOVE OLD POLICIES
-- ---------------------------------------------------------

drop policy if exists
  "Public can view business media"
on storage.objects;

drop policy if exists
  "Business members can upload media"
on storage.objects;

drop policy if exists
  "Business members can update media"
on storage.objects;

drop policy if exists
  "Business members can delete media"
on storage.objects;


-- ---------------------------------------------------------
-- 3. PUBLIC READ
-- ---------------------------------------------------------

create policy "Public can view business media"
on storage.objects
for select
to public
using (
  bucket_id = 'business-media'
);


-- ---------------------------------------------------------
-- 4. AUTHENTICATED BUSINESS MEMBER UPLOAD
--
-- Expected path:
-- {business_id}/logo.webp
-- {business_id}/cover.webp
-- ---------------------------------------------------------

create policy "Business members can upload media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'business-media'

  and (storage.foldername(name))[1] is not null

  and exists (
    select 1
    from public.business_members bm
    where bm.user_id = (select auth.uid())
      and bm.business_id::text =
        (storage.foldername(name))[1]
  )
);


-- ---------------------------------------------------------
-- 5. AUTHENTICATED BUSINESS MEMBER UPDATE
-- ---------------------------------------------------------

create policy "Business members can update media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'business-media'

  and (storage.foldername(name))[1] is not null

  and exists (
    select 1
    from public.business_members bm
    where bm.user_id = (select auth.uid())
      and bm.business_id::text =
        (storage.foldername(name))[1]
  )
)
with check (
  bucket_id = 'business-media'

  and (storage.foldername(name))[1] is not null

  and exists (
    select 1
    from public.business_members bm
    where bm.user_id = (select auth.uid())
      and bm.business_id::text =
        (storage.foldername(name))[1]
  )
);


-- ---------------------------------------------------------
-- 6. AUTHENTICATED BUSINESS MEMBER DELETE
-- ---------------------------------------------------------

create policy "Business members can delete media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'business-media'

  and (storage.foldername(name))[1] is not null

  and exists (
    select 1
    from public.business_members bm
    where bm.user_id = (select auth.uid())
      and bm.business_id::text =
        (storage.foldername(name))[1]
  )
);


-- ---------------------------------------------------------
-- 7. INDEX FOR STORAGE POLICY LOOKUPS
-- ---------------------------------------------------------

create index if not exists
  business_members_business_user_idx
on public.business_members (
  business_id,
  user_id
);

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

  v_slug := trim(both '-' from v_slug);

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