alter table public.profiles
add column if not exists onboarding_completed boolean not null default false;

alter table public.profiles
add column if not exists preferred_purpose text;

alter table public.profiles
add column if not exists cafe_preferences text[] not null default '{}';

alter table public.profiles
add column if not exists location_enabled boolean not null default false;



alter table public.profiles
drop column if exists onboarding_completed,
drop column if exists preferred_purpose,
drop column if exists cafe_preferences,
drop column if exists location_enabled;