create table public.saved_businesses (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  business_id uuid not null
    references public.businesses(id)
    on delete cascade,

  created_at timestamptz not null default now(),

  constraint saved_businesses_user_business_unique
    unique (user_id, business_id)
);

alter table public.saved_businesses
enable row level security;


create policy "Users can view own saved businesses"
on public.saved_businesses
for select
to authenticated
using (
  (select auth.uid()) = user_id
);


create policy "Users can save businesses"
on public.saved_businesses
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);


create policy "Users can remove own saved businesses"
on public.saved_businesses
for delete
to authenticated
using (
  (select auth.uid()) = user_id
);


create index saved_businesses_user_id_idx
on public.saved_businesses(user_id);

create index saved_businesses_business_id_idx
on public.saved_businesses(business_id);